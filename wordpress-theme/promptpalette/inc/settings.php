<?php
/**
 * Theme settings store + PromptPalette admin panel (settings screen).
 *
 * Mirrors the React admin "Site settings" screen 1:1.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Setting defaults — identical to the React SettingsProvider defaults.
 *
 * @return array
 */
function pp_setting_defaults() {
	return array(
		'site_title'          => get_bloginfo( 'name' ) ? get_bloginfo( 'name' ) : 'PromptPalette',
		'site_tagline'        => 'A curated library of AI photo editing prompts.',
		'hero_title'          => 'AI Photo Editing Prompts',
		'hero_gradient_text'  => 'Gemini & ChatGPT',
		'hero_subtitle'       => 'Copy, paste, and generate stunning Images in seconds.',
		'logo_url'            => '',
		'favicon_url'         => '',
		'adsense_client'      => '',
		'ad_slot_grid'        => '',
		'ad_slot_detail'      => '',
		'ad_slot_sidebar'     => '',
		'popular_tags'        => array( 'Men', 'Woman', 'Couple', 'Family', 'Birthday' ),
		'upi_id'              => '',
		'upi_qr_url'          => '',
		'premium_price'        => '499',
		'premium_currency'     => 'INR',
		'premium_note'         => '',
		'analytics_gtag'       => '',
		'footer_links'         => array(),
		'social_twitter'       => '',
		'social_instagram'     => '',
		'social_github'        => '',
		'admin_notify_email'   => get_option( 'admin_email' ),
		'ad_every_n_cards'     => 6,
	);
}

/**
 * All settings.
 *
 * @return array
 */
function pp_settings() {
	$saved = get_option( 'pp_settings', array() );
	if ( ! is_array( $saved ) ) {
		$saved = array();
	}
	return array_merge( pp_setting_defaults(), $saved );
}

/**
 * One setting.
 *
 * @param string $key      Key.
 * @param mixed  $fallback Fallback.
 * @return mixed
 */
function pp_setting( $key, $fallback = '' ) {
	$all = pp_settings();
	if ( ! isset( $all[ $key ] ) || '' === $all[ $key ] || null === $all[ $key ] ) {
		return '' !== $fallback ? $fallback : ( isset( $all[ $key ] ) ? $all[ $key ] : '' );
	}
	return $all[ $key ];
}

/**
 * Site title used across the theme.
 *
 * @return string
 */
function pp_site_title() {
	$t = pp_setting( 'site_title' );
	return $t ? $t : get_bloginfo( 'name' );
}

/**
 * Navigation / footer links (manual, same shape as React footer_links).
 *
 * @return array
 */
function pp_links() {
	$links = pp_setting( 'footer_links' );
	if ( ! is_array( $links ) ) {
		return array();
	}
	$out = array();
	foreach ( $links as $l ) {
		if ( empty( $l['label'] ) || empty( $l['href'] ) ) {
			continue;
		}
		$out[] = array(
			'label' => (string) $l['label'],
			'href'  => (string) $l['href'],
			'group' => isset( $l['group'] ) ? (string) $l['group'] : 'Explore',
		);
	}
	return $out;
}

/**
 * Register the PromptPalette admin panel.
 */
function pp_admin_menu() {
	add_menu_page(
		__( 'PromptPalette', 'promptpalette' ),
		__( 'PromptPalette', 'promptpalette' ),
		'manage_options',
		'pp-panel',
		'pp_render_dashboard',
		'dashicons-art',
		3
	);
	add_submenu_page( 'pp-panel', __( 'Dashboard', 'promptpalette' ), __( 'Dashboard', 'promptpalette' ), 'manage_options', 'pp-panel', 'pp_render_dashboard' );
	add_submenu_page( 'pp-panel', __( 'Theme Settings', 'promptpalette' ), __( 'Theme Settings', 'promptpalette' ), 'manage_options', 'pp-settings', 'pp_render_settings' );
	add_submenu_page( 'pp-panel', __( 'Sitemap Importer', 'promptpalette' ), __( 'Sitemap Importer', 'promptpalette' ), 'manage_options', 'pp-importer', 'pp_render_importer' );
}
add_action( 'admin_menu', 'pp_admin_menu' );

/**
 * Admin assets (media uploader + panel script).
 *
 * @param string $hook Current screen hook.
 */
function pp_admin_assets( $hook ) {
	wp_enqueue_media();
	wp_enqueue_script( 'pp-admin', PP_URI . '/assets/js/admin.js', array( 'jquery' ), PP_VERSION, true );
	wp_localize_script(
		'pp-admin',
		'PPAdmin',
		array(
			'ajax'  => admin_url( 'admin-ajax.php' ),
			'nonce' => wp_create_nonce( 'pp_admin' ),
		)
	);
	wp_add_inline_style( 'wp-admin', '.pp-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}.pp-box{background:#fff;border:1px solid #dcdcde;border-radius:10px;padding:16px}.pp-box h2{margin-top:0}.pp-field label{display:block;font-weight:600;margin-bottom:4px}.pp-field input[type=text],.pp-field textarea{width:100%}.pp-stat{font-size:26px;font-weight:700}.pp-log{max-height:420px;overflow:auto;background:#0f172a;color:#d9e2ff;padding:12px;border-radius:10px;font-family:monospace;font-size:12px;line-height:1.6}.pp-row{display:grid;grid-template-columns:1fr 1fr 160px 60px;gap:8px;margin-bottom:8px}' );
	unset( $hook );
}
add_action( 'admin_enqueue_scripts', 'pp_admin_assets' );

/**
 * Dashboard screen.
 */
function pp_render_dashboard() {
	$prompts = wp_count_posts( 'prompt' );
	$orders  = wp_count_posts( 'pp_order' );
	$pages   = wp_count_posts( 'page' );
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'PromptPalette', 'promptpalette' ); ?></h1>
		<p><?php esc_html_e( 'Manage every part of the front-end from here: prompts, categories, pages, menus, ads, premium checkout and the sitemap importer.', 'promptpalette' ); ?></p>
		<div class="pp-grid">
			<div class="pp-box">
				<h2><?php esc_html_e( 'Published prompts', 'promptpalette' ); ?></h2>
				<div class="pp-stat"><?php echo esc_html( isset( $prompts->publish ) ? $prompts->publish : 0 ); ?></div>
				<p><a class="button button-primary" href="<?php echo esc_url( admin_url( 'post-new.php?post_type=prompt' ) ); ?>"><?php esc_html_e( 'Add new prompt', 'promptpalette' ); ?></a>
				<a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=prompt' ) ); ?>"><?php esc_html_e( 'All prompts', 'promptpalette' ); ?></a></p>
			</div>
			<div class="pp-box">
				<h2><?php esc_html_e( 'Premium orders', 'promptpalette' ); ?></h2>
				<div class="pp-stat"><?php echo esc_html( isset( $orders->publish ) ? $orders->publish : 0 ); ?></div>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=pp_order' ) ); ?>"><?php esc_html_e( 'Review orders', 'promptpalette' ); ?></a></p>
			</div>
			<div class="pp-box">
				<h2><?php esc_html_e( 'Pages', 'promptpalette' ); ?></h2>
				<div class="pp-stat"><?php echo esc_html( isset( $pages->publish ) ? $pages->publish : 0 ); ?></div>
				<p><a class="button" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'Manage pages', 'promptpalette' ); ?></a>
				<a class="button" href="<?php echo esc_url( admin_url( 'nav-menus.php' ) ); ?>"><?php esc_html_e( 'Menus', 'promptpalette' ); ?></a></p>
			</div>
			<div class="pp-box">
				<h2><?php esc_html_e( 'Taxonomies', 'promptpalette' ); ?></h2>
				<p>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=prompt_library&post_type=prompt' ) ); ?>"><?php esc_html_e( 'Categories', 'promptpalette' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=prompt_tag&post_type=prompt' ) ); ?>"><?php esc_html_e( 'Tags', 'promptpalette' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=prompt_tool&post_type=prompt' ) ); ?>"><?php esc_html_e( 'Tools', 'promptpalette' ); ?></a>
					<a class="button" href="<?php echo esc_url( admin_url( 'edit-tags.php?taxonomy=prompt_style&post_type=prompt' ) ); ?>"><?php esc_html_e( 'Styles', 'promptpalette' ); ?></a>
				</p>
			</div>
			<div class="pp-box">
				<h2><?php esc_html_e( 'Quick setup', 'promptpalette' ); ?></h2>
				<ol>
					<li><?php esc_html_e( 'Create pages with the Libraries, Premium and Checkout templates.', 'promptpalette' ); ?></li>
					<li><?php esc_html_e( 'Fill in Theme Settings (logo, hero, ads, UPI).', 'promptpalette' ); ?></li>
					<li><?php esc_html_e( 'Import prompts with the Sitemap Importer or add them manually.', 'promptpalette' ); ?></li>
				</ol>
				<p><a class="button button-primary" href="<?php echo esc_url( admin_url( 'admin.php?page=pp-settings' ) ); ?>"><?php esc_html_e( 'Open Theme Settings', 'promptpalette' ); ?></a></p>
			</div>
		</div>
	</div>
	<?php
}

/**
 * Settings screen.
 */
function pp_render_settings() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Not allowed', 'promptpalette' ) );
	}

	if ( isset( $_POST['pp_settings_submit'] ) && check_admin_referer( 'pp_save_settings' ) ) {
		$in  = wp_unslash( $_POST );
		$new = pp_settings();

		$text_keys = array(
			'site_title', 'site_tagline', 'hero_title', 'hero_gradient_text', 'hero_subtitle',
			'adsense_client', 'ad_slot_grid', 'ad_slot_detail', 'ad_slot_sidebar',
			'upi_id', 'premium_price', 'premium_currency', 'premium_note', 'analytics_gtag',
			'social_twitter', 'social_instagram', 'social_github', 'admin_notify_email',
		);
		foreach ( $text_keys as $k ) {
			$new[ $k ] = isset( $in[ $k ] ) ? sanitize_text_field( $in[ $k ] ) : '';
		}
		foreach ( array( 'logo_url', 'favicon_url', 'upi_qr_url' ) as $k ) {
			$new[ $k ] = isset( $in[ $k ] ) ? esc_url_raw( $in[ $k ] ) : '';
		}
		$new['ad_every_n_cards'] = isset( $in['ad_every_n_cards'] ) ? max( 2, absint( $in['ad_every_n_cards'] ) ) : 6;

		$tags = isset( $in['popular_tags'] ) ? explode( ',', $in['popular_tags'] ) : array();
		$new['popular_tags'] = array_values( array_filter( array_map( 'sanitize_text_field', array_map( 'trim', $tags ) ) ) );

		$links = array();
		if ( isset( $in['link_label'] ) && is_array( $in['link_label'] ) ) {
			foreach ( $in['link_label'] as $i => $label ) {
				$label = sanitize_text_field( $label );
				$href  = isset( $in['link_href'][ $i ] ) ? esc_url_raw( $in['link_href'][ $i ] ) : '';
				$group = isset( $in['link_group'][ $i ] ) ? sanitize_text_field( $in['link_group'][ $i ] ) : 'Explore';
				if ( $label && $href ) {
					$links[] = array( 'label' => $label, 'href' => $href, 'group' => $group ? $group : 'Explore' );
				}
			}
		}
		$new['footer_links'] = $links;

		update_option( 'pp_settings', $new );
		echo '<div class="notice notice-success is-dismissible"><p>' . esc_html__( 'Settings saved.', 'promptpalette' ) . '</p></div>';
	}

	$s     = pp_settings();
	$links = is_array( $s['footer_links'] ) ? $s['footer_links'] : array();
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'Theme Settings', 'promptpalette' ); ?></h1>
		<form method="post">
			<?php wp_nonce_field( 'pp_save_settings' ); ?>
			<div class="pp-grid">
				<div class="pp-box">
					<h2><?php esc_html_e( 'Branding', 'promptpalette' ); ?></h2>
					<?php
					pp_admin_text( 'site_title', __( 'Site title', 'promptpalette' ), $s );
					pp_admin_text( 'site_tagline', __( 'Tagline', 'promptpalette' ), $s, true );
					pp_admin_media( 'logo_url', __( 'Logo', 'promptpalette' ), $s );
					pp_admin_media( 'favicon_url', __( 'Favicon', 'promptpalette' ), $s );
					?>
				</div>

				<div class="pp-box">
					<h2><?php esc_html_e( 'Hero', 'promptpalette' ); ?></h2>
					<?php
					pp_admin_text( 'hero_title', __( 'Hero title', 'promptpalette' ), $s );
					pp_admin_text( 'hero_gradient_text', __( 'Hero gradient text', 'promptpalette' ), $s );
					pp_admin_text( 'hero_subtitle', __( 'Hero subtitle', 'promptpalette' ), $s, true );
					pp_admin_text( 'popular_tags', __( 'Popular tags (comma separated)', 'promptpalette' ), array( 'popular_tags' => implode( ', ', (array) $s['popular_tags'] ) ) );
					?>
				</div>

				<div class="pp-box">
					<h2><?php esc_html_e( 'AdSense', 'promptpalette' ); ?></h2>
					<?php
					pp_admin_text( 'adsense_client', __( 'AdSense client ID (ca-pub-…)', 'promptpalette' ), $s );
					pp_admin_text( 'ad_slot_grid', __( 'Ad slot: grid', 'promptpalette' ), $s );
					pp_admin_text( 'ad_slot_detail', __( 'Ad slot: detail', 'promptpalette' ), $s );
					pp_admin_text( 'ad_slot_sidebar', __( 'Ad slot: sidebar', 'promptpalette' ), $s );
					pp_admin_text( 'ad_every_n_cards', __( 'Insert grid ad after every N cards', 'promptpalette' ), $s );
					?>
				</div>

				<div class="pp-box">
					<h2><?php esc_html_e( 'Premium & UPI checkout', 'promptpalette' ); ?></h2>
					<?php
					pp_admin_text( 'premium_price', __( 'Premium price', 'promptpalette' ), $s );
					pp_admin_text( 'premium_currency', __( 'Currency (INR / USD)', 'promptpalette' ), $s );
					pp_admin_text( 'upi_id', __( 'UPI ID', 'promptpalette' ), $s );
					pp_admin_media( 'upi_qr_url', __( 'UPI QR image', 'promptpalette' ), $s );
					pp_admin_text( 'premium_note', __( 'Premium checkout note', 'promptpalette' ), $s, true );
					pp_admin_text( 'admin_notify_email', __( 'Order notification email', 'promptpalette' ), $s );
					?>
				</div>

				<div class="pp-box">
					<h2><?php esc_html_e( 'Analytics & social', 'promptpalette' ); ?></h2>
					<?php
					pp_admin_text( 'analytics_gtag', __( 'Google Analytics tag (G-…)', 'promptpalette' ), $s );
					pp_admin_text( 'social_twitter', __( 'X / Twitter URL', 'promptpalette' ), $s );
					pp_admin_text( 'social_instagram', __( 'Instagram URL', 'promptpalette' ), $s );
					pp_admin_text( 'social_github', __( 'GitHub URL', 'promptpalette' ), $s );
					?>
				</div>

				<div class="pp-box" style="grid-column:1/-1">
					<h2><?php esc_html_e( 'Header & footer menu (manual)', 'promptpalette' ); ?></h2>
					<p class="description"><?php esc_html_e( 'These links power the desktop header nav (first 6) and the footer columns. Column name groups them in the footer.', 'promptpalette' ); ?></p>
					<div id="pp-links">
						<?php foreach ( $links as $l ) : ?>
							<div class="pp-row">
								<input type="text" name="link_label[]" value="<?php echo esc_attr( $l['label'] ); ?>" placeholder="<?php esc_attr_e( 'Label', 'promptpalette' ); ?>" />
								<input type="text" name="link_href[]" value="<?php echo esc_attr( $l['href'] ); ?>" placeholder="/about" />
								<input type="text" name="link_group[]" value="<?php echo esc_attr( isset( $l['group'] ) ? $l['group'] : '' ); ?>" placeholder="<?php esc_attr_e( 'Column', 'promptpalette' ); ?>" />
								<button type="button" class="button pp-remove-row">&times;</button>
							</div>
						<?php endforeach; ?>
					</div>
					<button type="button" class="button" id="pp-add-link">+ <?php esc_html_e( 'Add link', 'promptpalette' ); ?></button>
				</div>
			</div>
			<p><button class="button button-primary button-hero" name="pp_settings_submit" value="1"><?php esc_html_e( 'Save settings', 'promptpalette' ); ?></button></p>
		</form>
	</div>
	<?php
}

/**
 * Admin text field helper.
 *
 * @param string $key      Key.
 * @param string $label    Label.
 * @param array  $s        Values.
 * @param bool   $textarea Render textarea.
 */
function pp_admin_text( $key, $label, $s, $textarea = false ) {
	$val = isset( $s[ $key ] ) ? $s[ $key ] : '';
	echo '<div class="pp-field" style="margin-bottom:12px"><label for="pp-' . esc_attr( $key ) . '">' . esc_html( $label ) . '</label>';
	if ( $textarea ) {
		echo '<textarea rows="2" id="pp-' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '">' . esc_textarea( $val ) . '</textarea>';
	} else {
		echo '<input type="text" id="pp-' . esc_attr( $key ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $val ) . '" />';
	}
	echo '</div>';
}

/**
 * Admin media field helper (WP media library picker).
 *
 * @param string $key   Key.
 * @param string $label Label.
 * @param array  $s     Values.
 */
function pp_admin_media( $key, $label, $s ) {
	$val = isset( $s[ $key ] ) ? $s[ $key ] : '';
	?>
	<div class="pp-field" style="margin-bottom:12px">
		<label><?php echo esc_html( $label ); ?></label>
		<input type="text" class="pp-media-input" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $val ); ?>" />
		<p style="margin:6px 0">
			<button type="button" class="button pp-media-pick"><?php esc_html_e( 'Choose / upload', 'promptpalette' ); ?></button>
			<button type="button" class="button pp-media-clear"><?php esc_html_e( 'Remove', 'promptpalette' ); ?></button>
		</p>
		<img class="pp-media-preview" src="<?php echo esc_url( $val ); ?>" style="max-width:120px;<?php echo $val ? '' : 'display:none'; ?>" alt="" />
	</div>
	<?php
}
