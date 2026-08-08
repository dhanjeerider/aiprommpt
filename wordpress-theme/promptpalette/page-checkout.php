<?php
/**
 * Template Name: Checkout (UPI)
 * Description: UPI payment page with UTR + screenshot submission.
 *
 * @package PromptPalette
 */

get_header();
$price    = pp_setting( 'premium_price', '499' );
$currency = pp_setting( 'premium_currency', 'INR' );
$symbol   = 'INR' === $currency ? '₹' : ( 'USD' === $currency ? '$' : $currency . ' ' );
$upi      = pp_setting( 'upi_id' );
$qr       = pp_setting( 'upi_qr_url' );
?>
<nav class="glass-card flex w-fit max-w-full flex-wrap items-center gap-1.5 rounded-full px-2 py-1.5 text-xs text-muted-foreground" aria-label="<?php esc_attr_e( 'Breadcrumb', 'promptpalette' ); ?>">
	<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="rounded-full px-2.5 py-1 font-semibold transition hover:bg-white/10 hover:text-foreground"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
	<?php echo pp_icon( 'chevron-right', 'h-3 w-3 shrink-0' ); // phpcs:ignore ?>
	<a href="<?php echo esc_url( home_url( '/premium/' ) ); ?>" class="rounded-full px-2.5 py-1 font-semibold transition hover:bg-white/10 hover:text-foreground"><?php esc_html_e( 'Premium', 'promptpalette' ); ?></a>
	<?php echo pp_icon( 'chevron-right', 'h-3 w-3 shrink-0' ); // phpcs:ignore ?>
	<span class="rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 font-bold text-white"><?php esc_html_e( 'Checkout', 'promptpalette' ); ?></span>
</nav>

<section class="mt-6">
	<h1 class="text-3xl sm:text-4xl"><?php esc_html_e( 'Checkout', 'promptpalette' ); ?></h1>
	<p class="mt-2 max-w-2xl text-sm text-muted-foreground"><?php esc_html_e( 'Pay with any UPI app, then submit your transaction reference. Access is emailed after a quick manual check.', 'promptpalette' ); ?></p>

	<?php if ( pp_order_success() ) : ?>
		<div class="glass-card mt-8 rounded-3xl p-8 text-center sm:p-10">
			<span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><?php echo pp_icon( 'check', 'h-6 w-6' ); // phpcs:ignore ?></span>
			<h2 class="mt-4 text-2xl font-black"><?php esc_html_e( 'Payment submitted', 'promptpalette' ); ?></h2>
			<p class="mx-auto mt-2 max-w-md text-sm text-muted-foreground"><?php esc_html_e( 'We received your details. Premium access will be emailed to you shortly after verification.', 'promptpalette' ); ?></p>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn-gradient mt-6 inline-flex rounded-full px-6 py-3 text-sm"><?php esc_html_e( 'Back to prompts', 'promptpalette' ); ?></a>
		</div>
	<?php else : ?>
		<?php pp_order_error(); ?>

		<div class="mt-8 grid gap-5 lg:grid-cols-2">
			<div class="glass-card rounded-3xl p-6 sm:p-7">
				<h2 class="text-lg font-black"><?php esc_html_e( 'Step 1 — Pay', 'promptpalette' ); ?></h2>
				<div class="mt-4 flex items-baseline gap-2">
					<span class="text-sm text-muted-foreground"><?php esc_html_e( 'Amount', 'promptpalette' ); ?></span>
					<span class="gradient-text text-3xl font-black"><?php echo esc_html( $symbol . $price ); ?></span>
				</div>

				<?php if ( $upi ) : ?>
					<div class="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
						<div class="text-[11px] font-black uppercase tracking-widest text-muted-foreground"><?php esc_html_e( 'UPI ID', 'promptpalette' ); ?></div>
						<div class="mt-1 flex flex-wrap items-center gap-2">
							<code class="select-all break-all text-sm font-bold"><?php echo esc_html( $upi ); ?></code>
							<button type="button" id="pp-copy-upi" data-upi="<?php echo esc_attr( $upi ); ?>" class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold transition hover:bg-white/10">
								<?php echo pp_icon( 'copy', 'h-3.5 w-3.5' ); // phpcs:ignore ?> <?php esc_html_e( 'Copy', 'promptpalette' ); ?>
							</button>
						</div>
					</div>
					<a href="<?php echo esc_attr( 'upi://pay?pa=' . rawurlencode( $upi ) . '&am=' . rawurlencode( $price ) . '&cu=' . rawurlencode( $currency ) . '&tn=' . rawurlencode( 'Premium access' ) ); ?>" class="btn-gradient mt-4 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm shadow-lg"><?php esc_html_e( 'Open UPI app', 'promptpalette' ); ?></a>
				<?php else : ?>
					<p class="mt-5 text-sm text-muted-foreground"><?php esc_html_e( 'Add your UPI ID in PromptPalette → Theme Settings to enable payments.', 'promptpalette' ); ?></p>
				<?php endif; ?>

				<?php if ( $qr ) : ?>
					<img src="<?php echo esc_url( $qr ); ?>" alt="<?php esc_attr_e( 'UPI QR code', 'promptpalette' ); ?>" class="mt-5 w-full max-w-[260px] rounded-2xl border border-white/10" />
				<?php endif; ?>

				<?php if ( pp_setting( 'premium_note' ) ) : ?>
					<p class="mt-5 text-[13px] text-muted-foreground"><?php echo esc_html( pp_setting( 'premium_note' ) ); ?></p>
				<?php endif; ?>
			</div>

			<div class="glass-card rounded-3xl p-6 sm:p-7">
				<h2 class="text-lg font-black"><?php esc_html_e( 'Step 2 — Confirm your payment', 'promptpalette' ); ?></h2>
				<form method="post" enctype="multipart/form-data" class="mt-5 space-y-4">
					<?php wp_nonce_field( 'pp_order', 'pp_order_nonce' ); ?>
					<div>
						<label for="pp_email" class="text-[13px] font-bold"><?php esc_html_e( 'Email for access', 'promptpalette' ); ?></label>
						<input id="pp_email" type="email" name="pp_email" required placeholder="you@example.com" value="<?php echo esc_attr( is_user_logged_in() ? wp_get_current_user()->user_email : '' ); ?>" class="mt-1.5 block w-full max-w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition focus:border-primary/60 placeholder:text-muted-foreground" />
					</div>
					<div>
						<label for="pp_utr" class="text-[13px] font-bold"><?php esc_html_e( 'UPI transaction / UTR number', 'promptpalette' ); ?></label>
						<input id="pp_utr" type="text" name="pp_utr" required placeholder="1234567890AB" class="mt-1.5 block w-full max-w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none transition focus:border-primary/60 placeholder:text-muted-foreground" />
					</div>
					<div>
						<label for="pp_screenshot" class="text-[13px] font-bold"><?php esc_html_e( 'Payment screenshot', 'promptpalette' ); ?></label>
						<input id="pp_screenshot" type="file" name="pp_screenshot" accept="image/*" required class="mt-1.5 block w-full max-w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-bold file:text-primary-foreground" />
					</div>
					<button type="submit" name="pp_order_submit" value="1" class="btn-gradient inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm shadow-lg">
						<?php echo pp_icon( 'shield-check', 'h-4 w-4' ); // phpcs:ignore ?> <?php esc_html_e( 'Submit payment', 'promptpalette' ); ?>
					</button>
					<p class="text-[12px] text-muted-foreground"><?php esc_html_e( 'Your details are only used to verify the payment and deliver access.', 'promptpalette' ); ?></p>
				</form>
			</div>
		</div>
	<?php endif; ?>
</section>
<?php get_footer(); ?>
