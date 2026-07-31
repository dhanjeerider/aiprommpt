<?php
/**
 * AJAX endpoints: like, save, copy counter, rating.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pp_check_nonce() {
	if ( ! check_ajax_referer( 'pp_nonce', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'bad nonce' ), 403 );
	}
}

function pp_ajax_like() {
	pp_check_nonce();
	$id  = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	$dir = isset( $_POST['dir'] ) && 'down' === $_POST['dir'] ? -1 : 1;
	if ( ! $id || 'prompt' !== get_post_type( $id ) ) {
		wp_send_json_error( array( 'message' => 'invalid' ), 400 );
	}
	$likes = max( 0, (int) get_post_meta( $id, 'pp_likes', true ) + $dir );
	update_post_meta( $id, 'pp_likes', $likes );
	wp_send_json_success( array( 'likes' => $likes ) );
}
add_action( 'wp_ajax_pp_like', 'pp_ajax_like' );
add_action( 'wp_ajax_nopriv_pp_like', 'pp_ajax_like' );

function pp_ajax_copy() {
	pp_check_nonce();
	$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	if ( ! $id ) {
		wp_send_json_error( array(), 400 );
	}
	$copies = (int) get_post_meta( $id, 'pp_copies', true ) + 1;
	update_post_meta( $id, 'pp_copies', $copies );
	wp_send_json_success( array( 'copies' => $copies ) );
}
add_action( 'wp_ajax_pp_copy', 'pp_ajax_copy' );
add_action( 'wp_ajax_nopriv_pp_copy', 'pp_ajax_copy' );

function pp_ajax_rate() {
	pp_check_nonce();
	$id    = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	$stars = isset( $_POST['stars'] ) ? max( 1, min( 5, absint( $_POST['stars'] ) ) ) : 0;
	if ( ! $id || ! $stars ) {
		wp_send_json_error( array(), 400 );
	}
	$count = (int) get_post_meta( $id, 'pp_rating_count', true );
	$sum   = (float) get_post_meta( $id, 'pp_rating_sum', true );
	if ( ! $count ) {
		$sum   = pp_rating( $id );
		$count = 1;
	}
	$count++;
	$sum += $stars;
	update_post_meta( $id, 'pp_rating_count', $count );
	update_post_meta( $id, 'pp_rating_sum', $sum );
	$avg = round( $sum / $count, 1 );
	update_post_meta( $id, 'pp_rating', $avg );
	wp_send_json_success( array( 'rating' => $avg, 'count' => $count ) );
}
add_action( 'wp_ajax_pp_rate', 'pp_ajax_rate' );
add_action( 'wp_ajax_nopriv_pp_rate', 'pp_ajax_rate' );
