<?php
/**
 * 404.
 *
 * @package PromptPalette
 */

get_header();
?>
<section class="glass-card rounded-3xl p-10 text-center">
	<h1 class="text-2xl font-bold"><?php esc_html_e( 'Prompt not found', 'promptpalette' ); ?></h1>
	<p class="mt-2 text-muted-foreground"><?php esc_html_e( "The page you're looking for doesn't exist.", 'promptpalette' ); ?></p>
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn-gradient mt-6 inline-flex rounded-full px-5 py-2.5 text-sm"><?php esc_html_e( 'Back home', 'promptpalette' ); ?></a>
</section>
<?php
get_footer();
