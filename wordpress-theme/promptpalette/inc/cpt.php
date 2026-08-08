<?php
/**
 * Custom post types & taxonomies.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register prompt CPT, order CPT and the four taxonomies.
 */
function pp_register_types() {
	register_post_type(
		'prompt',
		array(
			'labels'        => array(
				'name'               => __( 'Prompts', 'promptpalette' ),
				'singular_name'      => __( 'Prompt', 'promptpalette' ),
				'add_new_item'       => __( 'Add new prompt', 'promptpalette' ),
				'edit_item'          => __( 'Edit prompt', 'promptpalette' ),
				'search_items'       => __( 'Search prompts', 'promptpalette' ),
				'not_found'          => __( 'No prompts yet', 'promptpalette' ),
				'menu_name'          => __( 'Prompts', 'promptpalette' ),
			),
			'public'        => true,
			'has_archive'   => true,
			'menu_icon'     => 'dashicons-format-image',
			'menu_position' => 4,
			'rewrite'       => array( 'slug' => 'prompt', 'with_front' => false ),
			'supports'      => array( 'title', 'editor', 'excerpt', 'thumbnail', 'author', 'revisions', 'custom-fields' ),
			'show_in_rest'  => true,
		)
	);

	register_post_type(
		'pp_order',
		array(
			'labels'          => array(
				'name'          => __( 'Premium Orders', 'promptpalette' ),
				'singular_name' => __( 'Premium Order', 'promptpalette' ),
				'menu_name'     => __( 'Premium Orders', 'promptpalette' ),
			),
			'public'          => false,
			'show_ui'         => true,
			'menu_icon'       => 'dashicons-money-alt',
			'supports'        => array( 'title' ),
			'capability_type' => 'post',
			'map_meta_cap'    => true,
			'capabilities'    => array( 'create_posts' => 'do_not_allow' ),
		)
	);

	$taxes = array(
		'prompt_library' => array( __( 'Libraries', 'promptpalette' ), 'category', true ),
		'prompt_tag'     => array( __( 'Prompt Tags', 'promptpalette' ), 'tag', false ),
		'prompt_tool'    => array( __( 'Tools', 'promptpalette' ), 'tool', false ),
		'prompt_style'   => array( __( 'Styles', 'promptpalette' ), 'style', false ),
	);
	foreach ( $taxes as $tax => $cfg ) {
		register_taxonomy(
			$tax,
			array( 'prompt' ),
			array(
				'labels'            => array(
					'name'          => $cfg[0],
					'singular_name' => $cfg[0],
					'menu_name'     => $cfg[0],
				),
				'public'            => true,
				'hierarchical'      => $cfg[2],
				'show_admin_column' => true,
				'show_in_rest'      => true,
				'rewrite'           => array( 'slug' => $cfg[1], 'with_front' => false ),
			)
		);
	}
}
add_action( 'init', 'pp_register_types' );

/**
 * View column in the prompt list table.
 *
 * @param array $cols Columns.
 * @return array
 */
function pp_prompt_columns( $cols ) {
	$new = array();
	foreach ( $cols as $k => $v ) {
		$new[ $k ] = $v;
		if ( 'title' === $k ) {
			$new['pp_thumb']  = __( 'Image', 'promptpalette' );
			$new['pp_stats']  = __( 'Stats', 'promptpalette' );
		}
	}
	$new['pp_view'] = __( 'View', 'promptpalette' );
	return $new;
}
add_filter( 'manage_prompt_posts_columns', 'pp_prompt_columns' );

/**
 * Column output.
 *
 * @param string $col Column key.
 * @param int    $id  Post ID.
 */
function pp_prompt_column_content( $col, $id ) {
	if ( 'pp_thumb' === $col ) {
		$src = pp_featured_image( $id, 'thumbnail' );
		if ( $src ) {
			echo '<img src="' . esc_url( $src ) . '" style="width:48px;height:64px;object-fit:cover;border-radius:6px" alt="" />';
		}
	}
	if ( 'pp_stats' === $col ) {
		printf(
			'♥ %1$s · ⧉ %2$s · ★ %3$s',
			esc_html( (int) get_post_meta( $id, 'pp_likes', true ) ),
			esc_html( (int) get_post_meta( $id, 'pp_copies', true ) ),
			esc_html( pp_rating( $id ) )
		);
	}
	if ( 'pp_view' === $col ) {
		echo '<a class="button button-small" target="_blank" rel="noreferrer" href="' . esc_url( get_permalink( $id ) ) . '">' . esc_html__( 'View', 'promptpalette' ) . '</a>';
	}
}
add_action( 'manage_prompt_posts_custom_column', 'pp_prompt_column_content', 10, 2 );

/**
 * Order list columns.
 *
 * @param array $cols Columns.
 * @return array
 */
function pp_order_columns( $cols ) {
	return array(
		'cb'         => isset( $cols['cb'] ) ? $cols['cb'] : '',
		'title'      => __( 'Order', 'promptpalette' ),
		'pp_email'   => __( 'Email', 'promptpalette' ),
		'pp_utr'     => __( 'UTR', 'promptpalette' ),
		'pp_amount'  => __( 'Amount', 'promptpalette' ),
		'pp_status'  => __( 'Status', 'promptpalette' ),
		'pp_shot'    => __( 'Screenshot', 'promptpalette' ),
		'date'       => __( 'Date', 'promptpalette' ),
	);
}
add_filter( 'manage_pp_order_posts_columns', 'pp_order_columns' );

/**
 * Order column output.
 *
 * @param string $col Column.
 * @param int    $id  Post ID.
 */
function pp_order_column_content( $col, $id ) {
	$map = array(
		'pp_email'  => 'pp_email',
		'pp_utr'    => 'pp_utr',
		'pp_amount' => 'pp_amount',
		'pp_status' => 'pp_status',
	);
	if ( isset( $map[ $col ] ) ) {
		echo esc_html( (string) get_post_meta( $id, $map[ $col ], true ) );
	}
	if ( 'pp_shot' === $col ) {
		$u = get_post_meta( $id, 'pp_screenshot', true );
		if ( $u ) {
			echo '<a target="_blank" rel="noreferrer" href="' . esc_url( $u ) . '"><img src="' . esc_url( $u ) . '" style="width:60px;border-radius:6px" alt="" /></a>';
		}
	}
}
add_action( 'manage_pp_order_posts_custom_column', 'pp_order_column_content', 10, 2 );
