<?php
/**
 * Fallback archive/blog listing.
 *
 * @package PromptPalette
 */

get_header();
?>
<section>
	<h1><?php echo esc_html( is_search() ? sprintf( __( 'Results for “%s”', 'promptpalette' ), get_search_query() ) : __( 'All prompts', 'promptpalette' ) ); ?></h1>
	<div class="toolbar" style="margin-top:18px">
		<span class="muted" style="font-size:13px"><?php echo esc_html( sprintf( _n( '%d prompt', '%d prompts', (int) $GLOBALS['wp_query']->found_posts, 'promptpalette' ), (int) $GLOBALS['wp_query']->found_posts ) ); ?></span>
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
