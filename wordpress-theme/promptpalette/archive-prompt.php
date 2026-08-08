<?php
/**
 * Prompt archive — all prompts.
 *
 * @package PromptPalette
 */

get_header();
?>
<section>
	<h1 class="text-3xl sm:text-4xl"><?php esc_html_e( 'All prompts', 'promptpalette' ); ?></h1>
	<p class="mt-2 text-sm text-muted-foreground"><?php esc_html_e( 'Copy-ready prompts for AI photo editing and generation.', 'promptpalette' ); ?></p>

	<div class="mt-6 flex items-center justify-between gap-3">
		<span class="text-[13px] text-muted-foreground"><?php echo esc_html( sprintf( _n( '%d prompt', '%d prompts', (int) $GLOBALS['wp_query']->found_posts, 'promptpalette' ), (int) $GLOBALS['wp_query']->found_posts ) ); ?></span>
		<div class="glass-card inline-flex items-center gap-1 rounded-full p-1 sm:hidden">
			<button type="button" data-cols="1" aria-label="<?php esc_attr_e( '1 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition"><?php echo pp_icon( 'square', 'h-4 w-4' ); // phpcs:ignore ?></button>
			<button type="button" data-cols="2" aria-label="<?php esc_attr_e( '2 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition"><?php echo pp_icon( 'grid', 'h-4 w-4' ); // phpcs:ignore ?></button>
		</div>
	</div>

	<?php pp_card_grid(); ?>
	<?php pp_pagination(); ?>
</section>
<?php
get_footer();
