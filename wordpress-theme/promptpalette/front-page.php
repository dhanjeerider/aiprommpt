<?php
/**
 * Home page: hero, sort tabs, grid toggle, card grid, libraries bento.
 *
 * @package PromptPalette
 */

get_header();

$sort  = isset( $_GET['sort'] ) ? sanitize_key( wp_unslash( $_GET['sort'] ) ) : 'latest'; // phpcs:ignore WordPress.Security.NonceVerification
$paged = max( 1, (int) get_query_var( 'paged' ), (int) get_query_var( 'page' ) );
$query = pp_sorted_query( $sort, 12, $paged );
$tabs  = array(
	'latest'   => __( 'Latest', 'promptpalette' ),
	'trending' => __( 'Trending', 'promptpalette' ),
	'popular'  => __( 'Popular', 'promptpalette' ),
);
$tags = array_filter( array_map( 'trim', explode( ',', (string) pp_option( 'popular_tags' ) ) ) );
?>

<section class="hero glass-card">
	<h1>
		<?php echo esc_html( pp_option( 'hero_title' ) ); ?>
		<span class="gradient-text"><?php echo esc_html( pp_option( 'hero_gradient_text' ) ); ?></span>
	</h1>
	<p><?php echo esc_html( pp_option( 'hero_subtitle' ) ); ?></p>
	<div class="hero-actions">
		<a class="btn btn-gradient" href="<?php echo esc_url( get_post_type_archive_link( 'prompt' ) ); ?>"><?php esc_html_e( 'Browse prompts', 'promptpalette' ); ?></a>
		<a class="btn" href="<?php echo esc_url( home_url( '/premium/' ) ); ?>"><?php echo pp_icon( 'crown' ); // phpcs:ignore ?> <?php esc_html_e( 'Go premium', 'promptpalette' ); ?></a>
	</div>
	<?php if ( $tags ) : ?>
		<div class="chips">
			<?php foreach ( $tags as $tag ) : ?>
				<a class="chip" href="<?php echo esc_url( home_url( '/?s=' . rawurlencode( $tag ) ) ); ?>">#<?php echo esc_html( $tag ); ?></a>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>
</section>

<?php pp_ad( 'ad_slot_grid' ); ?>

<section>
	<div class="toolbar">
		<div class="tabs glass-card">
			<?php foreach ( $tabs as $key => $label ) : ?>
				<a class="<?php echo $sort === $key ? 'active' : ''; ?>" href="<?php echo esc_url( add_query_arg( 'sort', $key, home_url( '/' ) ) ); ?>"><?php echo esc_html( $label ); ?></a>
			<?php endforeach; ?>
		</div>
		<div class="layout-toggle glass-card">
			<button type="button" data-cols="1" aria-label="<?php esc_attr_e( 'One column', 'promptpalette' ); ?>"><?php echo pp_icon( 'square' ); // phpcs:ignore ?></button>
			<button type="button" data-cols="2" aria-label="<?php esc_attr_e( 'Two columns', 'promptpalette' ); ?>"><?php echo pp_icon( 'grid' ); // phpcs:ignore ?></button>
		</div>
	</div>

	<div style="margin-top:20px">
		<?php pp_card_grid( $query ); ?>
	</div>

	<div class="pagination">
		<?php
		echo wp_kses_post(
			paginate_links(
				array(
					'total'   => $query->max_num_pages,
					'current' => $paged,
					'format'  => '?paged=%#%',
					'add_args' => array( 'sort' => $sort ),
				)
			)
		);
		?>
	</div>
</section>

<?php
$libraries = get_terms( array( 'taxonomy' => 'prompt_library', 'hide_empty' => false, 'number' => 8 ) );
if ( $libraries && ! is_wp_error( $libraries ) ) :
	?>
	<section>
		<h2><?php esc_html_e( 'Browse by category', 'promptpalette' ); ?></h2>
		<p class="muted" style="margin-top:8px"><?php esc_html_e( 'Curated libraries of tested prompts, grouped by look and use case.', 'promptpalette' ); ?></p>
		<div class="cat-grid" style="margin-top:20px">
			<?php foreach ( $libraries as $lib ) : ?>
				<a class="cat-card glass-card" href="<?php echo esc_url( get_term_link( $lib ) ); ?>">
					<h3><?php echo esc_html( $lib->name ); ?></h3>
					<p><?php echo esc_html( sprintf( _n( '%d prompt', '%d prompts', $lib->count, 'promptpalette' ), $lib->count ) ); ?></p>
				</a>
			<?php endforeach; ?>
		</div>
	</section>
<?php endif; ?>

<?php pp_ad( 'ad_slot_sidebar' ); ?>

<section>
	<div class="glass-card center" style="padding:48px 24px">
		<h2><?php esc_html_e( 'Unlock the full premium library', 'promptpalette' ); ?></h2>
		<p class="muted" style="margin-top:12px"><?php esc_html_e( 'Lifetime access to every premium prompt pack, new drops included.', 'promptpalette' ); ?></p>
		<a class="btn btn-orange" style="margin-top:22px" href="<?php echo esc_url( home_url( '/premium/' ) ); ?>"><?php esc_html_e( 'See pricing', 'promptpalette' ); ?></a>
	</div>
</section>

<?php get_footer(); ?>
