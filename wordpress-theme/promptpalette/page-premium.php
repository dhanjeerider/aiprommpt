<?php
/**
 * Template Name: Premium
 *
 * @package PromptPalette
 */

get_header();
$price    = pp_option( 'premium_price' );
$currency = pp_option( 'premium_currency', 'INR' );
$symbol   = 'INR' === $currency ? '₹' : ( 'USD' === $currency ? '$' : $currency . ' ' );
$checkout = home_url( '/checkout/' );
?>
<section class="hero glass-card">
	<h1><?php esc_html_e( 'Go', 'promptpalette' ); ?> <span class="gradient-text"><?php esc_html_e( 'Premium', 'promptpalette' ); ?></span></h1>
	<p><?php echo esc_html( pp_option( 'premium_note', __( 'Lifetime access to every premium prompt pack, including all future drops.', 'promptpalette' ) ) ); ?></p>
</section>

<section>
	<div class="price-grid">
		<div class="price glass-card">
			<h3><?php esc_html_e( 'Free', 'promptpalette' ); ?></h3>
			<div class="amount"><?php echo esc_html( $symbol ); ?>0</div>
			<div class="feature-list">
				<span><?php esc_html_e( 'Browse the full free library', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'Copy any free prompt', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'New prompts every week', 'promptpalette' ); ?></span>
			</div>
			<a class="btn" style="margin-top:24px" href="<?php echo esc_url( get_post_type_archive_link( 'prompt' ) ); ?>"><?php esc_html_e( 'Start browsing', 'promptpalette' ); ?></a>
		</div>

		<div class="price glass-strong" style="border-radius:24px">
			<h3><?php esc_html_e( 'Premium — lifetime', 'promptpalette' ); ?></h3>
			<div class="amount gradient-text"><?php echo esc_html( $symbol . $price ); ?></div>
			<div class="feature-list">
				<span><?php esc_html_e( 'Every premium prompt unlocked', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'Multi-prompt packs with demo images', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'Priority support over email', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'One-time payment, no renewals', 'promptpalette' ); ?></span>
			</div>
			<a class="btn btn-gradient" style="margin-top:24px" href="<?php echo esc_url( $checkout ); ?>"><?php esc_html_e( 'Buy premium access', 'promptpalette' ); ?></a>
		</div>
	</div>

	<?php while ( have_posts() ) : the_post(); ?>
		<div class="entry-content glass-card" style="margin-top:28px;padding:28px"><?php the_content(); ?></div>
	<?php endwhile; ?>
</section>
<?php get_footer(); ?>
