<?php
/**
 * Static page (About, Contact, Privacy, Terms, Refund, AI policy…).
 *
 * @package PromptPalette
 */

get_header();
while ( have_posts() ) :
	the_post();
	?>
	<article class="glass-card rounded-3xl p-7 sm:p-10">
		<h1 class="text-3xl sm:text-4xl"><?php the_title(); ?></h1>
		<div class="pp-prose mt-4"><?php the_content(); ?></div>
	</article>
	<?php
endwhile;
get_footer();
