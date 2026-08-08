<?php
/**
 * Front-end AJAX: likes, copy counter, star ratings, saves.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Nonce guard.
 */
function pp_check_nonce() {
	if ( ! check_ajax_referer( 'pp_nonce', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'bad nonce' ), 403 );
	}
}

/**
 * Toggle a like.
 */
function pp_ajax_like() {
	pp_check_nonce();
	$id  = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	$dir = ( isset( $_POST['dir'] ) && 'down' === sanitize_text_field( wp_unslash( $_POST['dir'] ) ) ) ? -1 : 1;
	if ( ! $id || 'prompt' !== get_post_type( $id ) ) {
		wp_send_json_error( array( 'message' => 'invalid' ), 400 );
	}
	$likes = max( 0, (int) get_post_meta( $id, 'pp_likes', true ) + $dir );
	update_post_meta( $id, 'pp_likes', $likes );
	wp_send_json_success( array( 'likes' => $likes ) );
}
add_action( 'wp_ajax_pp_like', 'pp_ajax_like' );
add_action( 'wp_ajax_nopriv_pp_like', 'pp_ajax_like' );

/**
 * Increment copy counter.
 */
function pp_ajax_copy() {
	pp_check_nonce();
	$id = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	if ( ! $id || 'prompt' !== get_post_type( $id ) ) {
		wp_send_json_error( array(), 400 );
	}
	$copies = (int) get_post_meta( $id, 'pp_copies', true ) + 1;
	update_post_meta( $id, 'pp_copies', $copies );
	wp_send_json_success( array( 'copies' => $copies ) );
}
add_action( 'wp_ajax_pp_copy', 'pp_ajax_copy' );
add_action( 'wp_ajax_nopriv_pp_copy', 'pp_ajax_copy' );

/**
 * Toggle a save.
 */
function pp_ajax_save() {
	pp_check_nonce();
	$id  = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	$dir = ( isset( $_POST['dir'] ) && 'down' === sanitize_text_field( wp_unslash( $_POST['dir'] ) ) ) ? -1 : 1;
	if ( ! $id || 'prompt' !== get_post_type( $id ) ) {
		wp_send_json_error( array(), 400 );
	}
	$saves = max( 0, (int) get_post_meta( $id, 'pp_saves', true ) + $dir );
	update_post_meta( $id, 'pp_saves', $saves );
	wp_send_json_success( array( 'saves' => $saves ) );
}
add_action( 'wp_ajax_pp_save', 'pp_ajax_save' );
add_action( 'wp_ajax_nopriv_pp_save', 'pp_ajax_save' );

/**
 * Submit a star rating; averages server-side.
 */
function pp_ajax_rate() {
	pp_check_nonce();
	$id    = isset( $_POST['id'] ) ? absint( $_POST['id'] ) : 0;
	$stars = isset( $_POST['stars'] ) ? max( 1, min( 5, absint( $_POST['stars'] ) ) ) : 0;
	if ( ! $id || ! $stars || 'prompt' !== get_post_type( $id ) ) {
		wp_send_json_error( array(), 400 );
	}
	$count = (int) get_post_meta( $id, 'pp_rating_count', true );
	$sum   = (float) get_post_meta( $id, 'pp_rating_sum', true );
	if ( $count < 1 ) {
		$sum   = pp_rating( $id );
		$count = 1;
	}
	$count++;
	$sum += $stars;
	$avg  = round( $sum / $count, 1 );
	update_post_meta( $id, 'pp_rating_count', $count );
	update_post_meta( $id, 'pp_rating_sum', $sum );
	update_post_meta( $id, 'pp_rating', $avg );
	wp_send_json_success( array( 'rating' => $avg, 'count' => $count ) );
}
add_action( 'wp_ajax_pp_rate', 'pp_ajax_rate' );
add_action( 'wp_ajax_nopriv_pp_rate', 'pp_ajax_rate' );
