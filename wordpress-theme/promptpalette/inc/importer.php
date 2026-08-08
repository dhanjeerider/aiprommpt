<?php
/**
 * Sitemap importer — PHP port of the React admin importer.
 *
 * Fetches every URL in a sitemap, extracts the full prompt text, image, category
 * and tags, and skips slugs that already exist so nothing is ever duplicated.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Slug from a URL.
 *
 * @param string $u URL.
 * @return string
 */
function pp_slug_from_url( $u ) {
	$parts = explode( '/', untrailingslashit( $u ) );
	return sanitize_title( end( $parts ) );
}

/**
 * HTML -> text keeping line breaks.
 *
 * @param string $html HTML.
 * @return string
 */
function pp_strip_keep_breaks( $html ) {
	$html = preg_replace( '/<br\s*\/?>/i', "\n", $html );
	$html = preg_replace( '#</(p|div|h[1-6]|li)>#i', "\n", $html );
	$text = wp_strip_all_tags( $html );
	$text = html_entity_decode( $text, ENT_QUOTES, 'UTF-8' );
	$text = str_replace( "\r", '', $text );
	$text = preg_replace( '/[ \t]+\n/', "\n", $text );
	$text = preg_replace( "/\n{3,}/", "\n\n", $text );
	return trim( $text );
}

/**
 * Flatten HTML to a single line of text.
 *
 * @param string $html HTML.
 * @return string
 */
function pp_strip_flat( $html ) {
	$text = html_entity_decode( wp_strip_all_tags( $html ), ENT_QUOTES, 'UTF-8' );
	return trim( preg_replace( '/\s+/', ' ', $text ) );
}

/**
 * First regex capture.
 *
 * @param string $html  Haystack.
 * @param string $regex Pattern.
 * @return string
 */
function pp_first_match( $html, $regex ) {
	return preg_match( $regex, $html, $m ) ? $m[1] : '';
}

/**
 * Extract a prompt post from a remote page.
 *
 * @param string $url  Page URL.
 * @param string $html Page HTML.
 * @return array
 */
function pp_extract_post( $url, $html ) {
	$slug = pp_slug_from_url( $url );

	$title = pp_first_match( $html, '/<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']/i' );
	if ( ! $title ) {
		$title = pp_strip_flat( pp_first_match( $html, '/<h1[^>]*>([\s\S]*?)<\/h1>/i' ) );
	}
	if ( ! $title ) {
		$title = ucwords( str_replace( '-', ' ', $slug ) );
	}

	$excerpt = pp_first_match( $html, '/<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']/i' );
	if ( ! $excerpt ) {
		$excerpt = pp_first_match( $html, '/<meta[^>]+property=["\']og:description["\'][^>]+content=["\']([^"\']+)["\']/i' );
	}
	$image = pp_first_match( $html, '/<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']/i' );

	// The full prompt lives in the <p> carrying both whitespace-pre-wrap and select-all.
	$raw = pp_first_match( $html, '/<p[^>]*class=["\'][^"\']*whitespace-pre-wrap[^"\']*select-all[^"\']*["\'][^>]*>([\s\S]*?)<\/p>/i' );
	if ( ! $raw ) {
		$raw = pp_first_match( $html, '/<p[^>]*class=["\'][^"\']*select-all[^"\']*whitespace-pre-wrap[^"\']*["\'][^>]*>([\s\S]*?)<\/p>/i' );
	}
	$prompt = $raw ? pp_strip_keep_breaks( $raw ) : '';
	if ( ! $prompt ) {
		$pre = pp_first_match( $html, '/<pre[^>]*>([\s\S]*?)<\/pre>/i' );
		if ( $pre ) {
			$prompt = pp_strip_keep_breaks( $pre );
		}
	}
	if ( ! $prompt ) {
		$prompt = $excerpt;
	}

	// Every extra prompt block on the page becomes an additional prompt.
	$extra = array();
	if ( preg_match_all( '/<p[^>]*class=["\'][^"\']*(?:whitespace-pre-wrap[^"\']*select-all|select-all[^"\']*whitespace-pre-wrap)[^"\']*["\'][^>]*>([\s\S]*?)<\/p>/i', $html, $all ) ) {
		foreach ( array_slice( $all[1], 1 ) as $blk ) {
			$t = pp_strip_keep_breaks( $blk );
			if ( $t ) {
				$extra[] = $t;
			}
		}
	}

	// Category: first /library/<slug>/ link that is not the index.
	$category = '';
	if ( preg_match_all( '/href=["\'][^"\']*\/library\/([a-z0-9-]+)\/?["\']/i', $html, $cm ) ) {
		foreach ( $cm[1] as $c ) {
			$c = strtolower( $c );
			if ( $c && 'libraries' !== $c ) {
				$category = $c;
				break;
			}
		}
	}

	// Tags: anchor labels from the tag chip container, numbers dropped.
	$tags = array();
	if ( preg_match_all( '/<a[^>]+href=["\'][^"\']*\/library\/([a-z0-9-]+)\/?["\'][^>]*>([\s\S]*?)<\/a>/i', $html, $tm, PREG_SET_ORDER ) ) {
		foreach ( $tm as $set ) {
			$label = trim( preg_replace( '/^#\s*/', '', pp_strip_flat( $set[2] ) ) );
			if ( ! $label || preg_match( '/^\d+(\.\d+)?$/', $label ) || strlen( $label ) > 40 ) {
				continue;
			}
			$tags[] = $label;
		}
	}
	$tags = array_slice( pp_clean_tags( array_unique( $tags ) ), 0, 15 );

	// Gallery images for the extra prompts.
	$images = array( $image );
	if ( preg_match_all( '/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $im ) ) {
		foreach ( $im[1] as $src ) {
			if ( ! preg_match( '/\.(png|jpe?g|webp|avif)(\?|$)/i', $src ) ) {
				continue;
			}
			if ( ! in_array( $src, $images, true ) && count( $images ) < count( $extra ) + 1 ) {
				$images[] = $src;
			}
		}
	}

	return array(
		'slug'     => $slug,
		'title'    => wp_html_excerpt( html_entity_decode( $title, ENT_QUOTES, 'UTF-8' ), 180 ),
		'excerpt'  => wp_html_excerpt( html_entity_decode( (string) $excerpt, ENT_QUOTES, 'UTF-8' ), 400 ),
		'prompt'   => mb_substr( $prompt, 0, 12000 ),
		'extra'    => $extra,
		'image'    => $image,
		'images'   => $images,
		'category' => $category,
		'tags'     => $tags,
	);
}

/**
 * Insert an extracted prompt.
 *
 * @param array $p Extracted data.
 * @return int|WP_Error
 */
function pp_import_insert( $p ) {
	$post_id = wp_insert_post(
		array(
			'post_type'    => 'prompt',
			'post_status'  => 'publish',
			'post_title'   => $p['title'],
			'post_name'    => $p['slug'],
			'post_excerpt' => $p['excerpt'],
		),
		true
	);
	if ( is_wp_error( $post_id ) ) {
		return $post_id;
	}

	update_post_meta( $post_id, 'pp_prompt', $p['prompt'] );
	update_post_meta( $post_id, 'pp_extra_prompts', $p['extra'] );
	update_post_meta( $post_id, 'pp_prompt_images', $p['images'] );
	update_post_meta( $post_id, 'pp_author_name', pp_site_title() );
	update_post_meta( $post_id, 'pp_premium', 0 );
	update_post_meta( $post_id, 'pp_likes', 0 );
	update_post_meta( $post_id, 'pp_copies', 0 );

	if ( $p['category'] ) {
		wp_set_object_terms( $post_id, array( ucwords( str_replace( '-', ' ', $p['category'] ) ) ), 'prompt_library', false );
	}
	if ( $p['tags'] ) {
		wp_set_object_terms( $post_id, $p['tags'], 'prompt_tag', false );
	}
	wp_set_object_terms( $post_id, array( 'Gemini' ), 'prompt_tool', false );

	if ( $p['image'] ) {
		pp_sideload_thumbnail( $post_id, $p['image'] );
	}

	return $post_id;
}

/**
 * Sideload a remote image and set it as the featured image.
 *
 * @param int    $post_id Post ID.
 * @param string $url     Image URL.
 */
function pp_sideload_thumbnail( $post_id, $url ) {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$tmp = download_url( $url, 25 );
	if ( is_wp_error( $tmp ) ) {
		return;
	}
	$file = array(
		'name'     => basename( parse_url( $url, PHP_URL_PATH ) ),
		'tmp_name' => $tmp,
	);
	$id   = media_handle_sideload( $file, $post_id );
	if ( is_wp_error( $id ) ) {
		if ( file_exists( $tmp ) ) {
			wp_delete_file( $tmp );
		}
		return;
	}
	set_post_thumbnail( $post_id, $id );
}

/**
 * AJAX: fetch the sitemap and return the URL list plus already-imported slugs.
 */
function pp_ajax_importer_urls() {
	if ( ! current_user_can( 'manage_options' ) || ! check_ajax_referer( 'pp_admin', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'not allowed' ), 403 );
	}
	$sitemap = isset( $_POST['sitemap'] ) ? esc_url_raw( wp_unslash( $_POST['sitemap'] ) ) : '';
	if ( ! $sitemap ) {
		wp_send_json_error( array( 'message' => 'missing sitemap' ), 400 );
	}
	$res = wp_remote_get( $sitemap, array( 'timeout' => 30 ) );
	if ( is_wp_error( $res ) ) {
		wp_send_json_error( array( 'message' => $res->get_error_message() ), 400 );
	}
	$xml  = wp_remote_retrieve_body( $res );
	$urls = array();
	if ( preg_match_all( '#<loc>([^<]+)</loc>#', $xml, $m ) ) {
		$urls = array_values( array_unique( $m[1] ) );
	}
	// Nested sitemap index support.
	$nested = array_filter( $urls, function ( $u ) { return preg_match( '/\.xml$/i', $u ); } );
	if ( count( $nested ) === count( $urls ) && $urls ) {
		$all = array();
		foreach ( array_slice( $nested, 0, 20 ) as $child ) {
			$r = wp_remote_get( $child, array( 'timeout' => 30 ) );
			if ( is_wp_error( $r ) ) {
				continue;
			}
			if ( preg_match_all( '#<loc>([^<]+)</loc>#', wp_remote_retrieve_body( $r ), $cm ) ) {
				$all = array_merge( $all, $cm[1] );
			}
		}
		$urls = array_values( array_unique( $all ) );
	}

	wp_send_json_success( array( 'urls' => $urls ) );
}
add_action( 'wp_ajax_pp_importer_urls', 'pp_ajax_importer_urls' );

/**
 * AJAX: import a single URL (called in sequence by the admin script).
 */
function pp_ajax_importer_one() {
	if ( ! current_user_can( 'manage_options' ) || ! check_ajax_referer( 'pp_admin', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'not allowed' ), 403 );
	}
	$url  = isset( $_POST['url'] ) ? esc_url_raw( wp_unslash( $_POST['url'] ) ) : '';
	$slug = pp_slug_from_url( $url );
	if ( ! $url || ! $slug ) {
		wp_send_json_success( array( 'status' => 'skipped', 'message' => 'no slug' ) );
	}

	// Duplicate guard: skip anything already published under this slug.
	$existing = get_page_by_path( $slug, OBJECT, 'prompt' );
	if ( $existing ) {
		wp_send_json_success( array( 'status' => 'skipped', 'message' => $slug . ' — already exists' ) );
	}

	$res = wp_remote_get( $url, array( 'timeout' => 30, 'user-agent' => 'Mozilla/5.0 PromptPalette Importer' ) );
	if ( is_wp_error( $res ) ) {
		wp_send_json_success( array( 'status' => 'failed', 'message' => $slug . ' — ' . $res->get_error_message() ) );
	}
	$p = pp_extract_post( $url, wp_remote_retrieve_body( $res ) );
	if ( ! $p['title'] || ! $p['prompt'] ) {
		wp_send_json_success( array( 'status' => 'failed', 'message' => $slug . ' — missing fields' ) );
	}

	$id = pp_import_insert( $p );
	if ( is_wp_error( $id ) ) {
		wp_send_json_success( array( 'status' => 'failed', 'message' => $slug . ' — ' . $id->get_error_message() ) );
	}
	wp_send_json_success( array( 'status' => 'added', 'message' => '✓ ' . $p['title'] ) );
}
add_action( 'wp_ajax_pp_importer_one', 'pp_ajax_importer_one' );

/**
 * Importer admin screen.
 */
function pp_render_importer() {
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Sitemap Importer', 'promptpalette' ); ?></h1>
		<p><?php esc_html_e( 'Fetches every post URL from a sitemap, extracts the full prompt text, images, category and tags, and imports the new ones. Slugs that already exist are skipped, so you can re-run it safely.', 'promptpalette' ); ?></p>
		<p>
			<input type="text" id="pp-sitemap" class="regular-text" style="width:420px" value="https://promptplum.com/ai_prompt-sitemap.xml" />
			<button class="button button-primary" id="pp-import-start"><?php esc_html_e( 'Start import', 'promptpalette' ); ?></button>
			<button class="button" id="pp-import-stop"><?php esc_html_e( 'Stop', 'promptpalette' ); ?></button>
		</p>
		<div class="pp-grid" style="grid-template-columns:repeat(5,minmax(0,1fr));max-width:720px">
			<?php foreach ( array( 'total', 'done', 'added', 'skipped', 'failed' ) as $k ) : ?>
				<div class="pp-box">
					<div style="text-transform:uppercase;font-size:11px;font-weight:700;color:#646970"><?php echo esc_html( $k ); ?></div>
					<div class="pp-stat" id="pp-count-<?php echo esc_attr( $k ); ?>">0</div>
				</div>
			<?php endforeach; ?>
		</div>
		<h2><?php esc_html_e( 'Log', 'promptpalette' ); ?></h2>
		<div class="pp-log" id="pp-import-log"><?php esc_html_e( 'Logs will appear here…', 'promptpalette' ); ?></div>
	</div>
	<?php
}
