<?php
/**
 * PromptPalette theme bootstrap.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'PP_VERSION', '2.0.0' );
define( 'PP_DIR', get_template_directory() );
define( 'PP_URI', get_template_directory_uri() );

require_once PP_DIR . '/inc/icons.php';
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
	add_image_size( 'pp-card', 600, 750, true );
	add_image_size( 'pp-tall', 800, 1200, true );
	register_nav_menus(
		array(
			'primary'        => __( 'Primary Menu', 'promptpalette' ),
			'footer_explore' => __( 'Footer — Explore', 'promptpalette' ),
			'footer_company' => __( 'Footer — Company', 'promptpalette' ),
		)
	);
}
add_action( 'after_setup_theme', 'pp_setup' );

/**
 * Front-end assets.
 */
function pp_assets() {
	wp_enqueue_style(
		'pp-fonts',
		'https://fonts.googleapis.com/css2?family=Nunito:wght@400..900&family=DM+Sans:opsz,wght@9..40,400..900&display=swap',
		array(),
		null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	);
	wp_enqueue_style( 'pp-app', PP_URI . '/assets/css/app.css', array( 'pp-fonts' ), PP_VERSION );
	wp_enqueue_style( 'pp-style', get_stylesheet_uri(), array( 'pp-app' ), PP_VERSION );

	wp_enqueue_script( 'pp-theme', PP_URI . '/assets/js/theme.js', array(), PP_VERSION, true );
	wp_localize_script(
		'pp-theme',
		'PP',
		array(
			'ajax'  => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'pp_nonce' ),
			'i18n'  => array(
				'copied'  => __( 'Prompt copied to clipboard', 'promptpalette' ),
				'copyErr' => __( 'Could not copy', 'promptpalette' ),
				'linked'  => __( 'Link copied', 'promptpalette' ),
				'saved'   => __( 'Saved to your collection', 'promptpalette' ),
				'unsaved' => __( 'Removed from saved', 'promptpalette' ),
				'thanks'  => __( 'Thanks for rating!', 'promptpalette' ),
			),
		)
	);

	$adsense = pp_setting( 'adsense_client' );
	if ( $adsense ) {
		wp_enqueue_script(
			'pp-adsense',
			'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' . rawurlencode( $adsense ),
			array(),
			null, // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
			true
		);
		wp_script_add_data( 'pp-adsense', 'attributes', array( 'crossorigin' => 'anonymous' ) );
	}
}
add_action( 'wp_enqueue_scripts', 'pp_assets' );

/**
 * Favicon, analytics and structured data.
 */
function pp_head_extras() {
	$fav = pp_setting( 'favicon_url' );
	if ( $fav ) {
		echo '<link rel="icon" href="' . esc_url( $fav ) . '" />' . "\n";
	}
	echo '<meta name="theme-color" content="#0b1120" />' . "\n";

	if ( is_singular( 'prompt' ) ) {
		$post = get_post();
		$img  = pp_featured_image( $post->ID, 'full' );
		echo '<meta property="og:type" content="article" />' . "\n";
		echo '<meta property="og:title" content="' . esc_attr( get_the_title( $post ) ) . '" />' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( pp_excerpt( $post->ID, 200 ) ) . '" />' . "\n";
		echo '<meta property="og:url" content="' . esc_url( get_permalink( $post ) ) . '" />' . "\n";
		echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
		if ( $img ) {
			echo '<meta property="og:image" content="' . esc_url( $img ) . '" />' . "\n";
			echo '<meta name="twitter:image" content="' . esc_url( $img ) . '" />' . "\n";
		}
		echo '<link rel="canonical" href="' . esc_url( get_permalink( $post ) ) . '" />' . "\n";
		pp_prompt_jsonld( $post );
	} else {
		echo '<meta property="og:type" content="website" />' . "\n";
		echo '<meta property="og:title" content="' . esc_attr( wp_get_document_title() ) . '" />' . "\n";
		echo '<meta property="og:description" content="' . esc_attr( pp_setting( 'site_tagline' ) ) . '" />' . "\n";
		echo '<meta name="twitter:card" content="summary_large_image" />' . "\n";
	}

	$gtag = pp_setting( 'analytics_gtag' );
	if ( $gtag ) {
		printf(
			'<script async src="https://www.googletagmanager.com/gtag/js?id=%1$s"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","%1$s");</script>' . "\n",
			esc_js( $gtag )
		);
	}
}
add_action( 'wp_head', 'pp_head_extras', 5 );

/**
 * Prompts drive the home feed, search and archives.
 *
 * @param WP_Query $query Query.
 */
function pp_pre_get_posts( $query ) {
	if ( is_admin() || ! $query->is_main_query() ) {
		return;
	}
	if ( $query->is_search() ) {
		$query->set( 'post_type', array( 'prompt', 'page' ) );
	}
	if ( $query->is_home() || $query->is_post_type_archive( 'prompt' ) || $query->is_tax( array( 'prompt_library', 'prompt_tag', 'prompt_tool', 'prompt_style' ) ) ) {
		$query->set( 'post_type', array( 'prompt' ) );
		$query->set( 'posts_per_page', 24 );
	}
}
add_action( 'pre_get_posts', 'pp_pre_get_posts' );

/**
 * Meta description for prompts and pages.
 */
function pp_meta_description() {
	if ( is_singular() ) {
		echo '<meta name="description" content="' . esc_attr( pp_excerpt( get_the_ID(), 160 ) ) . '" />' . "\n";
		return;
	}
	echo '<meta name="description" content="' . esc_attr( pp_setting( 'site_tagline' ) ) . '" />' . "\n";
}
add_action( 'wp_head', 'pp_meta_description', 4 );

/**
 * Body classes.
 *
 * @param array $classes Classes.
 * @return array
 */
function pp_body_class( $classes ) {
	$classes[] = 'pp-body';
	return $classes;
}
add_filter( 'body_class', 'pp_body_class' );
