<?php
/**
 * Search results.
 *
 * @package PromptPalette
 */

get_header();
?>
<section>
	<h1 class="text-3xl sm:text-4xl">
		<?php
		/* translators: search query */
		printf( esc_html__( 'Results for “%s”', 'promptpalette' ), esc_html( get_search_query() ) );
		?>
	</h1>
	<p class="mt-2 text-sm text-muted-foreground"><?php echo esc_html( sprintf( _n( '%d match', '%d matches', (int) $GLOBALS['wp_query']->found_posts, 'promptpalette' ), (int) $GLOBALS['wp_query']->found_posts ) ); ?></p>

	<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="glass-card mt-6 flex max-w-2xl items-center gap-2 rounded-full p-1.5 pl-5">
		<input type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search prompts…', 'promptpalette' ); ?>" class="w-full flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
		<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'promptpalette' ); ?>" class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-md"><?php echo pp_icon( 'search', 'h-4 w-4' ); // phpcs:ignore ?></button>
	</form>

	<?php pp_card_grid(); ?>
	<?php pp_pagination(); ?>
</section>
<?php
get_footer();
