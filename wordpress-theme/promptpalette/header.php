<?php
/**
 * Header.
 *
 * @package PromptPalette
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="profile" href="https://gmpg.org/xfn/11" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="route-progress"></div>
<a class="screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'promptpalette' ); ?></a>

<header class="site-header">
	<div class="header-inner glass-strong">
		<a class="brand" href="<?php echo esc_url( home_url( '/' ) ); ?>">
			<span class="brand-badge">
				<?php $logo = pp_option( 'logo_url' ); ?>
				<?php if ( $logo ) : ?>
					<img src="<?php echo esc_url( $logo ); ?>" alt="<?php bloginfo( 'name' ); ?>" />
				<?php else : ?>
					<?php echo pp_icon( 'sparkles' ); // phpcs:ignore ?>
				<?php endif; ?>
			</span>
			<span><?php bloginfo( 'name' ); ?></span>
		</a>

		<nav class="nav-links" aria-label="<?php esc_attr_e( 'Primary', 'promptpalette' ); ?>">
			<?php
			if ( has_nav_menu( 'primary' ) ) {
				wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'items_wrap'     => '%3$s',
						'depth'          => 1,
						'walker'         => new PP_Link_Walker(),
					)
				);
			} else {
				?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
				<a href="<?php echo esc_url( get_post_type_archive_link( 'prompt' ) ); ?>"><?php esc_html_e( 'Prompts', 'promptpalette' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/libraries/' ) ); ?>"><?php esc_html_e( 'Libraries', 'promptpalette' ); ?></a>
				<a href="<?php echo esc_url( home_url( '/premium/' ) ); ?>"><?php esc_html_e( 'Premium', 'promptpalette' ); ?></a>
				<?php
			}
			?>
		</nav>

		<div class="header-actions">
			<button class="icon-btn" id="pp-search-toggle" aria-label="<?php esc_attr_e( 'Search', 'promptpalette' ); ?>"><?php echo pp_icon( 'search' ); // phpcs:ignore ?></button>
			<a class="icon-btn" href="<?php echo esc_url( home_url( '/premium/' ) ); ?>" aria-label="<?php esc_attr_e( 'Premium', 'promptpalette' ); ?>"><?php echo pp_icon( 'crown' ); // phpcs:ignore ?></a>
			<a class="icon-btn" href="<?php echo esc_url( is_user_logged_in() ? admin_url() : wp_login_url() ); ?>" aria-label="<?php esc_attr_e( 'Account', 'promptpalette' ); ?>"><?php echo pp_icon( 'user' ); // phpcs:ignore ?></a>
			<button class="icon-btn menu-toggle" id="pp-menu-toggle" aria-label="<?php esc_attr_e( 'Menu', 'promptpalette' ); ?>"><?php echo pp_icon( 'menu' ); // phpcs:ignore ?></button>
		</div>
	</div>

	<div class="search-panel glass-strong" id="pp-search-panel">
		<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
			<input type="search" name="s" placeholder="<?php esc_attr_e( 'Search prompts…', 'promptpalette' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" />
			<button class="btn btn-gradient" type="submit"><?php esc_html_e( 'Search', 'promptpalette' ); ?></button>
		</form>
	</div>

	<div class="mobile-menu glass-strong" id="pp-mobile-menu">
		<?php
		if ( has_nav_menu( 'primary' ) ) {
			wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false, 'items_wrap' => '%3$s', 'depth' => 1, 'walker' => new PP_Link_Walker() ) );
		} else {
			?>
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Home', 'promptpalette' ); ?></a>
			<a href="<?php echo esc_url( get_post_type_archive_link( 'prompt' ) ); ?>"><?php esc_html_e( 'Prompts', 'promptpalette' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/libraries/' ) ); ?>"><?php esc_html_e( 'Libraries', 'promptpalette' ); ?></a>
			<a href="<?php echo esc_url( home_url( '/premium/' ) ); ?>"><?php esc_html_e( 'Premium', 'promptpalette' ); ?></a>
			<?php
		}
		?>
	</div>
</header>

<main class="site-main" id="content">
