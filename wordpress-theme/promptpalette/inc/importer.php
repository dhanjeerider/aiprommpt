<?php
/**
 * Sitemap importer — pulls prompt pages from any sitemap and creates prompts.
 * Skips slugs that already exist so nothing is duplicated.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pp_importer_menu() {
	add_submenu_page(
		'pp-settings',
		__( 'Sitemap Importer', 'promptpalette' ),
		__( 'Sitemap Importer', 'promptpalette' ),
		'manage_options',
		'pp-importer',
		'pp_importer_page'
	);
}
add_action( 'admin_menu', 'pp_importer_menu' );

function pp_existing_slugs() {
	global $wpdb;
	$rows = $wpdb->get_col( $wpdb->prepare( "SELECT post_name FROM {$wpdb->posts} WHERE post_type = %s AND post_status != 'trash'", 'prompt' ) ); // phpcs:ignore WordPress.DB
	return array_flip( array_map( 'strval', (array) $rows ) );
}

function pp_fetch( $url ) {
	$res = wp_remote_get( $url, array( 'timeout' => 25, 'user-agent' => 'Mozilla/5.0 PromptPalette Importer' ) );
	if ( is_wp_error( $res ) || 200 !== wp_remote_retrieve_response_code( $res ) ) {
		return '';
	}
	return wp_remote_retrieve_body( $res );
}

/**
 * Extracts prompt data out of an HTML page.
 */
function pp_parse_prompt_html( $html, $url ) {
	$data = array( 'title' => '', 'excerpt' => '', 'prompts' => array(), 'images' => array(), 'tags' => array(), 'library' => '' );

	if ( preg_match( '/<title[^>]*>(.*?)<\/title>/is', $html, $m ) ) {
		$data['title'] = trim( preg_replace( '/\s*[|–—-]\s*[^|–—-]+$/u', '', wp_strip_all_tags( html_entity_decode( $m[1] ) ) ) );
	}
	if ( preg_match( '/<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']/is', $html, $m ) ) {
		$data['excerpt'] = trim( html_entity_decode( $m[1] ) );
	}

	// Full prompt text blocks (select-all / whitespace-pre-wrap paragraphs).
	if ( preg_match_all( '/<(p|pre)[^>]*(?:whitespace-pre-wrap|select-all)[^>]*>(.*?)<\/\1>/is', $html, $m ) ) {
		foreach ( $m[2] as $block ) {
			$text = trim( html_entity_decode( wp_strip_all_tags( str_replace( array( '<br>', '<br/>', '<br />' ), "\n", $block ) ), ENT_QUOTES ) );
			if ( strlen( $text ) > 40 ) {
				$data['prompts'][] = $text;
			}
		}
	}

	// Images.
	if ( preg_match( '/<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\']/is', $html, $m ) ) {
		$data['images'][] = html_entity_decode( $m[1] );
	}
	if ( preg_match_all( '/<img[^>]+src=["\']([^"\']+\.(?:jpg|jpeg|png|webp)[^"\']*)["\']/i', $html, $m ) ) {
		foreach ( $m[1] as $src ) {
			if ( false === strpos( $src, 'logo' ) && false === strpos( $src, 'avatar' ) ) {
				$data['images'][] = html_entity_decode( $src );
			}
		}
	}
	$data['images'] = array_values( array_unique( $data['images'] ) );

	// Tags: anchors that start with a # marker, numbers excluded.
	if ( preg_match_all( '/<a[^>]*>\s*(?:<span[^>]*>#<\/span>|#)\s*([^<]{2,40})<\/a>/i', $html, $m ) ) {
		foreach ( $m[1] as $tag ) {
			$tag = trim( html_entity_decode( $tag ) );
			if ( $tag && ! is_numeric( $tag ) && ! preg_match( '/^\d+(\.\d+)?$/', $tag ) ) {
				$data['tags'][] = $tag;
			}
		}
	}
	$data['tags'] = array_slice( array_values( array_unique( $data['tags'] ) ), 0, 12 );

	// Library from breadcrumb link /library/xxx/.
	if ( preg_match( '#href=["\'][^"\']*/librar(?:y|ies)/([a-z0-9-]+)#i', $html, $m ) ) {
		$data['library'] = str_replace( '-', ' ', $m[1] );
	}

	if ( ! $data['title'] ) {
		$data['title'] = ucwords( str_replace( '-', ' ', trim( wp_parse_url( $url, PHP_URL_PATH ), '/' ) ) );
	}
	return $data;
}

function pp_importer_page() {
	$log = array();

	if ( isset( $_POST['pp_import_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_import_nonce'] ) ), 'pp_import' ) && current_user_can( 'manage_options' ) ) {
		$sitemap = isset( $_POST['pp_sitemap'] ) ? esc_url_raw( wp_unslash( $_POST['pp_sitemap'] ) ) : '';
		$limit   = isset( $_POST['pp_limit'] ) ? max( 1, min( 100, absint( $_POST['pp_limit'] ) ) ) : 20;
		$filter  = isset( $_POST['pp_filter'] ) ? sanitize_text_field( wp_unslash( $_POST['pp_filter'] ) ) : '/prompt/';

		$xml = pp_fetch( $sitemap );
		if ( ! $xml ) {
			$log[] = array( 'err', __( 'Could not download that sitemap.', 'promptpalette' ) );
		} else {
			preg_match_all( '#<loc>\s*([^<]+)\s*</loc>#i', $xml, $m );
			$urls = array_values( array_filter( array_map( 'trim', $m[1] ), function ( $u ) use ( $filter ) {
				return '' === $filter || false !== strpos( $u, $filter );
			} ) );

			$existing = pp_existing_slugs();
			$done     = 0;

			foreach ( $urls as $url ) {
				if ( $done >= $limit ) {
					break;
				}
				$slug = sanitize_title( basename( untrailingslashit( wp_parse_url( $url, PHP_URL_PATH ) ) ) );
				if ( isset( $existing[ $slug ] ) ) {
					$log[] = array( 'skip', sprintf( 'Skipped (already published): %s', $slug ) );
					continue;
				}
				$html = pp_fetch( $url );
				if ( ! $html ) {
					$log[] = array( 'err', 'Fetch failed: ' . $url );
					continue;
				}
				$data = pp_parse_prompt_html( $html, $url );

				$post_id = wp_insert_post(
					array(
						'post_type'    => 'prompt',
						'post_status'  => 'publish',
						'post_title'   => $data['title'],
						'post_name'    => $slug,
						'post_excerpt' => $data['excerpt'],
						'post_content' => isset( $data['prompts'][0] ) ? $data['prompts'][0] : '',
					)
				);
				if ( is_wp_error( $post_id ) || ! $post_id ) {
					$log[] = array( 'err', 'Insert failed: ' . $slug );
					continue;
				}
				$existing[ $slug ] = 1;

				$rows = array();
				foreach ( $data['prompts'] as $i => $text ) {
					$rows[] = array( 'text' => $text, 'image' => isset( $data['images'][ $i ] ) ? $data['images'][ $i ] : '' );
				}
				if ( empty( $rows ) && ! empty( $data['images'] ) ) {
					$rows[] = array( 'text' => '', 'image' => $data['images'][0] );
				}
				update_post_meta( $post_id, 'pp_prompt_rows', $rows );
				update_post_meta( $post_id, 'pp_rating', 5 );

				if ( ! empty( $data['images'][0] ) ) {
					pp_sideload_thumbnail( $data['images'][0], $post_id );
				}
				if ( $data['tags'] ) {
					wp_set_object_terms( $post_id, $data['tags'], 'prompt_tag' );
				}
				if ( $data['library'] ) {
					wp_set_object_terms( $post_id, array( ucwords( $data['library'] ) ), 'prompt_library' );
				}

				$log[] = array( 'ok', sprintf( 'Imported: %s (%d prompts)', $data['title'], count( $rows ) ) );
				$done++;
			}
			if ( ! $done ) {
				$log[] = array( 'skip', __( 'Nothing new to import.', 'promptpalette' ) );
			}
		}
	}
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Sitemap importer', 'promptpalette' ); ?></h1>
		<p><?php esc_html_e( 'Paste a sitemap URL. Every prompt URL is fetched, the full prompt text, images, tags and library are extracted, and posts already published (same slug) are skipped automatically.', 'promptpalette' ); ?></p>
		<form method="post">
			<?php wp_nonce_field( 'pp_import', 'pp_import_nonce' ); ?>
			<table class="form-table" role="presentation">
				<tr><th><label for="pp_sitemap"><?php esc_html_e( 'Sitemap URL', 'promptpalette' ); ?></label></th>
					<td><input id="pp_sitemap" name="pp_sitemap" type="url" class="large-text" placeholder="https://example.com/post-sitemap.xml" required /></td></tr>
				<tr><th><label for="pp_filter"><?php esc_html_e( 'URL must contain', 'promptpalette' ); ?></label></th>
					<td><input id="pp_filter" name="pp_filter" type="text" value="/prompt/" class="regular-text" /></td></tr>
				<tr><th><label for="pp_limit"><?php esc_html_e( 'Import per run', 'promptpalette' ); ?></label></th>
					<td><input id="pp_limit" name="pp_limit" type="number" value="20" min="1" max="100" /></td></tr>
			</table>
			<?php submit_button( __( 'Start import', 'promptpalette' ) ); ?>
		</form>
		<?php if ( $log ) : ?>
			<h2><?php esc_html_e( 'Result', 'promptpalette' ); ?></h2>
			<div style="max-height:420px;overflow:auto;background:#fff;border:1px solid #ccd0d4;padding:12px;border-radius:8px">
				<?php foreach ( $log as $line ) : ?>
					<div style="color:<?php echo 'ok' === $line[0] ? '#15803d' : ( 'err' === $line[0] ? '#b91c1c' : '#6b7280' ); ?>"><?php echo esc_html( $line[1] ); ?></div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
	</div>
	<?php
}

/**
 * Downloads a remote image and sets it as the featured image.
 */
function pp_sideload_thumbnail( $url, $post_id ) {
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';
	require_once ABSPATH . 'wp-admin/includes/image.php';
	$id = media_sideload_image( $url, $post_id, null, 'id' );
	if ( ! is_wp_error( $id ) ) {
		set_post_thumbnail( $post_id, $id );
	}
}
