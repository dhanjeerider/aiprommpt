<?php
/**
 * Custom post types and taxonomies.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pp_register_cpt() {
	register_post_type(
		'prompt',
		array(
			'labels' => array(
				'name'               => __( 'Prompts', 'promptpalette' ),
				'singular_name'      => __( 'Prompt', 'promptpalette' ),
				'add_new_item'       => __( 'Add New Prompt', 'promptpalette' ),
				'edit_item'          => __( 'Edit Prompt', 'promptpalette' ),
				'search_items'       => __( 'Search Prompts', 'promptpalette' ),
				'menu_name'          => __( 'Prompts', 'promptpalette' ),
			),
			'public'        => true,
			'has_archive'   => 'prompts',
			'menu_icon'     => 'dashicons-format-image',
			'menu_position' => 5,
			'rewrite'       => array( 'slug' => 'prompt', 'with_front' => false ),
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions', 'custom-fields' ),
			'show_in_rest'  => true,
		)
	);

	register_taxonomy(
		'prompt_library',
		'prompt',
		array(
			'labels'       => array(
				'name'          => __( 'Libraries', 'promptpalette' ),
				'singular_name' => __( 'Library', 'promptpalette' ),
			),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array( 'slug' => 'library', 'with_front' => false ),
			'show_in_rest' => true,
			'show_admin_column' => true,
		)
	);

	register_taxonomy(
		'prompt_tag',
		'prompt',
		array(
			'labels'       => array(
				'name'          => __( 'Prompt Tags', 'promptpalette' ),
				'singular_name' => __( 'Prompt Tag', 'promptpalette' ),
			),
			'public'       => true,
			'hierarchical' => false,
			'rewrite'      => array( 'slug' => 'tag-prompt', 'with_front' => false ),
			'show_in_rest' => true,
			'show_admin_column' => true,
		)
	);

	register_taxonomy(
		'prompt_tool',
		'prompt',
		array(
			'labels'       => array( 'name' => __( 'Tools', 'promptpalette' ), 'singular_name' => __( 'Tool', 'promptpalette' ) ),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array( 'slug' => 'tool', 'with_front' => false ),
			'show_in_rest' => true,
			'show_admin_column' => true,
		)
	);

	register_taxonomy(
		'prompt_style',
		'prompt',
		array(
			'labels'       => array( 'name' => __( 'Styles', 'promptpalette' ), 'singular_name' => __( 'Style', 'promptpalette' ) ),
			'public'       => true,
			'hierarchical' => true,
			'rewrite'      => array( 'slug' => 'style', 'with_front' => false ),
			'show_in_rest' => true,
			'show_admin_column' => true,
		)
	);

	register_post_type(
		'pp_order',
		array(
			'labels' => array(
				'name'          => __( 'Premium Orders', 'promptpalette' ),
				'singular_name' => __( 'Premium Order', 'promptpalette' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-money-alt',
			'menu_position'=> 6,
			'supports'     => array( 'title' ),
			'capabilities' => array( 'create_posts' => 'do_not_allow' ),
			'map_meta_cap' => true,
		)
	);
}
add_action( 'init', 'pp_register_cpt' );

/**
 * Flush rewrite rules once on activation.
 */
function pp_flush_rewrites() {
	pp_register_cpt();
	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'pp_flush_rewrites' );

/**
 * Admin columns for prompts: views/likes + quick view link.
 */
function pp_prompt_columns( $cols ) {
	$new = array();
	foreach ( $cols as $key => $label ) {
		$new[ $key ] = $label;
		if ( 'title' === $key ) {
			$new['pp_thumb']  = __( 'Image', 'promptpalette' );
			$new['pp_stats']  = __( 'Stats', 'promptpalette' );
		}
	}
	return $new;
}
add_filter( 'manage_prompt_posts_columns', 'pp_prompt_columns' );

function pp_prompt_column_content( $col, $post_id ) {
	if ( 'pp_thumb' === $col ) {
		$img = pp_prompt_images( $post_id );
		if ( ! empty( $img[0] ) ) {
			echo '<img src="' . esc_url( $img[0] ) . '" style="width:44px;height:66px;object-fit:cover;border-radius:8px" alt="" />';
		}
	}
	if ( 'pp_stats' === $col ) {
		printf(
			'♥ %d · ⧉ %d · ★ %s<br><a class="button button-small" target="_blank" href="%s">%s</a>',
			(int) get_post_meta( $post_id, 'pp_likes', true ),
			(int) get_post_meta( $post_id, 'pp_copies', true ),
			esc_html( number_format_i18n( (float) get_post_meta( $post_id, 'pp_rating', true ), 1 ) ),
			esc_url( get_permalink( $post_id ) ),
			esc_html__( 'View', 'promptpalette' )
		);
	}
}
add_action( 'manage_prompt_posts_custom_column', 'pp_prompt_column_content', 10, 2 );
