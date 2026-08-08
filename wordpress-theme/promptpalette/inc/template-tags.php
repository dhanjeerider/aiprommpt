<?php
/**
 * Template tags: data helpers, prompt card, ad slots, grids, JSON-LD.
 *
 * These mirror the React components (PromptCard, AdSlot, grids) class-for-class.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Featured image URL with a graceful fallback to the first attached image.
 *
 * @param int    $id   Post ID.
 * @param string $size Image size.
 * @return string
 */
function pp_featured_image( $id, $size = 'pp-card' ) {
	$src = get_the_post_thumbnail_url( $id, $size );
	if ( $src ) {
		return $src;
	}
	$override = get_post_meta( $id, 'pp_prompt_images', true );
	if ( is_array( $override ) && ! empty( $override[0] ) ) {
		return $override[0];
	}
	return '';
}

/**
 * Average rating.
 *
 * @param int $id Post ID.
 * @return float
 */
function pp_rating( $id ) {
	$r = (float) get_post_meta( $id, 'pp_rating', true );
	return $r > 0 ? round( $r, 1 ) : 4.8;
}

/**
 * All prompt texts for a post (main + extras).
 *
 * @param int $id Post ID.
 * @return array
 */
function pp_prompts( $id ) {
	$main  = (string) get_post_meta( $id, 'pp_prompt', true );
	$extra = get_post_meta( $id, 'pp_extra_prompts', true );
	$list  = array_merge( array( $main ), is_array( $extra ) ? $extra : array() );
	$list  = array_values( array_filter( array_map( 'trim', $list ), 'strlen' ) );
	if ( ! $list ) {
		$content = trim( wp_strip_all_tags( get_post_field( 'post_content', $id ) ) );
		if ( $content ) {
			$list = array( $content );
		}
	}
	return $list;
}

/**
 * Gallery images — index i belongs to prompt i (0 = featured image).
 *
 * @param int $id Post ID.
 * @return array
 */
function pp_images( $id ) {
	$imgs = get_post_meta( $id, 'pp_prompt_images', true );
	$imgs = is_array( $imgs ) ? $imgs : array();
	$list = array_merge( array( pp_featured_image( $id, 'full' ) ), array_slice( $imgs, 1 ) );
	if ( ! empty( $imgs[0] ) && ! pp_featured_image( $id, 'full' ) ) {
		$list[0] = $imgs[0];
	}
	$list = array_values( array_filter( array_map( 'trim', $list ), 'strlen' ) );
	return array_values( array_unique( $list ) );
}

/**
 * Primary category (prompt_library) term.
 *
 * @param int $id Post ID.
 * @return WP_Term|null
 */
function pp_category_term( $id ) {
	$terms = get_the_terms( $id, 'prompt_library' );
	if ( is_array( $terms ) && $terms ) {
		return $terms[0];
	}
	return null;
}

/**
 * First term of a taxonomy.
 *
 * @param int    $id  Post ID.
 * @param string $tax Taxonomy.
 * @return WP_Term|null
 */
function pp_first_term( $id, $tax ) {
	$terms = get_the_terms( $id, $tax );
	return ( is_array( $terms ) && $terms ) ? $terms[0] : null;
}

/**
 * Clean scraped tag noise — port of src/lib/tags.ts.
 *
 * @param array $tags Raw tags.
 * @return array
 */
function pp_clean_tags( $tags ) {
	$out  = array();
	$seen = array();
	foreach ( (array) $tags as $raw ) {
		$t = trim( preg_replace( '/^#+/', '', (string) $raw ) );
		if ( ! $t ) {
			continue;
		}
		if ( preg_match( '/(\d+\s*prompts?)$/i', $t ) ) {
			continue;
		}
		$t = preg_replace( '/^([A-Za-z])\s+(?=[A-Z])/', '', $t );
		$t = trim( preg_replace( '/\s{2,}/', ' ', $t ) );
		if ( ! $t || strlen( $t ) < 2 ) {
			continue;
		}
		$key = strtolower( $t );
		if ( isset( $seen[ $key ] ) ) {
			continue;
		}
		$seen[ $key ] = 1;
		$out[]        = $t;
	}
	return $out;
}

/**
 * Cleaned prompt tag terms.
 *
 * @param int $id Post ID.
 * @return array Array of term objects.
 */
function pp_tag_terms( $id ) {
	$terms = get_the_terms( $id, 'prompt_tag' );
	if ( ! is_array( $terms ) ) {
		return array();
	}
	$names = pp_clean_tags( wp_list_pluck( $terms, 'name' ) );
	$out   = array();
	foreach ( $terms as $t ) {
		if ( in_array( $t->name, $names, true ) ) {
			$out[] = $t;
		}
	}
	return $out;
}

/**
 * Display author name.
 *
 * @param int $id Post ID.
 * @return string
 */
function pp_author_name( $id ) {
	$n = (string) get_post_meta( $id, 'pp_author_name', true );
	return $n ? $n : pp_site_title();
}

/**
 * Excerpt used by cards.
 *
 * @param int $id  Post ID.
 * @param int $len Length.
 * @return string
 */
function pp_excerpt( $id, $len = 140 ) {
	$e = get_post_field( 'post_excerpt', $id );
	if ( ! $e ) {
		$prompts = pp_prompts( $id );
		$e       = isset( $prompts[0] ) ? $prompts[0] : wp_strip_all_tags( get_post_field( 'post_content', $id ) );
	}
	return wp_html_excerpt( wp_strip_all_tags( $e ), $len, '…' );
}

/**
 * Prompt card — 1:1 port of src/components/prompt-card.tsx.
 *
 * @param int|WP_Post $post  Post.
 * @param int         $index Index (staggered reveal).
 */
function pp_prompt_card( $post, $index = 0 ) {
	$post    = get_post( $post );
	$id      = $post->ID;
	$premium = (int) get_post_meta( $id, 'pp_premium', true );
	$cat     = pp_category_term( $id );
	$chip    = $premium ? 'PREMIUM' : ( $cat ? strtoupper( $cat->name ) : 'NEW' );
	$likes   = (int) get_post_meta( $id, 'pp_likes', true );
	$copies  = (int) get_post_meta( $id, 'pp_copies', true );
	$img     = pp_featured_image( $id );
	$author  = pp_author_name( $id );
	$handle  = strtolower( preg_replace( '/[^a-z0-9]+/i', '', $author ) );
	$search  = strtolower( $post->post_title . ' ' . implode( ' ', wp_list_pluck( pp_tag_terms( $id ), 'name' ) ) );
	?>
	<div
		class="pp-card pp-reveal hover-lift group relative overflow-hidden rounded-3xl bg-card border border-white/5"
		style="font-family:'DM Sans', ui-sans-serif, system-ui, sans-serif; transition-delay: <?php echo esc_attr( ( $index % 8 ) * 30 ); ?>ms"
		data-likes="<?php echo esc_attr( $likes ); ?>"
		data-copies="<?php echo esc_attr( $copies ); ?>"
		data-rating="<?php echo esc_attr( pp_rating( $id ) ); ?>"
		data-date="<?php echo esc_attr( get_post_time( 'U', true, $post ) ); ?>"
		data-search="<?php echo esc_attr( $search ); ?>"
	>
		<a href="<?php echo esc_url( get_permalink( $id ) ); ?>" class="block">
			<div class="relative aspect-[4/5] overflow-hidden">
				<?php if ( $img ) : ?>
					<img src="<?php echo esc_url( $img ); ?>" alt="<?php echo esc_attr( $post->post_title ); ?>" loading="lazy" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
				<?php else : ?>
					<div class="h-full w-full bg-[image:var(--gradient-soft)]"></div>
				<?php endif; ?>
				<span class="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-900 shadow-sm">
					<?php if ( $premium ) : ?>
						<?php echo pp_icon( 'crown', 'h-3 w-3 text-amber-500' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php else : ?>
						<?php echo pp_icon( 'sparkles', 'h-3 w-3 text-emerald-500' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<?php endif; ?>
					<?php echo esc_html( $chip ); ?>
				</span>
			</div>
			<div class="p-4">
				<h3 class="line-clamp-1 text-[15px] font-extrabold tracking-tight"><?php echo esc_html( $post->post_title ); ?></h3>
				<p class="mt-1 line-clamp-2 text-[13px] font-medium text-muted-foreground"><?php echo esc_html( pp_excerpt( $id, 110 ) ); ?></p>
				<div class="mt-3 text-[12px] font-semibold text-muted-foreground">
					<?php esc_html_e( 'By', 'promptpalette' ); ?> <span class="font-extrabold text-foreground">@<?php echo esc_html( $handle ? $handle : $author ); ?></span>
				</div>
			</div>
		</a>
		<button
			type="button"
			data-like="<?php echo esc_attr( $id ); ?>"
			aria-label="<?php esc_attr_e( 'Like', 'promptpalette' ); ?>"
			class="pp-like absolute right-2.5 top-2.5 z-20 inline-flex flex-col items-center gap-0.5 rounded-2xl bg-white/95 px-2 py-1.5 text-[11px] font-extrabold text-slate-900 shadow-sm backdrop-blur transition active:scale-95"
		>
			<?php echo pp_icon( 'heart', 'pp-like-icon h-4 w-4 transition' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<span class="pp-like-count"><?php echo esc_html( $likes ); ?></span>
		</button>
	</div>
	<?php
}

/**
 * AdSense slot — 1:1 port of src/components/ad-slot.tsx.
 *
 * @param string $slot_key Settings key: ad_slot_grid|ad_slot_detail|ad_slot_sidebar.
 * @param string $variant  card|banner.
 * @param string $class    Extra classes.
 */
function pp_ad_slot( $slot_key = 'ad_slot_grid', $variant = 'card', $class = '' ) {
	$client = pp_setting( 'adsense_client' );
	$slot   = pp_setting( $slot_key );
	$wrap   = 'banner' === $variant
		? 'glass-card flex min-h-[120px] w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 ' . $class
		: 'glass-card flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 ' . $class;

	if ( $client && $slot ) {
		?>
		<div class="<?php echo esc_attr( $wrap ); ?>">
			<ins class="adsbygoogle" style="display:block;width:100%;height:100%"
				data-ad-client="<?php echo esc_attr( $client ); ?>"
				data-ad-slot="<?php echo esc_attr( $slot ); ?>"
				data-ad-format="auto"
				data-full-width-responsive="true"></ins>
			<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
		</div>
		<?php
		return;
	}
	?>
	<div class="<?php echo esc_attr( $wrap ); ?>" aria-label="<?php esc_attr_e( 'Advertisement placeholder', 'promptpalette' ); ?>">
		<span class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"><?php esc_html_e( 'Advertisement', 'promptpalette' ); ?></span>
	</div>
	<?php
}

/**
 * Render a grid of prompt cards from a WP_Query, inserting a grid ad every N cards.
 *
 * @param WP_Query|null $query      Query (defaults to the main query).
 * @param string        $grid_class Grid wrapper classes.
 * @param bool          $with_ads   Insert AdSense cards.
 */
function pp_card_grid( $query = null, $grid_class = 'mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', $with_ads = true ) {
	$query = $query ? $query : $GLOBALS['wp_query'];
	$every = (int) pp_setting( 'ad_every_n_cards', 6 );
	$every = $every > 1 ? $every : 6;
	?>
	<div id="pp-grid" class="<?php echo esc_attr( $grid_class ); ?>">
		<?php if ( $query->have_posts() ) : ?>
			<?php
			$i = 0;
			while ( $query->have_posts() ) :
				$query->the_post();
				pp_prompt_card( get_post(), $i );
				$i++;
				if ( $with_ads && 0 === $i % $every ) {
					pp_ad_slot( 'ad_slot_grid', 'card' );
				}
			endwhile;
			wp_reset_postdata();
			?>
		<?php else : ?>
			<div class="col-span-full glass-card rounded-3xl p-10 text-center">
				<h3 class="text-lg font-bold"><?php esc_html_e( 'No prompts yet', 'promptpalette' ); ?></h3>
				<p class="mt-2 text-sm text-muted-foreground"><?php esc_html_e( 'Add your first prompt from the admin — or run the Sitemap Importer.', 'promptpalette' ); ?></p>
			</div>
		<?php endif; ?>
		<div id="pp-empty" class="col-span-full glass-card hidden rounded-3xl p-10 text-center">
			<h3 class="text-lg font-bold"><?php esc_html_e( 'Nothing matched your search', 'promptpalette' ); ?></h3>
			<p class="mt-2 text-sm text-muted-foreground"><?php esc_html_e( 'Try a different keyword or clear the search box.', 'promptpalette' ); ?></p>
		</div>
	</div>
	<?php
}

/**
 * Pagination in the site's pill style.
 */
function pp_pagination() {
	$links = paginate_links(
		array(
			'type'      => 'array',
			'prev_text' => __( 'Previous', 'promptpalette' ),
			'next_text' => __( 'Next', 'promptpalette' ),
		)
	);
	if ( ! $links ) {
		return;
	}
	echo '<nav class="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">';
	foreach ( $links as $l ) {
		$l = str_replace(
			array( 'page-numbers current', 'page-numbers' ),
			array( 'btn-gradient rounded-full px-4 py-2', 'glass-card rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground' ),
			$l
		);
		echo wp_kses_post( $l );
	}
	echo '</nav>';
}

/**
 * Category tiles used on the home page and the Libraries template.
 *
 * @param int  $limit  Max terms.
 * @param bool $covers Use image covers.
 */
function pp_category_tiles( $limit = 12, $covers = false ) {
	$terms = get_terms(
		array(
			'taxonomy'   => 'prompt_library',
			'hide_empty' => true,
			'orderby'    => 'count',
			'order'      => 'DESC',
			'number'     => $limit,
		)
	);
	if ( is_wp_error( $terms ) || ! $terms ) {
		return;
	}

	if ( $covers ) {
		echo '<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">';
		foreach ( $terms as $t ) {
			$q     = new WP_Query(
				array(
					'post_type'      => 'prompt',
					'posts_per_page' => 1,
					'tax_query'      => array( array( 'taxonomy' => 'prompt_library', 'field' => 'term_id', 'terms' => $t->term_id ) ), // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
				)
			);
			$cover = $q->have_posts() ? pp_featured_image( $q->posts[0]->ID ) : '';
			?>
			<a href="<?php echo esc_url( get_term_link( $t ) ); ?>" class="hover-lift group relative overflow-hidden rounded-3xl border border-white/10 bg-card">
				<div class="relative aspect-[4/3] overflow-hidden">
					<?php if ( $cover ) : ?>
						<img src="<?php echo esc_url( $cover ); ?>" alt="<?php echo esc_attr( $t->name ); ?>" loading="lazy" class="h-full w-full object-cover transition group-hover:scale-105" />
					<?php else : ?>
						<div class="h-full w-full bg-[image:var(--gradient-soft)]"></div>
					<?php endif; ?>
					<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
					<div class="absolute inset-x-3 bottom-3 flex items-end justify-between text-white">
						<div class="text-sm font-black capitalize drop-shadow"><?php echo esc_html( $t->name ); ?></div>
						<div class="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-black text-slate-900"><?php echo esc_html( $t->count ); ?></div>
					</div>
				</div>
			</a>
			<?php
		}
		echo '</div>';
		return;
	}

	echo '<div class="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">';
	foreach ( $terms as $t ) {
		?>
		<a href="<?php echo esc_url( get_term_link( $t ) ); ?>" class="glass-card hover-lift flex items-center gap-3 rounded-2xl p-3">
			<span class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-lg font-black text-white"><?php echo esc_html( strtoupper( substr( $t->name, 0, 1 ) ) ); ?></span>
			<div class="min-w-0">
				<div class="truncate text-sm font-black capitalize"><?php echo esc_html( $t->name ); ?></div>
				<div class="text-[11px] text-muted-foreground"><?php echo esc_html( sprintf( _n( '%d Prompt', '%d Prompts', $t->count, 'promptpalette' ), $t->count ) ); ?></div>
			</div>
		</a>
		<?php
	}
	echo '</div>';
}

/**
 * JSON-LD for a prompt.
 *
 * @param WP_Post $post Post.
 */
function pp_prompt_jsonld( $post ) {
	$img  = pp_featured_image( $post->ID, 'full' );
	$data = array(
		'@context'      => 'https://schema.org',
		'@type'         => 'Article',
		'headline'      => wp_strip_all_tags( $post->post_title ),
		'description'   => pp_excerpt( $post->ID, 200 ),
		'datePublished' => get_post_time( 'c', true, $post ),
		'dateModified'  => get_post_modified_time( 'c', true, $post ),
		'author'        => array( '@type' => 'Person', 'name' => pp_author_name( $post->ID ) ),
		'publisher'     => array( '@type' => 'Organization', 'name' => pp_site_title() ),
		'mainEntityOfPage' => get_permalink( $post ),
	);
	if ( $img ) {
		$data['image'] = $img;
	}
	$rating = (float) get_post_meta( $post->ID, 'pp_rating', true );
	$count  = (int) get_post_meta( $post->ID, 'pp_rating_count', true );
	if ( $rating > 0 && $count > 0 ) {
		$data['aggregateRating'] = array(
			'@type'       => 'AggregateRating',
			'ratingValue' => round( $rating, 1 ),
			'ratingCount' => $count,
		);
	}
	echo '<script type="application/ld+json">' . wp_json_encode( $data ) . '</script>' . "\n";
}
