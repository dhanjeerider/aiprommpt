<?php
/**
 * Prompt meta boxes: multiple prompts each with its own demo image.
 *
 * @package PromptPalette
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pp_add_meta_boxes() {
	add_meta_box( 'pp_prompts', __( 'Prompts & demo images', 'promptpalette' ), 'pp_prompts_box', 'prompt', 'normal', 'high' );
	add_meta_box( 'pp_details', __( 'Prompt details', 'promptpalette' ), 'pp_details_box', 'prompt', 'side', 'default' );
}
add_action( 'add_meta_boxes', 'pp_add_meta_boxes' );

function pp_prompts_box( $post ) {
	wp_nonce_field( 'pp_save_meta', 'pp_meta_nonce' );
	$rows = get_post_meta( $post->ID, 'pp_prompt_rows', true );
	if ( ! is_array( $rows ) || empty( $rows ) ) {
		$rows = array( array( 'text' => '', 'image' => '' ) );
	}
	wp_enqueue_media();
	?>
	<p class="description"><?php esc_html_e( 'The first prompt uses the featured image. Add more prompts and attach a demo image to each one — the front-end shows numbered badges so visitors know which image belongs to which prompt.', 'promptpalette' ); ?></p>
	<div id="pp-rows">
		<?php foreach ( $rows as $i => $row ) : ?>
			<div class="pp-row" style="border:1px solid #ccd0d4;border-radius:8px;padding:12px;margin-bottom:12px;background:#fff">
				<strong>#<span class="pp-num"><?php echo (int) $i + 1; ?></span></strong>
				<textarea name="pp_prompt_text[]" rows="6" style="width:100%;margin-top:8px;font-family:monospace" placeholder="<?php esc_attr_e( 'Full prompt text…', 'promptpalette' ); ?>"><?php echo esc_textarea( isset( $row['text'] ) ? $row['text'] : '' ); ?></textarea>
				<div style="display:flex;gap:8px;align-items:center;margin-top:8px">
					<input type="url" class="pp-img-field" name="pp_prompt_image[]" value="<?php echo esc_attr( isset( $row['image'] ) ? $row['image'] : '' ); ?>" style="flex:1" placeholder="<?php esc_attr_e( 'Demo image URL', 'promptpalette' ); ?>" />
					<button type="button" class="button pp-pick"><?php esc_html_e( 'Upload / pick', 'promptpalette' ); ?></button>
					<button type="button" class="button pp-remove"><?php esc_html_e( 'Remove', 'promptpalette' ); ?></button>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
	<button type="button" class="button button-primary" id="pp-add-row"><?php esc_html_e( '+ Add another prompt', 'promptpalette' ); ?></button>
	<script>
	(function(){
		var wrap = document.getElementById('pp-rows');
		function renumber(){ wrap.querySelectorAll('.pp-num').forEach(function(n,i){ n.textContent = i+1; }); }
		document.getElementById('pp-add-row').addEventListener('click', function(){
			var first = wrap.querySelector('.pp-row');
			var clone = first.cloneNode(true);
			clone.querySelector('textarea').value = '';
			clone.querySelector('.pp-img-field').value = '';
			wrap.appendChild(clone); renumber();
		});
		wrap.addEventListener('click', function(e){
			if (e.target.classList.contains('pp-remove')) {
				if (wrap.querySelectorAll('.pp-row').length > 1) { e.target.closest('.pp-row').remove(); renumber(); }
			}
			if (e.target.classList.contains('pp-pick')) {
				var field = e.target.closest('.pp-row').querySelector('.pp-img-field');
				var frame = wp.media({ title: 'Select demo image', multiple: false });
				frame.on('select', function(){ field.value = frame.state().get('selection').first().toJSON().url; });
				frame.open();
			}
		});
	})();
	</script>
	<?php
}

function pp_details_box( $post ) {
	$fields = array(
		'pp_premium' => array( 'label' => __( 'Premium prompt', 'promptpalette' ), 'type' => 'checkbox' ),
		'pp_likes'   => array( 'label' => __( 'Likes', 'promptpalette' ), 'type' => 'number' ),
		'pp_copies'  => array( 'label' => __( 'Copies', 'promptpalette' ), 'type' => 'number' ),
		'pp_saves'   => array( 'label' => __( 'Saves', 'promptpalette' ), 'type' => 'number' ),
		'pp_rating'  => array( 'label' => __( 'Rating (0-5)', 'promptpalette' ), 'type' => 'number', 'step' => '0.1' ),
	);
	foreach ( $fields as $key => $f ) {
		$val = get_post_meta( $post->ID, $key, true );
		echo '<p><label style="font-weight:600;display:block;margin-bottom:4px">' . esc_html( $f['label'] ) . '</label>';
		if ( 'checkbox' === $f['type'] ) {
			echo '<input type="checkbox" name="' . esc_attr( $key ) . '" value="1" ' . checked( $val, '1', false ) . ' />';
		} else {
			echo '<input type="number" step="' . esc_attr( isset( $f['step'] ) ? $f['step'] : '1' ) . '" name="' . esc_attr( $key ) . '" value="' . esc_attr( $val ) . '" style="width:100%" />';
		}
		echo '</p>';
	}
}

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

	$texts  = isset( $_POST['pp_prompt_text'] ) ? (array) wp_unslash( $_POST['pp_prompt_text'] ) : array();
	$images = isset( $_POST['pp_prompt_image'] ) ? (array) wp_unslash( $_POST['pp_prompt_image'] ) : array();
	$rows   = array();
	foreach ( $texts as $i => $text ) {
		$text  = trim( sanitize_textarea_field( $text ) );
		$image = isset( $images[ $i ] ) ? esc_url_raw( trim( $images[ $i ] ) ) : '';
		if ( '' === $text && '' === $image ) {
			continue;
		}
		$rows[] = array( 'text' => $text, 'image' => $image );
	}
	update_post_meta( $post_id, 'pp_prompt_rows', $rows );

	update_post_meta( $post_id, 'pp_premium', isset( $_POST['pp_premium'] ) ? '1' : '' );
	foreach ( array( 'pp_likes', 'pp_copies', 'pp_saves' ) as $key ) {
		update_post_meta( $post_id, $key, isset( $_POST[ $key ] ) ? absint( $_POST[ $key ] ) : 0 );
	}
	$rating = isset( $_POST['pp_rating'] ) ? (float) $_POST['pp_rating'] : 5;
	update_post_meta( $post_id, 'pp_rating', max( 0, min( 5, $rating ) ) );
}
add_action( 'save_post_prompt', 'pp_save_meta' );
