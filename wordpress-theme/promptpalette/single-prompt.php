<?php
/**
 * Single prompt — port of src/routes/prompt.$slug.tsx.
 *
 * @package PromptPalette
 */

get_header();

while ( have_posts() ) :
	the_post();
	$id       = get_the_ID();
	$prompts  = pp_prompts( $id );
	$images   = pp_images( $id );
	$gallery  = count( $images ) > 1;
	$premium  = (int) get_post_meta( $id, 'pp_premium', true );
	$cat      = pp_category_term( $id );
	$tool     = pp_first_term( $id, 'prompt_tool' );
	$tags     = pp_tag_terms( $id );
	$likes    = (int) get_post_meta( $id, 'pp_likes', true );
	$rating   = pp_rating( $id );
	$author   = pp_author_name( $id );
	$main_img = isset( $images[0] ) ? $images[0] : '';
	?>

	<nav class="glass-card flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted-foreground" aria-label="<?php esc_attr_e( 'Breadcrumb', 'promptpalette' ); ?>">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="rounded-full px-2.5 py-1 font-semibold transition hover:bg-white/10 hover:text-foreground"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
		<?php echo pp_icon( 'chevron-right', 'h-3 w-3 shrink-0' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php if ( $cat ) : ?>
			<a href="<?php echo esc_url( get_term_link( $cat ) ); ?>" class="rounded-full px-2.5 py-1 font-semibold uppercase tracking-wide transition hover:bg-white/10 hover:text-foreground"><?php echo esc_html( $cat->name ); ?></a>
			<?php echo pp_icon( 'chevron-right', 'h-3 w-3 shrink-0' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		<?php endif; ?>
		<span class="line-clamp-1 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 font-bold text-white"><?php the_title(); ?></span>
	</nav>

	<div class="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
		<div>
			<div class="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]">
				<?php if ( $main_img ) : ?>
					<button type="button" class="pp-zoom block w-full cursor-zoom-in" data-src="<?php echo esc_url( $main_img ); ?>" aria-label="<?php esc_attr_e( 'Open image', 'promptpalette' ); ?>">
						<img id="pp-main-image" src="<?php echo esc_url( $main_img ); ?>" alt="<?php echo esc_attr( get_the_title() ); ?>" class="block aspect-[2/3] w-full rounded-[28px] object-cover" />
					</button>
				<?php else : ?>
					<div class="aspect-[2/3] w-full rounded-[28px] bg-[image:var(--gradient-soft)]"></div>
				<?php endif; ?>

				<?php if ( $premium ) : ?>
					<span class="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm">
						<?php echo pp_icon( 'sparkles', 'h-3 w-3' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php esc_html_e( 'Premium', 'promptpalette' ); ?>
					</span>
				<?php endif; ?>

				<div class="pointer-events-none absolute right-3 top-3 flex items-center gap-2">
					<?php if ( $gallery ) : ?>
						<span id="pp-image-counter" class="rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-extrabold text-white backdrop-blur">1/<?php echo esc_html( count( $images ) ); ?></span>
					<?php endif; ?>
					<?php if ( $main_img ) : ?>
						<a id="pp-main-download" href="<?php echo esc_url( $main_img ); ?>" download target="_blank" rel="noreferrer" class="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[11px] font-extrabold text-white backdrop-blur transition hover:bg-black/80">
							<?php echo pp_icon( 'download', 'h-3.5 w-3.5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php esc_html_e( 'Download', 'promptpalette' ); ?>
						</a>
					<?php endif; ?>
				</div>
			</div>

			<?php if ( $gallery ) : ?>
				<div class="mt-3 grid grid-cols-4 gap-2">
					<?php foreach ( $images as $i => $src ) : ?>
						<button type="button" data-thumb="<?php echo esc_attr( $i ); ?>" data-src="<?php echo esc_url( $src ); ?>" class="pp-thumb relative overflow-hidden rounded-xl border transition <?php echo 0 === $i ? 'border-primary ring-2 ring-primary/40' : 'border-white/10'; ?>">
							<img src="<?php echo esc_url( $src ); ?>" alt="<?php echo esc_attr( sprintf( __( 'Prompt %d example', 'promptpalette' ), $i + 1 ) ); ?>" loading="lazy" class="aspect-[2/3] w-full object-cover" />
							<span class="absolute left-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-black/70 text-[10px] font-extrabold text-white"><?php echo esc_html( $i + 1 ); ?></span>
						</button>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

			<?php pp_ad_slot( 'ad_slot_detail', 'banner', 'mt-5' ); ?>
		</div>

		<div class="lg:sticky lg:top-28 lg:self-start">
			<div class="flex flex-wrap items-center gap-2">
				<span class="inline-flex items-center rounded-full bg-foreground px-3 py-1 text-[11px] font-black uppercase tracking-widest text-background"><?php esc_html_e( 'Prompt Detail', 'promptpalette' ); ?></span>
				<?php if ( $tool ) : ?>
					<span class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground"><?php echo esc_html( $tool->name ); ?></span>
				<?php endif; ?>
				<?php if ( $premium ) : ?>
					<span class="inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-primary)] px-2.5 py-1 text-[11px] font-bold text-white">
						<?php echo pp_icon( 'sparkles', 'h-3 w-3' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php esc_html_e( 'Premium', 'promptpalette' ); ?>
					</span>
				<?php endif; ?>
			</div>

			<h1 class="mt-3 text-3xl font-black tracking-tight sm:text-4xl"><?php the_title(); ?></h1>

			<div class="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
				<span><?php esc_html_e( 'Shared by', 'promptpalette' ); ?> <span class="font-bold text-primary">@<?php echo esc_html( preg_replace( '/\s+/', '', $author ) ); ?></span></span>
				<span>·</span>
				<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date( 'j F Y' ) . ' · ' . get_the_time() ); ?></time>
				<span>·</span>
				<span class="inline-flex items-center gap-1">
					<?php echo pp_icon_star_filled( 'h-3.5 w-3.5 text-amber-500' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					<span id="pp-rating-value"><?php echo esc_html( number_format( $rating, 1 ) ); ?></span>
				</span>
			</div>

			<?php if ( has_excerpt() ) : ?>
				<p class="mt-4 text-muted-foreground"><?php echo esc_html( get_the_excerpt() ); ?></p>
			<?php endif; ?>

			<?php foreach ( $prompts as $i => $text ) : ?>
				<div class="glass-card mt-6 rounded-[28px] p-4 sm:p-5">
					<div class="flex items-center justify-between gap-3">
						<div class="flex min-w-0 items-center gap-2.5">
							<span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-primary/15 text-primary">
								<?php echo pp_icon( 'sparkles', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</span>
							<div class="min-w-0">
								<div class="text-[12px] font-black uppercase tracking-widest text-primary">
									<?php echo esc_html( count( $prompts ) > 1 ? sprintf( __( 'Prompt %d', 'promptpalette' ), $i + 1 ) : __( 'Prompt', 'promptpalette' ) ); ?>
								</div>
								<div class="truncate text-[12px] text-muted-foreground">
									<?php
									/* translators: AI tool name */
									printf( esc_html__( 'Optimized for %s', 'promptpalette' ), esc_html( $tool ? $tool->name : 'ChatGPT & Gemini' ) );
									?>
								</div>
							</div>
						</div>
						<button type="button" class="pp-save inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold transition hover:bg-white/10" data-id="<?php echo esc_attr( $id ); ?>">
							<?php echo pp_icon( 'bookmark', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<span class="pp-save-label"><?php esc_html_e( 'Save', 'promptpalette' ); ?></span>
						</button>
					</div>

					<div class="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
						<p class="select-all whitespace-pre-wrap break-words text-[15px] font-medium leading-[1.7] text-foreground/90" data-prompt-text><?php echo esc_html( $text ); ?></p>
					</div>

					<div class="mt-4 flex flex-wrap items-center gap-3">
						<button type="button" class="pp-copy btn-orange inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg transition hover:opacity-95" data-id="<?php echo esc_attr( $id ); ?>">
							<?php echo pp_icon( 'copy', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<span class="pp-copy-label"><?php esc_html_e( 'Copy', 'promptpalette' ); ?></span>
						</button>
						<button type="button" class="pp-like-big inline-flex items-center justify-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-6 py-3 text-sm font-extrabold text-white shadow-lg transition hover:opacity-95" data-like="<?php echo esc_attr( $id ); ?>">
							<?php echo pp_icon( 'heart', 'pp-like-icon h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							<span class="pp-like-label"><?php esc_html_e( 'Like', 'promptpalette' ); ?></span> <span class="pp-like-count"><?php echo esc_html( $likes ); ?></span>
						</button>
					</div>
				</div>
			<?php endforeach; ?>

			<div class="glass-card mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[28px] p-4 sm:p-5">
				<div class="inline-flex items-center gap-2 text-sm font-bold">
					<?php echo pp_icon( 'share', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php esc_html_e( 'Share', 'promptpalette' ); ?>
				</div>
				<div class="flex items-center gap-2">
					<?php
					$permalink = rawurlencode( get_permalink() );
					$title_enc = rawurlencode( get_the_title() );
					$shares    = array(
						array( 'F', 'https://www.facebook.com/sharer/sharer.php?u=' . $permalink, 'bg-[#1877f2] text-white', 'Facebook' ),
						array( 'X', 'https://twitter.com/intent/tweet?text=' . $title_enc . '&url=' . $permalink, 'bg-foreground text-background', 'X' ),
						array( 'W', 'https://wa.me/?text=' . $title_enc . '%20' . $permalink, 'bg-[#25d366] text-white', 'WhatsApp' ),
						array( 'T', 'https://t.me/share/url?url=' . $permalink . '&text=' . $title_enc, 'bg-[#29a9eb] text-white', 'Telegram' ),
					);
					foreach ( $shares as $s ) :
						?>
						<a href="<?php echo esc_url( $s[1] ); ?>" target="_blank" rel="noreferrer" aria-label="<?php echo esc_attr( sprintf( __( 'Share on %s', 'promptpalette' ), $s[3] ) ); ?>" class="grid h-10 w-10 place-items-center rounded-full text-xs font-black shadow-md transition hover:opacity-90 <?php echo esc_attr( $s[2] ); ?>"><?php echo esc_html( $s[0] ); ?></a>
					<?php endforeach; ?>
					<button type="button" id="pp-copy-link" data-url="<?php echo esc_url( get_permalink() ); ?>" aria-label="<?php esc_attr_e( 'Copy link', 'promptpalette' ); ?>" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 transition hover:bg-white/10">
						<?php echo pp_icon( 'link', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
					</button>
				</div>
			</div>

			<?php if ( $tags ) : ?>
				<div class="mt-6">
					<h3 class="text-sm font-semibold"><?php esc_html_e( 'Tags', 'promptpalette' ); ?></h3>
					<div class="mt-2 flex flex-wrap gap-1.5">
						<?php foreach ( $tags as $t ) : ?>
							<a href="<?php echo esc_url( get_term_link( $t ) ); ?>" class="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground hover:bg-white/10 hover:text-foreground">#<?php echo esc_html( $t->name ); ?></a>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>

			<div class="glass-card mt-6 rounded-3xl p-5" id="pp-rating" data-id="<?php echo esc_attr( $id ); ?>" data-average="<?php echo esc_attr( $rating ); ?>">
				<h3 class="text-sm font-semibold"><?php esc_html_e( 'Rate this prompt', 'promptpalette' ); ?></h3>
				<div class="mt-3 flex items-center gap-1">
					<?php for ( $n = 1; $n <= 5; $n++ ) : ?>
						<button type="button" class="pp-star p-0.5 transition hover:scale-110" data-stars="<?php echo esc_attr( $n ); ?>" aria-label="<?php echo esc_attr( sprintf( _n( 'Rate %d star', 'Rate %d stars', $n, 'promptpalette' ), $n ) ); ?>">
							<?php echo pp_icon_star_filled( 'h-7 w-7 ' . ( $n <= round( $rating ) ? 'text-amber-500' : 'text-muted-foreground/40' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
						</button>
					<?php endfor; ?>
					<span class="ml-3 text-sm text-muted-foreground" id="pp-rating-label">
						<?php
						/* translators: average rating */
						printf( esc_html__( '%s average', 'promptpalette' ), esc_html( number_format( $rating, 1 ) ) );
						?>
					</span>
				</div>
			</div>

			<?php pp_ad_slot( 'ad_slot_sidebar', 'banner', 'mt-6' ); ?>
		</div>
	</div>

	<?php
	$rel_args = array(
		'post_type'      => 'prompt',
		'posts_per_page' => 4,
		'post__not_in'   => array( $id ),
	);
	if ( $cat ) {
		$rel_args['tax_query'] = array( array( 'taxonomy' => 'prompt_library', 'field' => 'term_id', 'terms' => $cat->term_id ) ); // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_tax_query
	}
	$related = new WP_Query( $rel_args );
	if ( $related->have_posts() ) :
		?>
		<section class="mt-20">
			<h2 class="text-2xl font-bold tracking-tight"><?php esc_html_e( 'You might also like', 'promptpalette' ); ?></h2>
			<div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<?php
				$k = 0;
				while ( $related->have_posts() ) :
					$related->the_post();
					pp_prompt_card( get_post(), $k );
					$k++;
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</section>
		<?php
	endif;
endwhile;

get_footer();
