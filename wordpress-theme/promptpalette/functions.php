<?php
/**
 * PromptPalette theme bootstrap.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PP_VERSION', '1.0.0' );
define( 'PP_DIR', get_template_directory() );
define( 'PP_URI', get_template_directory_uri() );

require_once PP_DIR . '/inc/walker.php';
require_once PP_DIR . '/inc/cpt.php';
require_once PP_DIR . '/inc/meta.php';
require_once PP_DIR . '/inc/settings.php';
require_once PP_DIR . '/inc/template-tags.php';
require_once PP_DIR . '/inc/ajax.php';
require_once PP_DIR . '/inc/orders.php';
require_once PP_DIR . '/inc/importer.php';

/**
 * Theme supports.
 */
function pp_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'custom-logo', array( 'height' => 64, 'width' => 64, 'flex-height' => true, 'flex-width' => true ) );
	add_image_size( 'pp-card', 600, 900, true );
	register_nav_menus(
		array(
			'primary' => __( 'Primary Menu', 'promptpalette' ),
			'footer_explore' => __( 'Footer — Explore', 'promptpalette' ),
			'footer_company' => __( 'Footer — Company', 'promptpalette' ),
		)
	);
}
add_action( 'after_setup_theme', 'pp_setup' );

/**
 * Assets.
 */
function pp_assets() {
	wp_enqueue_style( 'pp-fonts', 'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400..900&family=Nunito:wght@400..900&display=swap', array(), null );
	wp_enqueue_style( 'pp-style', get_stylesheet_uri(), array( 'pp-fonts' ), PP_VERSION );
	wp_enqueue_script( 'pp-theme', PP_URI . '/assets/js/theme.js', array(), PP_VERSION, true );
	wp_localize_script(
		'pp-theme',
		'PP',
		array(
			'ajax'  => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'pp_nonce' ),
		)
	);

	$adsense = pp_option( 'adsense_client' );
	if ( $adsense ) {
		wp_enqueue_script( 'pp-adsense', 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . rawurlencode( $adsense ), array(), null, true );
		wp_script_add_data( 'pp-adsense', 'attributes', array( 'crossorigin' => 'anonymous' ) );
	}
}
add_action( 'wp_enqueue_scripts', 'pp_assets' );

/**
 * Google Analytics + favicon from theme settings.
 */
function pp_head_extras() {
	$fav = pp_option( 'favicon_url' );
	if ( $fav ) {
		echo '<link rel="icon" href="' . esc_url( $fav ) . '" />' . "\n";
	}
	$gtag = pp_option( 'analytics_gtag' );
	if ( $gtag ) {
		printf(
			'<script async src="https://www.googletagmanager.com/gtag/js?id=%1$s"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","%1$s");</script>' . "\n",
			esc_js( $gtag )
		);
	}
	if ( is_singular( 'prompt' ) ) {
		pp_prompt_jsonld( get_post() );
	}
}
add_action( 'wp_head', 'pp_head_extras', 5 );

/**
 * Show prompts on the blog/search results too.
 */
function pp_include_prompts_in_search( $query ) {
	if ( ! is_admin() && $query->is_main_query() && ( $query->is_search() || $query->is_home() ) ) {
		$query->set( 'post_type', array( 'prompt' ) );
	}
	if ( ! is_admin() && $query->is_main_query() && ( is_post_type_archive( 'prompt' ) || is_tax( array( 'prompt_library', 'prompt_tag', 'prompt_tool', 'prompt_style' ) ) ) ) {
		$query->set( 'posts_per_page', 24 );
	}
}
add_action( 'pre_get_posts', 'pp_include_prompts_in_search' );

/**
 * Excerpt fallback used by cards.
 */
function pp_excerpt( $post = null, $len = 110 ) {
	$post = get_post( $post );
	$text = $post->post_excerpt ? $post->post_excerpt : wp_strip_all_tags( $post->post_content );
	return esc_html( wp_html_excerpt( $text, $len, '…' ) );
}
