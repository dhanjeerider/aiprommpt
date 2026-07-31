<?php
/**
 * Taxonomy archive for libraries, tags, tools and styles.
 *
 * @package PromptPalette
 */

get_header();
$term = get_queried_object();
?>
<section>
	<nav class="breadcrumbs">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
		<?php echo pp_icon( 'chevron' ); // phpcs:ignore ?>
		<span><?php echo esc_html( $term->name ); ?></span>
	</nav>
	<h1 style="margin-top:14px"><?php echo esc_html( $term->name ); ?></h1>
	<?php if ( $term->description ) : ?>
		<p class="muted" style="margin-top:8px"><?php echo esc_html( $term->description ); ?></p>
	<?php endif; ?>
	<div class="toolbar" style="margin-top:18px">
		<span class="muted" style="font-size:13px"><?php echo esc_html( sprintf( _n( '%d prompt', '%d prompts', (int) $term->count, 'promptpalette' ), (int) $term->count ) ); ?></span>
		<div class="layout-toggle glass-card">
			<button type="button" data-cols="1" aria-label="<?php esc_attr_e( 'One column', 'promptpalette' ); ?>"><?php echo pp_icon( 'square' ); // phpcs:ignore ?></button>
			<button type="button" data-cols="2" aria-label="<?php esc_attr_e( 'Two columns', 'promptpalette' ); ?>"><?php echo pp_icon( 'grid' ); // phpcs:ignore ?></button>
		</div>
	</div>
	<div style="margin-top:20px"><?php pp_card_grid(); ?></div>
	<div class="pagination"><?php echo wp_kses_post( paginate_links() ); ?></div>
</section>
<?php
get_footer();
