<?php
/**
 * Theme settings page (replaces the old Supabase site_settings table).
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pp_default_options() {
	return array(
		'site_tagline'       => 'A curated library of AI photo editing prompts.',
		'hero_title'         => 'AI Photo Editing Prompts',
		'hero_gradient_text' => 'Gemini & ChatGPT',
		'hero_subtitle'      => 'Copy, paste, and generate stunning images in seconds.',
		'popular_tags'       => 'Men, Woman, Couple, Family, Birthday',
		'logo_url'           => '',
		'favicon_url'        => '',
		'adsense_client'     => '',
		'ad_slot_grid'       => '',
		'ad_slot_detail'     => '',
		'ad_slot_sidebar'    => '',
		'upi_id'             => '',
		'upi_qr_url'         => '',
		'premium_price'      => '499',
		'premium_currency'   => 'INR',
		'premium_note'       => '',
		'analytics_gtag'     => '',
		'social_twitter'     => '',
		'social_instagram'   => '',
		'social_github'      => '',
	);
}

function pp_option( $key, $fallback = '' ) {
	$opts = wp_parse_args( (array) get_option( 'pp_settings', array() ), pp_default_options() );
	$val  = isset( $opts[ $key ] ) ? $opts[ $key ] : $fallback;
	return '' === $val ? $fallback : $val;
}

function pp_settings_menu() {
	add_menu_page(
		__( 'PromptPalette', 'promptpalette' ),
		__( 'PromptPalette', 'promptpalette' ),
		'manage_options',
		'pp-settings',
		'pp_settings_page',
		'dashicons-admin-customizer',
		4
	);
	add_submenu_page( 'pp-settings', __( 'Settings', 'promptpalette' ), __( 'Settings', 'promptpalette' ), 'manage_options', 'pp-settings', 'pp_settings_page' );
}
add_action( 'admin_menu', 'pp_settings_menu' );

function pp_register_settings() {
	register_setting(
		'pp_settings_group',
		'pp_settings',
		array(
			'type'              => 'array',
			'sanitize_callback' => 'pp_sanitize_settings',
			'default'           => pp_default_options(),
		)
	);
}
add_action( 'admin_init', 'pp_register_settings' );

function pp_sanitize_settings( $input ) {
	$out = array();
	foreach ( pp_default_options() as $key => $default ) {
		$val = isset( $input[ $key ] ) ? $input[ $key ] : '';
		if ( in_array( $key, array( 'logo_url', 'favicon_url', 'upi_qr_url' ), true ) ) {
			$out[ $key ] = esc_url_raw( trim( $val ) );
		} else {
			$out[ $key ] = sanitize_textarea_field( $val );
		}
	}
	return $out;
}

function pp_settings_page() {
	wp_enqueue_media();
	$groups = array(
		__( 'Branding & hero', 'promptpalette' ) => array(
			'site_tagline'       => array( 'Site tagline', 'text' ),
			'hero_title'         => array( 'Hero title', 'text' ),
			'hero_gradient_text' => array( 'Hero gradient words', 'text' ),
			'hero_subtitle'      => array( 'Hero subtitle', 'textarea' ),
			'popular_tags'       => array( 'Popular tags (comma separated)', 'text' ),
			'logo_url'           => array( 'Logo URL', 'media' ),
			'favicon_url'        => array( 'Favicon URL', 'media' ),
		),
		__( 'Google AdSense', 'promptpalette' ) => array(
			'adsense_client'  => array( 'AdSense client (ca-pub-…)', 'text' ),
			'ad_slot_grid'    => array( 'Ad slot — inside card grid', 'text' ),
			'ad_slot_detail'  => array( 'Ad slot — prompt detail', 'text' ),
			'ad_slot_sidebar' => array( 'Ad slot — sidebar', 'text' ),
		),
		__( 'Premium & payments', 'promptpalette' ) => array(
			'premium_price'    => array( 'Premium price', 'text' ),
			'premium_currency' => array( 'Currency code', 'text' ),
			'upi_id'           => array( 'UPI ID', 'text' ),
			'upi_qr_url'       => array( 'UPI QR image URL', 'media' ),
			'premium_note'     => array( 'Checkout note', 'textarea' ),
		),
		__( 'Analytics & social', 'promptpalette' ) => array(
			'analytics_gtag'   => array( 'Google Analytics ID', 'text' ),
			'social_twitter'   => array( 'Twitter / X URL', 'text' ),
			'social_instagram' => array( 'Instagram URL', 'text' ),
			'social_github'    => array( 'GitHub URL', 'text' ),
		),
	);
	?>
	<div class="wrap">
		<h1><?php esc_html_e( 'PromptPalette settings', 'promptpalette' ); ?></h1>
		<p><?php esc_html_e( 'Everything on the front-end is managed from here plus Appearance → Menus (header & footer links) and the Prompts / Libraries menus.', 'promptpalette' ); ?></p>
		<form method="post" action="options.php">
			<?php settings_fields( 'pp_settings_group' ); ?>
			<?php foreach ( $groups as $title => $fields ) : ?>
				<h2><?php echo esc_html( $title ); ?></h2>
				<table class="form-table" role="presentation">
					<?php foreach ( $fields as $key => $conf ) : $val = pp_option( $key ); ?>
						<tr>
							<th scope="row"><label for="pp-<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $conf[0] ); ?></label></th>
							<td>
								<?php if ( 'textarea' === $conf[1] ) : ?>
									<textarea id="pp-<?php echo esc_attr( $key ); ?>" name="pp_settings[<?php echo esc_attr( $key ); ?>]" rows="3" class="large-text"><?php echo esc_textarea( $val ); ?></textarea>
								<?php else : ?>
									<input id="pp-<?php echo esc_attr( $key ); ?>" type="text" class="regular-text pp-field" name="pp_settings[<?php echo esc_attr( $key ); ?>]" value="<?php echo esc_attr( $val ); ?>" />
									<?php if ( 'media' === $conf[1] ) : ?>
										<button type="button" class="button pp-pick-media"><?php esc_html_e( 'Upload', 'promptpalette' ); ?></button>
									<?php endif; ?>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</table>
			<?php endforeach; ?>
			<?php submit_button(); ?>
		</form>
	</div>
	<script>
	document.addEventListener('click', function(e){
		if (!e.target.classList.contains('pp-pick-media')) return;
		var field = e.target.previousElementSibling;
		var frame = wp.media({ title: 'Select image', multiple: false });
		frame.on('select', function(){ field.value = frame.state().get('selection').first().toJSON().url; });
		frame.open();
	});
	</script>
	<?php
}
