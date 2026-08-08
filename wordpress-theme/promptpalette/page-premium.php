<?php
/**
 * Template Name: Premium
 * Description: Pricing page with free vs lifetime premium plan.
 *
 * @package PromptPalette
 */

get_header();
$price    = pp_setting( 'premium_price', '499' );
$currency = pp_setting( 'premium_currency', 'INR' );
$symbol   = 'INR' === $currency ? '₹' : ( 'USD' === $currency ? '$' : $currency . ' ' );
$checkout = home_url( '/checkout/' );
?>
<section class="grid-bg -mx-4 rounded-[36px] px-4 py-12 text-center sm:py-16">
	<h1 class="text-3xl sm:text-5xl"><?php esc_html_e( 'Go', 'promptpalette' ); ?> <span class="gradient-text"><?php esc_html_e( 'Premium', 'promptpalette' ); ?></span></h1>
	<p class="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
		<?php echo esc_html( pp_setting( 'premium_note', __( 'Lifetime access to every premium prompt pack, including all future drops.', 'promptpalette' ) ) ); ?>
	</p>
</section>

<section class="mt-10 grid gap-5 md:grid-cols-2">
	<div class="glass-card rounded-3xl p-7 sm:p-8">
		<h3 class="text-xl font-black"><?php esc_html_e( 'Free', 'promptpalette' ); ?></h3>
		<div class="mt-3 text-4xl font-black"><?php echo esc_html( $symbol ); ?>0</div>
		<div class="mt-6 space-y-3 text-sm text-muted-foreground">
			<?php
			$free = array(
				__( 'Browse the full free library', 'promptpalette' ),
				__( 'Copy any free prompt', 'promptpalette' ),
				__( 'New prompts every week', 'promptpalette' ),
			);
			foreach ( $free as $f ) :
				?>
				<div class="flex items-start gap-2">
					<?php echo pp_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-primary' ); // phpcs:ignore ?>
					<span><?php echo esc_html( $f ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
		<a href="<?php echo esc_url( get_post_type_archive_link( 'prompt' ) ); ?>" class="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold transition hover:bg-white/10">
			<?php esc_html_e( 'Start browsing', 'promptpalette' ); ?>
		</a>
	</div>

	<div class="glass-strong relative overflow-hidden rounded-3xl p-7 sm:p-8">
		<span class="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 text-[11px] font-black text-white">
			<?php echo pp_icon( 'crown', 'h-3 w-3' ); // phpcs:ignore ?> <?php esc_html_e( 'Best value', 'promptpalette' ); ?>
		</span>
		<h3 class="text-xl font-black"><?php esc_html_e( 'Premium — lifetime', 'promptpalette' ); ?></h3>
		<div class="gradient-text mt-3 text-4xl font-black"><?php echo esc_html( $symbol . $price ); ?></div>
		<div class="mt-6 space-y-3 text-sm text-muted-foreground">
			<?php
			$paid = array(
				__( 'Every premium prompt unlocked', 'promptpalette' ),
				__( 'Multi-prompt packs with demo images', 'promptpalette' ),
				__( 'Priority support over email', 'promptpalette' ),
				__( 'One-time payment, no renewals', 'promptpalette' ),
			);
			foreach ( $paid as $f ) :
				?>
				<div class="flex items-start gap-2">
					<?php echo pp_icon( 'check', 'mt-0.5 h-4 w-4 shrink-0 text-primary' ); // phpcs:ignore ?>
					<span><?php echo esc_html( $f ); ?></span>
				</div>
			<?php endforeach; ?>
		</div>
		<a href="<?php echo esc_url( $checkout ); ?>" class="btn-gradient mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm shadow-lg">
			<?php esc_html_e( 'Buy premium access', 'promptpalette' ); ?> <?php echo pp_icon( 'arrow-right', 'h-4 w-4' ); // phpcs:ignore ?>
		</a>
	</div>
</section>

<?php while ( have_posts() ) : the_post(); ?>
	<?php if ( trim( get_the_content() ) ) : ?>
		<section class="glass-card mt-10 rounded-3xl p-7 sm:p-10"><div class="pp-prose"><?php the_content(); ?></div></section>
	<?php endif; ?>
<?php endwhile; ?>

<section class="mt-14">
	<h2 class="text-2xl font-bold tracking-tight"><?php esc_html_e( 'Featured premium prompts', 'promptpalette' ); ?></h2>
	<?php
	$premium_q = new WP_Query(
		array(
			'post_type'      => 'prompt',
			'posts_per_page' => 8,
			'meta_query'     => array( array( 'key' => 'pp_premium', 'value' => '1' ) ), // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
		)
	);
	pp_card_grid( $premium_q, 'mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4', false );
	?>
</section>
<?php get_footer(); ?>
