<?php
/**
 * Front page — port of src/routes/index.tsx (hero, sort tabs, grid, categories).
 *
 * @package PromptPalette
 */

get_header();

$pp_tab    = isset( $_GET['tab'] ) ? sanitize_key( wp_unslash( $_GET['tab'] ) ) : 'latest'; // phpcs:ignore WordPress.Security.NonceVerification.Recommended
$pp_search = get_search_query();
$pp_paged  = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );

$pp_args = array(
	'post_type'      => 'prompt',
	'post_status'    => 'publish',
	'posts_per_page' => 24,
	'paged'          => $pp_paged,
);
if ( $pp_search ) {
	$pp_args['s'] = $pp_search;
}
if ( 'trending' === $pp_tab ) {
	$pp_args['meta_key'] = 'pp_copies'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
	$pp_args['orderby']  = array( 'meta_value_num' => 'DESC', 'date' => 'DESC' );
} elseif ( 'popular' === $pp_tab ) {
	$pp_args['meta_key'] = 'pp_likes'; // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
	$pp_args['orderby']  = array( 'meta_value_num' => 'DESC', 'date' => 'DESC' );
} else {
	$pp_args['orderby'] = 'date';
	$pp_args['order']   = 'DESC';
}
$pp_query = new WP_Query( $pp_args );

$pp_popular = pp_setting( 'popular_tags' );
$pp_popular = is_array( $pp_popular ) ? $pp_popular : array_filter( array_map( 'trim', explode( ',', (string) $pp_popular ) ) );
?>

<section class="grid-bg -mx-4 rounded-[36px] px-4 py-14 text-center sm:py-20">
	<h1 class="pp-reveal mx-auto max-w-3xl text-4xl leading-[1.05] sm:text-5xl md:text-6xl"><?php echo esc_html( pp_setting( 'hero_title' ) ); ?></h1>
	<p class="pp-reveal mt-3 text-4xl font-black sm:text-5xl md:text-6xl">
		<span class="gradient-text"><?php echo esc_html( pp_setting( 'hero_gradient_text' ) ); ?></span>
	</p>
	<p class="mx-auto mt-5 max-w-lg text-base text-muted-foreground sm:text-lg"><?php echo esc_html( pp_setting( 'hero_subtitle' ) ); ?></p>

	<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="glass-card mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full p-1.5 pl-5">
		<input type="search" name="s" id="pp-hero-search" value="<?php echo esc_attr( $pp_search ); ?>" placeholder="<?php esc_attr_e( 'Search', 'promptpalette' ); ?>" class="w-full flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
		<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'promptpalette' ); ?>" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
			<?php echo pp_icon( 'search', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</button>
	</form>

	<?php if ( $pp_popular ) : ?>
		<div class="mt-6 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 text-sm text-muted-foreground">
			<span class="mr-1"><?php esc_html_e( 'Popular:', 'promptpalette' ); ?></span>
			<?php
			$last = count( $pp_popular ) - 1;
			foreach ( array_values( $pp_popular ) as $i => $t ) :
				?>
				<span class="flex items-center gap-1">
					<a href="<?php echo esc_url( add_query_arg( 's', strtolower( $t ), home_url( '/' ) ) ); ?>" class="font-bold text-foreground hover:text-primary"><?php echo esc_html( $t ); ?></a>
					<?php if ( $i < $last ) : ?>
						<span class="mx-2 text-muted-foreground/60">/</span>
					<?php endif; ?>
				</span>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</section>

<section class="mt-10" style="font-family:'DM Sans', ui-sans-serif, system-ui, sans-serif">
	<div class="glass-card mx-auto flex max-w-md items-center justify-around rounded-full p-1.5">
		<?php
		$tabs = array(
			'latest'   => array( __( 'Latest', 'promptpalette' ), 'clock' ),
			'trending' => array( __( 'Trending', 'promptpalette' ), 'flame' ),
			'popular'  => array( __( 'Popular', 'promptpalette' ), 'sparkles' ),
		);
		foreach ( $tabs as $key => $meta ) :
			$active = $pp_tab === $key;
			$url    = $pp_search ? add_query_arg( array( 'tab' => $key, 's' => $pp_search ), home_url( '/' ) ) : add_query_arg( 'tab', $key, home_url( '/' ) );
			?>
			<a href="<?php echo esc_url( $url ); ?>" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold tracking-tight transition <?php echo $active ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'; ?>">
				<?php echo pp_icon( $meta[1], 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?><?php echo esc_html( $meta[0] ); ?>
			</a>
		<?php endforeach; ?>
	</div>

	<div class="mt-4 flex items-center justify-end sm:hidden">
		<div class="glass-card inline-flex items-center gap-1 rounded-full p-1">
			<button type="button" data-cols="1" aria-label="<?php esc_attr_e( '1 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full transition text-muted-foreground">
				<?php echo pp_icon( 'square', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</button>
			<button type="button" data-cols="2" aria-label="<?php esc_attr_e( '2 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full transition text-muted-foreground">
				<?php echo pp_icon( 'grid', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</button>
		</div>
	</div>

	<?php pp_card_grid( $pp_query ); ?>
	<?php
	echo '<nav class="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm">';
	$pp_pages = paginate_links(
		array(
			'total'   => $pp_query->max_num_pages,
			'current' => $pp_paged,
			'type'    => 'array',
			'format'  => '?paged=%#%',
			'add_args' => array_filter( array( 'tab' => 'latest' !== $pp_tab ? $pp_tab : null, 's' => $pp_search ? $pp_search : null ) ),
		)
	);
	if ( $pp_pages ) {
		foreach ( $pp_pages as $l ) {
			$l = str_replace(
				array( 'page-numbers current', 'page-numbers' ),
				array( 'btn-gradient rounded-full px-4 py-2', 'glass-card rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground' ),
				$l
			);
			echo wp_kses_post( $l );
		}
	}
	echo '</nav>';
	?>
</section>

<?php
$pp_cats = get_terms( array( 'taxonomy' => 'prompt_library', 'hide_empty' => true, 'number' => 1 ) );
if ( ! is_wp_error( $pp_cats ) && $pp_cats ) :
	?>
	<section class="mt-20">
		<h2 class="text-center text-3xl"><?php esc_html_e( 'Browse by Category', 'promptpalette' ); ?></h2>
		<p class="mt-2 text-center text-sm text-muted-foreground"><?php esc_html_e( 'Find the perfect look for your next project.', 'promptpalette' ); ?></p>
		<?php pp_category_tiles( 12 ); ?>
		<div class="mt-6 text-center">
			<a href="<?php echo esc_url( home_url( '/libraries/' ) ); ?>" class="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg">
				<?php esc_html_e( 'View All', 'promptpalette' ); ?> <?php echo pp_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			</a>
		</div>
	</section>
	<?php
endif;

get_footer();
