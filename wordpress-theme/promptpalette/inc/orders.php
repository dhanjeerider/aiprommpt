<?php
/**
 * UPI premium checkout: order submission handler.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handle the checkout form POST (runs before output).
 */
function pp_handle_order() {
	if ( ! isset( $_POST['pp_order_submit'] ) ) {
		return;
	}
	if ( ! isset( $_POST['pp_order_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_order_nonce'] ) ), 'pp_order' ) ) {
		$GLOBALS['pp_order_result'] = array( 'error', __( 'Security check failed. Please reload and try again.', 'promptpalette' ) );
		return;
	}

	$email = isset( $_POST['pp_email'] ) ? sanitize_email( wp_unslash( $_POST['pp_email'] ) ) : '';
	$utr   = isset( $_POST['pp_utr'] ) ? sanitize_text_field( wp_unslash( $_POST['pp_utr'] ) ) : '';

	if ( ! is_email( $email ) || ! $utr ) {
		$GLOBALS['pp_order_result'] = array( 'error', __( 'Email and UTR number are both required.', 'promptpalette' ) );
		return;
	}

	$shot = '';
	if ( ! empty( $_FILES['pp_screenshot']['name'] ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$id = media_handle_upload( 'pp_screenshot', 0 );
		if ( ! is_wp_error( $id ) ) {
			$shot = wp_get_attachment_url( $id );
		}
	}

	if ( ! $shot ) {
		$GLOBALS['pp_order_result'] = array( 'error', __( 'A payment screenshot is required.', 'promptpalette' ) );
		return;
	}

	$currency = pp_setting( 'premium_currency', 'INR' );
	$symbol   = 'INR' === $currency ? '₹' : ( 'USD' === $currency ? '$' : $currency . ' ' );
	$amount   = $symbol . pp_setting( 'premium_price', '499' );

	$order_id = wp_insert_post(
		array(
			'post_type'   => 'pp_order',
			'post_status' => 'publish',
			'post_title'  => sprintf( '%1$s — %2$s', $email, $utr ),
		)
	);

	if ( is_wp_error( $order_id ) || ! $order_id ) {
		$GLOBALS['pp_order_result'] = array( 'error', __( 'Could not save your order. Please try again.', 'promptpalette' ) );
		return;
	}

	update_post_meta( $order_id, 'pp_email', $email );
	update_post_meta( $order_id, 'pp_utr', $utr );
	update_post_meta( $order_id, 'pp_amount', $amount );
	update_post_meta( $order_id, 'pp_screenshot', $shot );
	update_post_meta( $order_id, 'pp_status', 'pending' );
	if ( is_user_logged_in() ) {
		update_post_meta( $order_id, 'pp_user_id', get_current_user_id() );
	}

	$notify = pp_setting( 'admin_notify_email', get_option( 'admin_email' ) );
	if ( $notify ) {
		wp_mail(
			$notify,
			sprintf( /* translators: site name */ __( '[%s] New premium order', 'promptpalette' ), pp_site_title() ),
			sprintf(
				"Email: %s\nUTR: %s\nAmount: %s\nScreenshot: %s\nReview: %s",
				$email,
				$utr,
				$amount,
				$shot,
				admin_url( 'post.php?post=' . $order_id . '&action=edit' )
			)
		);
	}

	$GLOBALS['pp_order_result'] = array( 'success', __( 'Payment submitted', 'promptpalette' ) );
}
add_action( 'template_redirect', 'pp_handle_order' );

/**
 * Was the order submitted successfully?
 *
 * @return bool
 */
function pp_order_success() {
	return isset( $GLOBALS['pp_order_result'] ) && 'success' === $GLOBALS['pp_order_result'][0];
}

/**
 * Render the inline error message, if any.
 */
function pp_order_error() {
	if ( isset( $GLOBALS['pp_order_result'] ) && 'error' === $GLOBALS['pp_order_result'][0] ) {
		echo '<div class="glass-card mt-6 rounded-2xl border border-red-400/30 p-4 text-sm text-red-300">' . esc_html( $GLOBALS['pp_order_result'][1] ) . '</div>';
	}
}
