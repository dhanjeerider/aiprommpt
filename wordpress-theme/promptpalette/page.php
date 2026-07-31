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
	<article class="glass-card" style="padding:32px">
		<h1><?php the_title(); ?></h1>
		<div class="entry-content"><?php the_content(); ?></div>
	</article>
	<?php
endwhile;
get_footer();
