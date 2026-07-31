<?php
/**
 * Template helpers.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * All prompt rows (text + image) for a post; row 0 falls back to featured image / content.
 */
function pp_prompt_rows( $post_id = null ) {
	$post_id = $post_id ? $post_id : get_the_ID();
	$rows    = get_post_meta( $post_id, 'pp_prompt_rows', true );
	if ( ! is_array( $rows ) ) {
		$rows = array();
	}
	if ( empty( $rows ) ) {
		$content = wp_strip_all_tags( get_post_field( 'post_content', $post_id ) );
		if ( trim( $content ) ) {
			$rows[] = array( 'text' => $content, 'image' => '' );
		}
	}
	if ( isset( $rows[0] ) && empty( $rows[0]['image'] ) ) {
		$rows[0]['image'] = (string) get_the_post_thumbnail_url( $post_id, 'full' );
	}
	return $rows;
}

/**
 * Unique image list for a prompt (index matches prompt index).
 */
function pp_prompt_images( $post_id = null ) {
	$images = array();
	foreach ( pp_prompt_rows( $post_id ) as $row ) {
		if ( ! empty( $row['image'] ) ) {
			$images[] = $row['image'];
		}
	}
	$thumb = get_the_post_thumbnail_url( $post_id ? $post_id : get_the_ID(), 'full' );
	if ( $thumb ) {
		array_unshift( $images, $thumb );
	}
	return array_values( array_unique( array_filter( $images ) ) );
}

function pp_is_premium( $post_id = null ) {
	return '1' === get_post_meta( $post_id ? $post_id : get_the_ID(), 'pp_premium', true );
}

function pp_rating( $post_id = null ) {
	$r = (float) get_post_meta( $post_id ? $post_id : get_the_ID(), 'pp_rating', true );
	return $r > 0 ? $r : 5.0;
}

function pp_icon( $name, $class = '' ) {
	$paths = array(
		'search'   => '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
		'menu'     => '<path d="M4 6h16M4 12h16M4 18h16"/>',
		'close'    => '<path d="M18 6 6 18M6 6l12 12"/>',
		'heart'    => '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8Z"/>',
		'star'     => '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1Z"/>',
		'sparkles' => '<path d="m12 3 1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9Z"/><path d="M18 15.5 19 18l2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z"/>',
		'download' => '<path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/>',
		'grid'     => '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
		'square'   => '<rect x="4" y="4" width="16" height="16" rx="2"/>',
		'crown'    => '<path d="M3 7l4 4 5-7 5 7 4-4-2 12H5Z"/>',
		'user'     => '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
		'chevron'  => '<path d="m9 6 6 6-6 6"/>',
		'twitter'  => '<path d="M22 5.9a8 8 0 0 1-2.4.7 4 4 0 0 0 1.8-2.2 8 8 0 0 1-2.6 1A4 4 0 0 0 12 9a11 11 0 0 1-8-4 4 4 0 0 0 1.2 5.4 4 4 0 0 1-1.8-.5 4 4 0 0 0 3.2 4 4 4 0 0 1-1.8.1 4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18.6 11 11 0 0 0 8 20c7 0 11-6 11-11v-.5A8 8 0 0 0 22 6Z"/>',
		'instagram'=> '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
		'github'   => '<path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.7 11.7 0 0 0-6 0C6.8 2.7 5.8 3 5.8 3a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
	);
	if ( ! isset( $paths[ $name ] ) ) {
		return '';
	}
	return '<svg class="' . esc_attr( $class ) . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $paths[ $name ] . '</svg>';
}

/**
 * AdSense slot renderer — used between cards and inside prompt pages.
 */
function pp_ad( $slot_key ) {
	$client = pp_option( 'adsense_client' );
	$slot   = pp_option( $slot_key );
	if ( ! $client || ! $slot ) {
		return;
	}
	printf(
		'<div class="ad-slot"><ins class="adsbygoogle" style="display:block;width:100%%" data-ad-client="%s" data-ad-slot="%s" data-ad-format="auto" data-full-width-responsive="true"></ins><script>(adsbygoogle=window.adsbygoogle||[]).push({});</script></div>',
		esc_attr( $client ),
		esc_attr( $slot )
	);
}

/**
 * Prompt card markup used everywhere.
 */
function pp_card( $post = null, $index = 0 ) {
	$post   = get_post( $post );
	$id     = $post->ID;
	$images = pp_prompt_images( $id );
	$img    = ! empty( $images[0] ) ? $images[0] : '';
	$likes  = (int) get_post_meta( $id, 'pp_likes', true );
	?>
	<article class="card glass-card fade-up" style="animation-delay:<?php echo esc_attr( min( $index * 40, 320 ) ); ?>ms">
		<button class="like-badge" type="button" data-like="<?php echo esc_attr( $id ); ?>" aria-label="<?php esc_attr_e( 'Like prompt', 'promptpalette' ); ?>">
			<?php echo pp_icon( 'heart' ); // phpcs:ignore ?>
			<span><?php echo esc_html( $likes ); ?></span>
		</button>
		<?php if ( pp_is_premium( $id ) ) : ?>
			<span class="badge-premium"><?php echo pp_icon( 'sparkles' ); // phpcs:ignore ?> <?php esc_html_e( 'Premium', 'promptpalette' ); ?></span>
		<?php endif; ?>
		<a href="<?php echo esc_url( get_permalink( $id ) ); ?>" class="card-media">
			<?php if ( $img ) : ?>
				<img src="<?php echo esc_url( $img ); ?>" alt="<?php echo esc_attr( get_the_title( $id ) ); ?>" loading="lazy" />
			<?php endif; ?>
		</a>
		<div class="card-body">
			<a href="<?php echo esc_url( get_permalink( $id ) ); ?>"><h3 class="card-title"><?php echo esc_html( get_the_title( $id ) ); ?></h3></a>
			<div class="card-meta">
				<?php echo pp_icon( 'star' ); // phpcs:ignore ?>
				<span><?php echo esc_html( number_format_i18n( pp_rating( $id ), 1 ) ); ?></span>
				<span>·</span>
				<time datetime="<?php echo esc_attr( get_the_date( 'c', $id ) ); ?>"><?php echo esc_html( get_the_date( '', $id ) ); ?></time>
			</div>
		</div>
	</article>
	<?php
}

/**
 * Renders a grid of prompt cards with an ad injected every 8 cards.
 */
function pp_card_grid( $query = null, $toggle_class = '' ) {
	$query = $query ? $query : $GLOBALS['wp_query'];
	if ( ! $query->have_posts() ) {
		echo '<p class="muted center">' . esc_html__( 'No prompts found yet.', 'promptpalette' ) . '</p>';
		return;
	}
	echo '<div class="grid ' . esc_attr( $toggle_class ) . '" id="pp-grid">';
	$i = 0;
	while ( $query->have_posts() ) {
		$query->the_post();
		pp_card( get_post(), $i );
		$i++;
		if ( 0 === $i % 8 ) {
			pp_ad( 'ad_slot_grid' );
		}
	}
	echo '</div>';
	wp_reset_postdata();
}

/**
 * JSON-LD for prompt pages.
 */
function pp_prompt_jsonld( $post ) {
	if ( ! $post ) {
		return;
	}
	$images = pp_prompt_images( $post->ID );
	$data   = array(
		'@context'      => 'https://schema.org',
		'@type'         => 'CreativeWork',
		'name'          => get_the_title( $post ),
		'description'   => wp_strip_all_tags( get_the_excerpt( $post ) ),
		'image'         => $images,
		'datePublished' => get_the_date( 'c', $post ),
		'dateModified'  => get_the_modified_date( 'c', $post ),
		'author'        => array( '@type' => 'Organization', 'name' => get_bloginfo( 'name' ) ),
		'aggregateRating' => array(
			'@type'       => 'AggregateRating',
			'ratingValue' => (string) pp_rating( $post->ID ),
			'ratingCount' => max( 1, (int) get_post_meta( $post->ID, 'pp_likes', true ) ),
		),
	);
	echo '<script type="application/ld+json">' . wp_json_encode( $data ) . '</script>' . "\n";
}

/**
 * Sort helper for home tabs.
 */
function pp_sorted_query( $sort = 'latest', $per_page = 12, $paged = 1 ) {
	$args = array(
		'post_type'      => 'prompt',
		'posts_per_page' => $per_page,
		'paged'          => $paged,
	);
	if ( 'popular' === $sort ) {
		$args['meta_key'] = 'pp_likes';
		$args['orderby']  = array( 'meta_value_num' => 'DESC', 'date' => 'DESC' );
	} elseif ( 'trending' === $sort ) {
		$args['meta_key']   = 'pp_copies';
		$args['orderby']    = array( 'meta_value_num' => 'DESC', 'date' => 'DESC' );
		$args['date_query'] = array( array( 'after' => '90 days ago' ) );
	} else {
		$args['orderby'] = 'date';
		$args['order']   = 'DESC';
	}
	$q = new WP_Query( $args );
	if ( 'trending' === $sort && ! $q->have_posts() ) {
		unset( $args['date_query'] );
		$q = new WP_Query( $args );
	}
	return $q;
}
