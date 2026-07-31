<?php
/**
 * Single prompt: big 2:3 image with lightbox + download, numbered gallery,
 * multiple copyable prompts, tags, star rating, related prompts.
 *
 * @package PromptPalette
 */

get_header();

while ( have_posts() ) :
	the_post();
	$id      = get_the_ID();
	$rows    = pp_prompt_rows( $id );
	$images  = pp_prompt_images( $id );
	$multi   = count( $images ) > 1;
	$main    = ! empty( $images[0] ) ? $images[0] : '';
	$libs    = get_the_terms( $id, 'prompt_library' );
	$tags    = get_the_terms( $id, 'prompt_tag' );
	$tools   = get_the_terms( $id, 'prompt_tool' );
	?>
	<article>
		<nav class="breadcrumbs">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
			<?php echo pp_icon( 'chevron' ); // phpcs:ignore ?>
			<?php if ( $libs && ! is_wp_error( $libs ) ) : ?>
				<a href="<?php echo esc_url( get_term_link( $libs[0] ) ); ?>"><?php echo esc_html( $libs[0]->name ); ?></a>
				<?php echo pp_icon( 'chevron' ); // phpcs:ignore ?>
			<?php endif; ?>
			<span><?php the_title(); ?></span>
		</nav>

		<div class="prompt-layout" style="margin-top:24px">
			<div>
				<?php if ( $main ) : ?>
					<div class="hero-image">
						<img id="pp-main-image" data-lightbox="<?php echo esc_url( $main ); ?>" src="<?php echo esc_url( $main ); ?>" alt="<?php the_title_attribute(); ?>" />
						<?php if ( pp_is_premium( $id ) ) : ?>
							<span class="badge-premium"><?php echo pp_icon( 'sparkles' ); // phpcs:ignore ?> <?php esc_html_e( 'Premium', 'promptpalette' ); ?></span>
						<?php endif; ?>
						<div class="image-tools">
							<?php if ( $multi ) : ?>
								<span class="pill-dark" id="pp-image-counter" data-total="<?php echo esc_attr( count( $images ) ); ?>">1/<?php echo esc_html( count( $images ) ); ?></span>
							<?php endif; ?>
							<a class="pill-dark" id="pp-main-download" href="<?php echo esc_url( $main ); ?>" download target="_blank" rel="noreferrer"><?php echo pp_icon( 'download' ); // phpcs:ignore ?> <?php esc_html_e( 'Download', 'promptpalette' ); ?></a>
						</div>
					</div>

					<?php if ( $multi ) : ?>
						<div class="thumbs">
							<?php foreach ( $images as $i => $src ) : ?>
								<button type="button" class="thumb <?php echo 0 === $i ? 'active' : ''; ?>" data-thumb="<?php echo esc_url( $src ); ?>" data-index="<?php echo esc_attr( $i + 1 ); ?>">
									<img src="<?php echo esc_url( $src ); ?>" alt="<?php echo esc_attr( sprintf( __( 'Prompt %d example', 'promptpalette' ), $i + 1 ) ); ?>" loading="lazy" />
									<span><?php echo esc_html( $i + 1 ); ?></span>
								</button>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				<?php endif; ?>
			</div>

			<div>
				<?php if ( $tools && ! is_wp_error( $tools ) ) : ?>
					<a class="chip" href="<?php echo esc_url( get_term_link( $tools[0] ) ); ?>"><?php echo esc_html( $tools[0]->name ); ?></a>
				<?php endif; ?>
				<h1 style="margin-top:12px;font-size:clamp(26px,5vw,38px)"><?php the_title(); ?></h1>

				<div class="card-meta" style="margin-top:12px;font-size:13px">
					<?php echo pp_icon( 'star' ); // phpcs:ignore ?>
					<span><?php echo esc_html( number_format_i18n( pp_rating( $id ), 1 ) ); ?></span>
					<span>·</span>
					<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() . ' · ' . get_the_time() ); ?></time>
				</div>

				<?php if ( has_excerpt() ) : ?>
					<p class="muted" style="margin-top:16px"><?php echo esc_html( get_the_excerpt() ); ?></p>
				<?php endif; ?>

				<div style="margin-top:20px;display:flex;gap:8px;flex-wrap:wrap">
					<button class="like-badge" style="position:static" type="button" data-like="<?php echo esc_attr( $id ); ?>">
						<?php echo pp_icon( 'heart' ); // phpcs:ignore ?>
						<span><?php echo esc_html( (int) get_post_meta( $id, 'pp_likes', true ) ); ?></span>
					</button>
				</div>

				<?php pp_ad( 'ad_slot_detail' ); ?>

				<?php foreach ( $rows as $i => $row ) : ?>
					<?php if ( empty( $row['text'] ) ) { continue; } ?>
					<div class="prompt-box glass-card">
						<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
							<h3 style="font-size:14px;display:flex;align-items:center;gap:8px">
								<?php if ( count( $rows ) > 1 ) : ?>
									<span style="width:20px;height:20px;border-radius:999px;background:var(--gradient-primary);color:#fff;font-size:10px;display:grid;place-items:center"><?php echo esc_html( $i + 1 ); ?></span>
								<?php endif; ?>
								<?php echo esc_html( count( $rows ) > 1 ? sprintf( __( 'Prompt %d', 'promptpalette' ), $i + 1 ) : __( 'Prompt', 'promptpalette' ) ); ?>
							</h3>
							<button class="btn btn-sm btn-gradient" type="button" data-copy="pp-prompt-<?php echo esc_attr( $i ); ?>" data-post="<?php echo esc_attr( $id ); ?>"><span class="label"><?php esc_html_e( 'Copy', 'promptpalette' ); ?></span></button>
						</div>
						<pre id="pp-prompt-<?php echo esc_attr( $i ); ?>"><?php echo esc_html( $row['text'] ); ?></pre>
					</div>
				<?php endforeach; ?>

				<?php if ( $tags && ! is_wp_error( $tags ) ) : ?>
					<div style="margin-top:24px">
						<h3 style="font-size:14px"><?php esc_html_e( 'Tags', 'promptpalette' ); ?></h3>
						<div class="tag-list">
							<?php foreach ( $tags as $tag ) : ?>
								<a class="chip" href="<?php echo esc_url( get_term_link( $tag ) ); ?>">#<?php echo esc_html( $tag->name ); ?></a>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endif; ?>

				<div class="prompt-box glass-card">
					<h3 style="font-size:14px"><?php esc_html_e( 'Rate this prompt', 'promptpalette' ); ?></h3>
					<div class="stars" id="pp-stars" data-post="<?php echo esc_attr( $id ); ?>" data-average="<?php echo esc_attr( round( pp_rating( $id ) ) ); ?>" style="margin-top:10px">
						<?php for ( $s = 1; $s <= 5; $s++ ) : ?>
							<button type="button" aria-label="<?php echo esc_attr( sprintf( __( 'Rate %d stars', 'promptpalette' ), $s ) ); ?>"><?php echo pp_icon( 'star' ); // phpcs:ignore ?></button>
						<?php endfor; ?>
						<span class="muted" id="pp-rating-out" style="margin-left:10px;font-size:13px"><?php echo esc_html( sprintf( __( '%s average', 'promptpalette' ), number_format_i18n( pp_rating( $id ), 1 ) ) ); ?></span>
					</div>
				</div>
			</div>
		</div>
	</article>

	<?php
	$related_terms = wp_get_object_terms( $id, array( 'prompt_library', 'prompt_tag' ), array( 'fields' => 'ids' ) );
	$related       = new WP_Query(
		array(
			'post_type'      => 'prompt',
			'posts_per_page' => 4,
			'post__not_in'   => array( $id ),
			'tax_query'      => $related_terms ? array( // phpcs:ignore WordPress.DB.SlowDBQuery
				array(
					'taxonomy' => 'prompt_library',
					'field'    => 'term_id',
					'terms'    => $related_terms,
					'operator' => 'IN',
				),
			) : array(),
		)
	);
	if ( ! $related->have_posts() ) {
		$related = new WP_Query( array( 'post_type' => 'prompt', 'posts_per_page' => 4, 'post__not_in' => array( $id ) ) );
	}
	if ( $related->have_posts() ) :
		?>
		<section>
			<h2><?php esc_html_e( 'You might also like', 'promptpalette' ); ?></h2>
			<div style="margin-top:20px"><?php pp_card_grid( $related ); ?></div>
		</section>
	<?php endif; ?>
<?php endwhile; ?>

<?php get_footer(); ?>
