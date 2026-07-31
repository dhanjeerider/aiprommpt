<?php
/**
 * Premium UPI orders: front-end submission + admin review.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Handles the checkout form POST.
 */
function pp_handle_order_submit() {
	if ( ! isset( $_POST['pp_order_submit'] ) ) {
		return;
	}
	if ( ! isset( $_POST['pp_order_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_order_nonce'] ) ), 'pp_order' ) ) {
		wp_die( esc_html__( 'Security check failed.', 'promptpalette' ) );
	}

	$email = isset( $_POST['pp_email'] ) ? sanitize_email( wp_unslash( $_POST['pp_email'] ) ) : '';
	$utr   = isset( $_POST['pp_utr'] ) ? sanitize_text_field( wp_unslash( $_POST['pp_utr'] ) ) : '';

	if ( ! is_email( $email ) || strlen( $utr ) < 6 ) {
		set_transient( 'pp_order_msg_' . pp_client_key(), array( 'err', __( 'Please enter a valid email and your UPI transaction/UTR number.', 'promptpalette' ) ), 60 );
		return;
	}

	$screenshot = '';
	if ( ! empty( $_FILES['pp_screenshot']['name'] ) ) {
		require_once ABSPATH . 'wp-admin/includes/file.php';
		require_once ABSPATH . 'wp-admin/includes/media.php';
		require_once ABSPATH . 'wp-admin/includes/image.php';
		$attachment_id = media_handle_upload( 'pp_screenshot', 0 );
		if ( is_wp_error( $attachment_id ) ) {
			set_transient( 'pp_order_msg_' . pp_client_key(), array( 'err', __( 'Screenshot upload failed. Please try a smaller JPG/PNG.', 'promptpalette' ) ), 60 );
			return;
		}
		$screenshot = wp_get_attachment_url( $attachment_id );
	}

	$order_id = wp_insert_post(
		array(
			'post_type'   => 'pp_order',
			'post_status' => 'publish',
			'post_title'  => sprintf( '%s — %s', $email, $utr ),
		)
	);
	if ( ! $order_id || is_wp_error( $order_id ) ) {
		return;
	}
	update_post_meta( $order_id, 'pp_email', $email );
	update_post_meta( $order_id, 'pp_utr', $utr );
	update_post_meta( $order_id, 'pp_screenshot', $screenshot );
	update_post_meta( $order_id, 'pp_amount', pp_option( 'premium_price' ) );
	update_post_meta( $order_id, 'pp_status', 'pending' );
	if ( is_user_logged_in() ) {
		update_post_meta( $order_id, 'pp_user_id', get_current_user_id() );
	}

	wp_mail(
		get_option( 'admin_email' ),
		'New premium order — ' . $email,
		sprintf( "UTR: %s\nAmount: %s\nScreenshot: %s", $utr, pp_option( 'premium_price' ), $screenshot )
	);

	set_transient( 'pp_order_msg_' . pp_client_key(), array( 'ok', __( 'Thanks! Your payment is under review. You will get access by email shortly.', 'promptpalette' ) ), 60 );
}
add_action( 'template_redirect', 'pp_handle_order_submit' );

function pp_client_key() {
	return md5( ( isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '' ) . get_current_user_id() );
}

function pp_order_message() {
	$msg = get_transient( 'pp_order_msg_' . pp_client_key() );
	if ( ! $msg ) {
		return;
	}
	delete_transient( 'pp_order_msg_' . pp_client_key() );
	printf( '<div class="notice %1$s">%2$s</div>', esc_attr( $msg[0] ), esc_html( $msg[1] ) );
}

/**
 * Admin: order details + status.
 */
function pp_order_meta_box() {
	add_meta_box( 'pp_order_box', __( 'Order details', 'promptpalette' ), 'pp_order_box', 'pp_order', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'pp_order_meta_box' );

function pp_order_box( $post ) {
	wp_nonce_field( 'pp_order_admin', 'pp_order_admin_nonce' );
	$email  = get_post_meta( $post->ID, 'pp_email', true );
	$utr    = get_post_meta( $post->ID, 'pp_utr', true );
	$shot   = get_post_meta( $post->ID, 'pp_screenshot', true );
	$status = get_post_meta( $post->ID, 'pp_status', true );
	$note   = get_post_meta( $post->ID, 'pp_admin_note', true );
	echo '<p><strong>Email:</strong> ' . esc_html( $email ) . '</p>';
	echo '<p><strong>UTR:</strong> ' . esc_html( $utr ) . '</p>';
	if ( $shot ) {
		echo '<p><a href="' . esc_url( $shot ) . '" target="_blank"><img src="' . esc_url( $shot ) . '" style="max-width:320px;border-radius:8px" alt="" /></a></p>';
	}
	echo '<p><label><strong>Status</strong></label><br><select name="pp_status">';
	foreach ( array( 'pending', 'approved', 'rejected' ) as $s ) {
		printf( '<option value="%1$s" %2$s>%1$s</option>', esc_attr( $s ), selected( $status, $s, false ) );
	}
	echo '</select></p>';
	echo '<p><label><strong>Admin note</strong></label><br><textarea name="pp_admin_note" rows="3" class="large-text">' . esc_textarea( $note ) . '</textarea></p>';
}

function pp_save_order( $post_id ) {
	if ( ! isset( $_POST['pp_order_admin_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_order_admin_nonce'] ) ), 'pp_order_admin' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( isset( $_POST['pp_status'] ) ) {
		update_post_meta( $post_id, 'pp_status', sanitize_text_field( wp_unslash( $_POST['pp_status'] ) ) );
	}
	if ( isset( $_POST['pp_admin_note'] ) ) {
		update_post_meta( $post_id, 'pp_admin_note', sanitize_textarea_field( wp_unslash( $_POST['pp_admin_note'] ) ) );
	}
}
add_action( 'save_post_pp_order', 'pp_save_order' );

function pp_order_columns( $cols ) {
	return array(
		'cb'        => $cols['cb'],
		'title'     => __( 'Order', 'promptpalette' ),
		'pp_status' => __( 'Status', 'promptpalette' ),
		'date'      => __( 'Date', 'promptpalette' ),
	);
}
add_filter( 'manage_pp_order_posts_columns', 'pp_order_columns' );

function pp_order_column( $col, $post_id ) {
	if ( 'pp_status' === $col ) {
		echo esc_html( get_post_meta( $post_id, 'pp_status', true ) );
	}
}
add_action( 'manage_pp_order_posts_custom_column', 'pp_order_column', 10, 2 );
