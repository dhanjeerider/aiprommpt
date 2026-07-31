<?php
/**
 * Nav walker that outputs bare <a> tags for the pill header.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class PP_Link_Walker extends Walker_Nav_Menu {

	public function start_lvl( &$output, $depth = 0, $args = null ) {}

	public function end_lvl( &$output, $depth = 0, $args = null ) {}

	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$classes = in_array( 'current-menu-item', (array) $item->classes, true ) ? ' class="active"' : '';
		$output .= sprintf(
			'<a href="%s"%s>%s</a>',
			esc_url( $item->url ),
			$classes,
			esc_html( $item->title )
		);
	}

	public function end_el( &$output, $item, $depth = 0, $args = null ) {}
}
