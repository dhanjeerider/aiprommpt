<?php
/**
 * 404.
 *
 * @package PromptPalette
 */

get_header();
?>
<section class="glass-card center" style="padding:56px 24px">
	<h1><?php esc_html_e( 'Prompt not found', 'promptpalette' ); ?></h1>
	<p class="muted" style="margin-top:10px"><?php esc_html_e( "The page you're looking for doesn't exist.", 'promptpalette' ); ?></p>
	<a class="btn btn-gradient" style="margin-top:22px" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back home', 'promptpalette' ); ?></a>
</section>
<?php get_footer(); ?>
