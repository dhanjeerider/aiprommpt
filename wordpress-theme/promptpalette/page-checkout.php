<?php
/**
 * Template Name: Checkout (UPI)
 *
 * @package PromptPalette
 */

get_header();
$price    = pp_option( 'premium_price' );
$currency = pp_option( 'premium_currency', 'INR' );
$symbol   = 'INR' === $currency ? '₹' : ( 'USD' === $currency ? '$' : $currency . ' ' );
$upi      = pp_option( 'upi_id' );
$qr       = pp_option( 'upi_qr_url' );
?>
<section>
	<h1><?php esc_html_e( 'Checkout', 'promptpalette' ); ?></h1>
	<p class="muted" style="margin-top:8px"><?php esc_html_e( 'Pay with any UPI app, then submit your transaction reference. Access is emailed after a quick manual check.', 'promptpalette' ); ?></p>

	<?php pp_order_message(); ?>

	<div class="prompt-layout" style="margin-top:24px">
		<div class="glass-card" style="padding:24px">
			<h3><?php esc_html_e( 'Step 1 — Pay', 'promptpalette' ); ?></h3>
			<p class="muted" style="margin-top:8px"><?php esc_html_e( 'Amount', 'promptpalette' ); ?>: <strong style="color:var(--foreground)"><?php echo esc_html( $symbol . $price ); ?></strong></p>
			<?php if ( $upi ) : ?>
				<p style="margin-top:12px"><?php esc_html_e( 'UPI ID', 'promptpalette' ); ?>: <strong><?php echo esc_html( $upi ); ?></strong></p>
				<a class="btn btn-gradient" style="margin-top:14px" href="<?php echo esc_attr( 'upi://pay?pa=' . rawurlencode( $upi ) . '&am=' . rawurlencode( $price ) . '&cu=' . rawurlencode( $currency ) . '&tn=' . rawurlencode( 'Premium access' ) ); ?>"><?php esc_html_e( 'Open UPI app', 'promptpalette' ); ?></a>
			<?php endif; ?>
			<?php if ( $qr ) : ?>
				<img src="<?php echo esc_url( $qr ); ?>" alt="<?php esc_attr_e( 'UPI QR code', 'promptpalette' ); ?>" style="margin-top:18px;max-width:260px;border-radius:18px" />
			<?php endif; ?>
			<?php if ( pp_option( 'premium_note' ) ) : ?>
				<p class="muted" style="margin-top:16px;font-size:13px"><?php echo esc_html( pp_option( 'premium_note' ) ); ?></p>
			<?php endif; ?>
		</div>

		<div class="glass-card" style="padding:24px">
			<h3><?php esc_html_e( 'Step 2 — Confirm your payment', 'promptpalette' ); ?></h3>
			<form method="post" enctype="multipart/form-data" class="form-grid" style="margin-top:16px">
				<?php wp_nonce_field( 'pp_order', 'pp_order_nonce' ); ?>
				<div>
					<label for="pp_email"><?php esc_html_e( 'Email for access', 'promptpalette' ); ?></label>
					<input class="field" id="pp_email" type="email" name="pp_email" required placeholder="you@example.com" value="<?php echo esc_attr( is_user_logged_in() ? wp_get_current_user()->user_email : '' ); ?>" />
				</div>
				<div>
					<label for="pp_utr"><?php esc_html_e( 'UPI transaction / UTR number', 'promptpalette' ); ?></label>
					<input class="field" id="pp_utr" type="text" name="pp_utr" required placeholder="1234567890AB" />
				</div>
				<div>
					<label for="pp_screenshot"><?php esc_html_e( 'Payment screenshot', 'promptpalette' ); ?></label>
					<input class="field" id="pp_screenshot" type="file" name="pp_screenshot" accept="image/*" />
				</div>
				<button class="btn btn-gradient" type="submit" name="pp_order_submit" value="1" style="width:100%"><?php esc_html_e( 'Submit payment', 'promptpalette' ); ?></button>
			</form>
		</div>
	</div>
</section>
<?php get_footer(); ?>
