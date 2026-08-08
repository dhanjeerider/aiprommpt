<?php
/**
 * Menu walker that renders plain <a> links with the theme's nav classes.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Flat link walker.
 */
class PP_Link_Walker extends Walker_Nav_Menu {

	/**
	 * Link classes.
	 *
	 * @var string
	 */
	public $link_class = 'whitespace-nowrap text-[13.5px] font-semibold text-muted-foreground transition hover:text-foreground';

	/**
	 * Constructor.
	 *
	 * @param string $link_class Classes for each link.
	 */
	public function __construct( $link_class = '' ) {
		if ( $link_class ) {
			$this->link_class = $link_class;
		}
	}

	/**
	 * No wrappers.
	 *
	 * @param string $output Output.
	 * @param int    $depth  Depth.
	 * @param array  $args   Args.
	 */
	public function start_lvl( &$output, $depth = 0, $args = null ) {}

	/**
	 * No wrappers.
	 *
	 * @param string $output Output.
	 * @param int    $depth  Depth.
	 * @param array  $args   Args.
	 */
	public function end_lvl( &$output, $depth = 0, $args = null ) {}

	/**
	 * Render one link.
	 *
	 * @param string   $output Output.
	 * @param WP_Post  $item   Menu item.
	 * @param int      $depth  Depth.
	 * @param stdClass $args   Args.
	 * @param int      $id     ID.
	 */
	public function start_el( &$output, $item, $depth = 0, $args = null, $id = 0 ) {
		$output .= sprintf(
			'<a href="%1$s" class="%2$s"%3$s>%4$s</a>',
			esc_url( $item->url ),
			esc_attr( $this->link_class ),
			$item->target ? ' target="' . esc_attr( $item->target ) . '" rel="noreferrer noopener"' : '',
			esc_html( $item->title )
		);
	}

	/**
	 * No closing tag needed.
	 *
	 * @param string  $output Output.
	 * @param WP_Post $item   Item.
	 * @param int     $depth  Depth.
	 * @param array   $args   Args.
	 */
	public function end_el( &$output, $item, $depth = 0, $args = null ) {}
}
