<?php
/**
 * Footer.
 *
 * @package PromptPalette
 */
?>
</main>

<footer class="site-footer">
	<div class="footer-inner glass-card">
		<div class="footer-cols">
			<div>
				<div class="brand" style="justify-content:center">
					<span class="brand-badge">
						<?php $logo = pp_option( 'logo_url' ); ?>
						<?php if ( $logo ) : ?>
							<img src="<?php echo esc_url( $logo ); ?>" alt="<?php bloginfo( 'name' ); ?>" />
						<?php else : ?>
							<?php echo pp_icon( 'sparkles' ); // phpcs:ignore ?>
						<?php endif; ?>
					</span>
					<span><?php bloginfo( 'name' ); ?></span>
				</div>
				<p class="muted" style="margin-top:14px;font-size:14px"><?php echo esc_html( pp_option( 'site_tagline' ) ); ?></p>
				<div class="social">
					<?php
					$socials = array(
						'twitter'   => pp_option( 'social_twitter' ),
						'instagram' => pp_option( 'social_instagram' ),
						'github'    => pp_option( 'social_github' ),
					);
					foreach ( $socials as $name => $url ) :
						if ( ! $url ) {
							continue;
						}
						?>
						<a href="<?php echo esc_url( $url ); ?>" target="_blank" rel="noreferrer noopener" aria-label="<?php echo esc_attr( $name ); ?>"><?php echo pp_icon( $name ); // phpcs:ignore ?></a>
					<?php endforeach; ?>
				</div>
			</div>

			<?php foreach ( array( 'footer_explore' => __( 'Explore', 'promptpalette' ), 'footer_company' => __( 'Company', 'promptpalette' ) ) as $loc => $label ) : ?>
				<?php if ( has_nav_menu( $loc ) ) : ?>
					<div>
						<h4><?php echo esc_html( $label ); ?></h4>
						<?php wp_nav_menu( array( 'theme_location' => $loc, 'container' => false, 'menu_class' => '', 'depth' => 1 ) ); ?>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>

		<div class="footer-bottom">
			<span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'Crafted for creators.', 'promptpalette' ); ?></span>
			<span><?php esc_html_e( 'Tested prompts for major AI tools', 'promptpalette' ); ?></span>
		</div>
	</div>
</footer>

<div class="lightbox" id="pp-lightbox" role="dialog" aria-modal="true">
	<img src="" alt="" />
	<button class="icon-btn close" type="button" data-lightbox-close aria-label="<?php esc_attr_e( 'Close', 'promptpalette' ); ?>"><?php echo pp_icon( 'close' ); // phpcs:ignore ?></button>
	<a class="btn dl" download target="_blank" rel="noreferrer"><?php echo pp_icon( 'download' ); // phpcs:ignore ?> <?php esc_html_e( 'Download image', 'promptpalette' ); ?></a>
</div>

<?php wp_footer(); ?>
</body>
</html>
