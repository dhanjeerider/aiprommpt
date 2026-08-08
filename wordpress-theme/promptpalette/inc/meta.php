<?php
/**
 * Prompt meta boxes: multi-prompt repeater with per-prompt demo image,
 * engagement stats, premium flag, author label.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register meta boxes.
 */
function pp_add_meta_boxes() {
	add_meta_box( 'pp_prompts', __( 'Prompts (copy-ready text + demo image)', 'promptpalette' ), 'pp_box_prompts', 'prompt', 'normal', 'high' );
	add_meta_box( 'pp_details', __( 'Prompt details', 'promptpalette' ), 'pp_box_details', 'prompt', 'side', 'default' );
	add_meta_box( 'pp_stats', __( 'Engagement', 'promptpalette' ), 'pp_box_stats', 'prompt', 'side', 'default' );
	add_meta_box( 'pp_order_box', __( 'Order details', 'promptpalette' ), 'pp_box_order', 'pp_order', 'normal', 'high' );
}
add_action( 'add_meta_boxes', 'pp_add_meta_boxes' );

/**
 * Prompt repeater box.
 *
 * @param WP_Post $post Post.
 */
function pp_box_prompts( $post ) {
	wp_nonce_field( 'pp_save_meta', 'pp_meta_nonce' );
	$main   = (string) get_post_meta( $post->ID, 'pp_prompt', true );
	$extra  = get_post_meta( $post->ID, 'pp_extra_prompts', true );
	$images = get_post_meta( $post->ID, 'pp_prompt_images', true );
	$extra  = is_array( $extra ) ? $extra : array();
	$images = is_array( $images ) ? $images : array();
	$rows   = array_merge( array( $main ), $extra );
	?>
	<p class="description"><?php esc_html_e( 'Prompt 1 uses the featured image. Prompt 2, 3, … each get their own demo image, and the front-end shows numbered badges so visitors know which image belongs to which prompt.', 'promptpalette' ); ?></p>
	<div id="pp-prompt-rows">
		<?php foreach ( $rows as $i => $text ) : ?>
			<div class="pp-prompt-row" style="border:1px solid #dcdcde;border-radius:10px;padding:12px;margin-bottom:12px;background:#fff">
				<strong><?php echo esc_html( sprintf( __( 'Prompt %d', 'promptpalette' ), $i + 1 ) ); ?></strong>
				<textarea name="pp_prompt_text[]" rows="6" style="width:100%;margin-top:6px" placeholder="<?php esc_attr_e( 'Full copy-ready prompt text…', 'promptpalette' ); ?>"><?php echo esc_textarea( (string) $text ); ?></textarea>
				<div style="margin-top:8px;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
					<input type="text" class="pp-media-input" name="pp_prompt_image[]" value="<?php echo esc_attr( isset( $images[ $i ] ) ? $images[ $i ] : '' ); ?>" placeholder="<?php echo 0 === $i ? esc_attr__( 'Prompt 1 uses the featured image (optional override)', 'promptpalette' ) : esc_attr__( 'Demo image URL for this prompt', 'promptpalette' ); ?>" style="flex:1;min-width:240px" />
					<button type="button" class="button pp-media-pick"><?php esc_html_e( 'Choose image', 'promptpalette' ); ?></button>
					<button type="button" class="button pp-media-clear"><?php esc_html_e( 'Remove', 'promptpalette' ); ?></button>
					<button type="button" class="button pp-remove-prompt"><?php esc_html_e( 'Delete prompt', 'promptpalette' ); ?></button>
					<img class="pp-media-preview" src="<?php echo esc_url( isset( $images[ $i ] ) ? $images[ $i ] : '' ); ?>" style="max-width:70px;border-radius:6px;<?php echo empty( $images[ $i ] ) ? 'display:none' : ''; ?>" alt="" />
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<button type="button" class="button button-secondary" id="pp-add-prompt">+ <?php esc_html_e( 'Add another prompt', 'promptpalette' ); ?></button>
	<?php
}

/**
 * Details box.
 *
 * @param WP_Post $post Post.
 */
function pp_box_details( $post ) {
	$premium = (int) get_post_meta( $post->ID, 'pp_premium', true );
	$author  = (string) get_post_meta( $post->ID, 'pp_author_name', true );
	?>
	<p>
		<label><input type="checkbox" name="pp_premium" value="1" <?php checked( 1, $premium ); ?> /> <?php esc_html_e( 'Premium prompt', 'promptpalette' ); ?></label>
	</p>
	<p>
		<label for="pp_author_name"><strong><?php esc_html_e( 'Shared by (display name)', 'promptpalette' ); ?></strong></label>
		<input type="text" id="pp_author_name" name="pp_author_name" value="<?php echo esc_attr( $author ); ?>" style="width:100%" placeholder="<?php echo esc_attr( pp_site_title() ); ?>" />
	</p>
	<p class="description"><?php esc_html_e( 'Categories, tags, tool and style are managed in the taxonomy boxes.', 'promptpalette' ); ?></p>
	<?php
}

/**
 * Stats box.
 *
 * @param WP_Post $post Post.
 */
function pp_box_stats( $post ) {
	$fields = array(
		'pp_likes'  => __( 'Likes', 'promptpalette' ),
		'pp_copies' => __( 'Copies', 'promptpalette' ),
		'pp_saves'  => __( 'Saves', 'promptpalette' ),
		'pp_rating' => __( 'Rating (0-5)', 'promptpalette' ),
	);
	foreach ( $fields as $k => $label ) {
		$v = get_post_meta( $post->ID, $k, true );
		echo '<p><label for="' . esc_attr( $k ) . '"><strong>' . esc_html( $label ) . '</strong></label>';
		echo '<input type="text" id="' . esc_attr( $k ) . '" name="' . esc_attr( $k ) . '" value="' . esc_attr( (string) $v ) . '" style="width:100%" /></p>';
	}
	echo '<p class="description">' . esc_html__( 'Visitor likes, copies and star ratings update these values automatically.', 'promptpalette' ) . '</p>';
}

/**
 * Order box.
 *
 * @param WP_Post $post Post.
 */
function pp_box_order( $post ) {
	wp_nonce_field( 'pp_save_meta', 'pp_meta_nonce' );
	$email  = (string) get_post_meta( $post->ID, 'pp_email', true );
	$utr    = (string) get_post_meta( $post->ID, 'pp_utr', true );
	$amount = (string) get_post_meta( $post->ID, 'pp_amount', true );
	$shot   = (string) get_post_meta( $post->ID, 'pp_screenshot', true );
	$status = (string) get_post_meta( $post->ID, 'pp_status', true );
	?>
	<p><strong><?php esc_html_e( 'Email', 'promptpalette' ); ?>:</strong> <input type="text" name="pp_email" value="<?php echo esc_attr( $email ); ?>" style="width:320px" /></p>
	<p><strong><?php esc_html_e( 'UTR', 'promptpalette' ); ?>:</strong> <input type="text" name="pp_utr" value="<?php echo esc_attr( $utr ); ?>" style="width:320px" /></p>
	<p><strong><?php esc_html_e( 'Amount', 'promptpalette' ); ?>:</strong> <input type="text" name="pp_amount" value="<?php echo esc_attr( $amount ); ?>" style="width:160px" /></p>
	<p><strong><?php esc_html_e( 'Status', 'promptpalette' ); ?>:</strong>
		<select name="pp_status">
			<?php foreach ( array( 'pending', 'approved', 'rejected' ) as $st ) : ?>
				<option value="<?php echo esc_attr( $st ); ?>" <?php selected( $status, $st ); ?>><?php echo esc_html( ucfirst( $st ) ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<?php if ( $shot ) : ?>
		<p><a href="<?php echo esc_url( $shot ); ?>" target="_blank" rel="noreferrer"><img src="<?php echo esc_url( $shot ); ?>" style="max-width:320px;border-radius:10px" alt="" /></a></p>
	<?php endif; ?>
	<?php
}

/**
 * Save all meta.
 *
 * @param int $post_id Post ID.
 */
function pp_save_meta( $post_id ) {
	if ( ! isset( $_POST['pp_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['pp_meta_nonce'] ) ), 'pp_save_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( isset( $_POST['pp_prompt_text'] ) && is_array( $_POST['pp_prompt_text'] ) ) {
		$texts  = array_map( 'sanitize_textarea_field', array_map( 'wp_unslash', $_POST['pp_prompt_text'] ) );
		$imgs   = isset( $_POST['pp_prompt_image'] ) ? array_map( 'esc_url_raw', array_map( 'wp_unslash', (array) $_POST['pp_prompt_image'] ) ) : array();
		$main   = isset( $texts[0] ) ? $texts[0] : '';
		$extra  = array_values( array_filter( array_slice( $texts, 1 ), 'strlen' ) );
		update_post_meta( $post_id, 'pp_prompt', $main );
		update_post_meta( $post_id, 'pp_extra_prompts', $extra );
		update_post_meta( $post_id, 'pp_prompt_images', array_values( $imgs ) );
	}

	if ( 'prompt' === get_post_type( $post_id ) ) {
		update_post_meta( $post_id, 'pp_premium', isset( $_POST['pp_premium'] ) ? 1 : 0 );
		if ( isset( $_POST['pp_author_name'] ) ) {
			update_post_meta( $post_id, 'pp_author_name', sanitize_text_field( wp_unslash( $_POST['pp_author_name'] ) ) );
		}
		foreach ( array( 'pp_likes', 'pp_copies', 'pp_saves' ) as $k ) {
			if ( isset( $_POST[ $k ] ) ) {
				update_post_meta( $post_id, $k, absint( wp_unslash( $_POST[ $k ] ) ) );
			}
		}
		if ( isset( $_POST['pp_rating'] ) ) {
			update_post_meta( $post_id, 'pp_rating', min( 5, max( 0, (float) wp_unslash( $_POST['pp_rating'] ) ) ) );
		}
	}

	if ( 'pp_order' === get_post_type( $post_id ) ) {
		foreach ( array( 'pp_email', 'pp_utr', 'pp_amount', 'pp_status' ) as $k ) {
			if ( isset( $_POST[ $k ] ) ) {
				update_post_meta( $post_id, $k, sanitize_text_field( wp_unslash( $_POST[ $k ] ) ) );
			}
		}
	}
}
add_action( 'save_post', 'pp_save_meta' );
