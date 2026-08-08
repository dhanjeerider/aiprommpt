<?php
/**
 * Template Name: Libraries
 * Description: Grid of every prompt library / category.
 *
 * @package PromptPalette
 */

get_header();
?>
<section class="grid-bg -mx-4 rounded-[36px] px-4 py-12 text-center sm:py-16">
	<h1 class="text-3xl sm:text-5xl"><?php esc_html_e( 'Prompt', 'promptpalette' ); ?> <span class="gradient-text"><?php esc_html_e( 'Libraries', 'promptpalette' ); ?></span></h1>
	<p class="mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base"><?php esc_html_e( 'Browse curated collections and jump straight to the look you need.', 'promptpalette' ); ?></p>
</section>

<section class="mt-10">
	<?php pp_category_tiles( 60, true ); ?>
</section>

<?php while ( have_posts() ) : the_post(); ?>
	<?php if ( trim( get_the_content() ) ) : ?>
		<section class="glass-card mt-10 rounded-3xl p-7 sm:p-10">
			<div class="pp-prose"><?php the_content(); ?></div>
		</section>
	<?php endif; ?>
<?php endwhile; ?>

<?php pp_ad_slot( 'ad_slot_grid', 'banner', 'mt-10' ); ?>
<?php get_footer(); ?>
