<?php
/**
 * Template Name: Libraries
 *
 * @package PromptPalette
 */

get_header();
$libraries = get_terms( array( 'taxonomy' => 'prompt_library', 'hide_empty' => false ) );
?>
<section>
	<h1><?php the_title(); ?></h1>
	<?php while ( have_posts() ) : the_post(); ?>
		<div class="entry-content" style="margin-top:10px"><?php the_content(); ?></div>
	<?php endwhile; ?>

	<div class="cat-grid" style="margin-top:24px">
		<?php if ( $libraries && ! is_wp_error( $libraries ) ) : ?>
			<?php foreach ( $libraries as $lib ) : ?>
				<a class="cat-card glass-card" href="<?php echo esc_url( get_term_link( $lib ) ); ?>">
					<h3><?php echo esc_html( $lib->name ); ?></h3>
					<p><?php echo esc_html( sprintf( _n( '%d prompt', '%d prompts', $lib->count, 'promptpalette' ), $lib->count ) ); ?></p>
					<?php if ( $lib->description ) : ?>
						<p><?php echo esc_html( wp_html_excerpt( $lib->description, 80, '…' ) ); ?></p>
					<?php endif; ?>
				</a>
			<?php endforeach; ?>
		<?php else : ?>
			<p class="muted"><?php esc_html_e( 'No libraries yet — create them under Prompts → Libraries.', 'promptpalette' ); ?></p>
		<?php endif; ?>
	</div>
</section>
<?php pp_ad( 'ad_slot_grid' ); ?>
<?php get_footer(); ?>
