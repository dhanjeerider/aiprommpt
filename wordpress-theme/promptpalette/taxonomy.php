<?php
/**
 * Taxonomy archive — libraries / tags / tools / styles.
 *
 * @package PromptPalette
 */

get_header();
$term = get_queried_object();
?>
<nav class="glass-card flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted-foreground" aria-label="<?php esc_attr_e( 'Breadcrumb', 'promptpalette' ); ?>">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="rounded-full px-2.5 py-1 font-semibold transition hover:bg-white/10 hover:text-foreground"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
	<?php echo pp_icon( 'chevron-right', 'h-3 w-3 shrink-0' ); // phpcs:ignore ?>
	<span class="rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 font-bold capitalize text-white"><?php echo esc_html( $term->name ); ?></span>
</nav>

<section class="mt-6">
	<h1 class="text-3xl capitalize sm:text-4xl"><?php echo esc_html( $term->name ); ?></h1>
	<p class="mt-2 text-sm text-muted-foreground">
		<?php
		echo $term->description
			? esc_html( $term->description )
			: esc_html( sprintf( _n( '%d prompt in this collection.', '%d prompts in this collection.', (int) $term->count, 'promptpalette' ), (int) $term->count ) );
		?>
	</p>

	<div class="mt-6 flex items-center justify-end sm:hidden">
		<div class="glass-card inline-flex items-center gap-1 rounded-full p-1">
			<button type="button" data-cols="1" aria-label="<?php esc_attr_e( '1 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition"><?php echo pp_icon( 'square', 'h-4 w-4' ); // phpcs:ignore ?></button>
			<button type="button" data-cols="2" aria-label="<?php esc_attr_e( '2 column grid', 'promptpalette' ); ?>" class="pp-cols grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition"><?php echo pp_icon( 'grid', 'h-4 w-4' ); // phpcs:ignore ?></button>
		</div>
	</div>

	<?php pp_card_grid(); ?>
	<?php pp_pagination(); ?>
</section>
<?php
get_footer();
