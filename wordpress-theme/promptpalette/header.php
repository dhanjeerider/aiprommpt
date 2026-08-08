<?php
/**
 * Header — port of src/components/site-header.tsx (pill glass header).
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

<div id="pp-progress" class="fixed inset-x-0 top-0 z-[200] hidden h-0.5 overflow-hidden bg-transparent">
	<div class="pp-bar h-full w-1/3 bg-[image:var(--gradient-primary)]"></div>
</div>

<a class="sr-only" href="#content"><?php esc_html_e( 'Skip to content', 'promptpalette' ); ?></a>

<div class="min-h-screen pb-8 pt-4">
	<header class="sticky top-3 z-50 mx-auto w-full max-w-6xl px-3 sm:top-4 sm:px-4">
		<div class="glass-strong flex items-center gap-1 rounded-full px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="flex shrink-0 items-center gap-2 pl-1">
				<?php $logo = pp_setting( 'logo_url' ); ?>
				<?php if ( $logo ) : ?>
					<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( pp_site_title() ); ?>" class="h-9 w-9 rounded-full object-cover shadow-md sm:h-10 sm:w-10" />
				<?php else : ?>
					<span class="grid h-9 w-9 place-items-center rounded-full bg-white shadow-md sm:h-10 sm:w-10" aria-label="<?php echo esc_attr( pp_site_title() ); ?>">
						<span class="gradient-text text-lg font-black"><?php echo esc_html( strtoupper( substr( pp_site_title(), 0, 1 ) ) ); ?></span>
					</span>
				<?php endif; ?>
				<span class="hidden text-base font-black tracking-tight sm:inline"><?php echo esc_html( pp_site_title() ); ?></span>
			</a>

			<nav class="ml-4 hidden min-w-0 items-center gap-5 lg:flex" aria-label="<?php esc_attr_e( 'Primary', 'promptpalette' ); ?>">
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
					$fallback = pp_links();
					if ( ! $fallback ) {
						$fallback = array(
							array( 'label' => __( 'AI Policy', 'promptpalette' ), 'href' => home_url( '/ai-policy/' ) ),
							array( 'label' => __( 'Terms & Conditions', 'promptpalette' ), 'href' => home_url( '/terms/' ) ),
							array( 'label' => __( 'Privacy Policy', 'promptpalette' ), 'href' => home_url( '/privacy/' ) ),
							array( 'label' => __( 'Contact Us', 'promptpalette' ), 'href' => home_url( '/contact/' ) ),
							array( 'label' => __( 'About Us', 'promptpalette' ), 'href' => home_url( '/about/' ) ),
						);
					}
					foreach ( array_slice( $fallback, 0, 6 ) as $l ) :
						?>
						<a href="<?php echo esc_url( $l['href'] ); ?>" class="whitespace-nowrap text-[13.5px] font-semibold text-muted-foreground transition hover:text-foreground"><?php echo esc_html( $l['label'] ); ?></a>
						<?php
					endforeach;
				}
				?>
			</nav>

			<div class="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
				<a href="<?php echo esc_url( home_url( '/premium/' ) ); ?>" aria-label="<?php esc_attr_e( 'Premium', 'promptpalette' ); ?>" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 lg:hidden">
					<?php echo pp_icon( 'crown', 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
				<a href="<?php echo esc_url( home_url( '/libraries/' ) ); ?>" aria-label="<?php esc_attr_e( 'Categories', 'promptpalette' ); ?>" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10 lg:hidden">
					<?php echo pp_icon( 'smile', 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</a>
				<button type="button" id="pp-search-toggle" aria-label="<?php esc_attr_e( 'Search', 'promptpalette' ); ?>" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
					<?php echo pp_icon( 'search', 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</button>
				<button type="button" id="pp-theme-toggle" aria-label="<?php esc_attr_e( 'Toggle theme', 'promptpalette' ); ?>" class="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground transition hover:bg-white/10">
					<span data-theme-icon="dark"><?php echo pp_icon( 'moon', 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
					<span data-theme-icon="light" class="hidden"><?php echo pp_icon( 'sun', 'h-[18px] w-[18px]' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></span>
				</button>
			</div>
		</div>

		<form id="pp-search-form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" class="glass-strong mt-2 hidden items-center gap-2 rounded-full px-4 py-2">
			<?php echo pp_icon( 'search', 'h-4 w-4 text-muted-foreground' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<input type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search prompts…', 'promptpalette' ); ?>" class="flex-1 bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground" />
			<button type="submit" class="btn-gradient rounded-full px-4 py-1.5 text-xs"><?php esc_html_e( 'Go', 'promptpalette' ); ?></button>
		</form>
	</header>

	<main id="content" class="pp-page-enter mx-auto w-full max-w-6xl px-4 pt-10">
