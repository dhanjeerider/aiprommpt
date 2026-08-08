<?php
/**
 * Home fallback (when a static front page is not used) — same feed as front-page.
 *
 * @package PromptPalette
 */

if ( is_home() || is_post_type_archive( 'prompt' ) ) {
	include get_template_directory() . '/front-page.php';
	return;
}

get_header();
?>
<section>
	<h1 class="text-3xl"><?php esc_html_e( 'Prompts', 'promptpalette' ); ?></h1>
	<?php pp_card_grid(); ?>
	<?php pp_pagination(); ?>
</section>
<?php
get_footer();
