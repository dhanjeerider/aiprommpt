<?php
/**
 * Footer — port of src/components/site-footer.tsx.
 *
 * @package PromptPalette
 */

$pp_links  = pp_links();
$pp_groups = array();
if ( $pp_links ) {
	foreach ( $pp_links as $l ) {
		$g = $l['group'] ? $l['group'] : 'Explore';
		$pp_groups[ $g ][] = $l;
	}
}
?>
	</main>

	<footer class="mx-auto mt-24 w-full max-w-6xl px-4 pb-10">
		<div class="glass-card rounded-3xl p-8 sm:p-10">
			<div class="grid gap-10 text-center md:grid-cols-4 md:text-left">
				<div class="md:col-span-2">
					<div class="flex items-center justify-center gap-2 md:justify-start">
						<?php $logo = pp_setting( 'logo_url' ); ?>
						<?php if ( $logo ) : ?>
							<img src="<?php echo esc_url( $logo ); ?>" alt="<?php echo esc_attr( pp_site_title() ); ?>" class="h-9 w-9 rounded-full object-cover" />
						<?php else : ?>
							<span class="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-primary)] text-white">
								<?php echo pp_icon( 'sparkles', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</span>
						<?php endif; ?>
						<span class="text-lg font-bold"><?php echo esc_html( pp_site_title() ); ?></span>
					</div>
					<p class="mx-auto mt-4 max-w-sm text-sm text-muted-foreground md:mx-0"><?php echo esc_html( pp_setting( 'site_tagline' ) ); ?></p>
					<div class="mt-5 flex justify-center gap-2 md:justify-start">
						<?php
						$socials = array(
							'twitter'   => pp_setting( 'social_twitter' ),
							'instagram' => pp_setting( 'social_instagram' ),
							'github'    => pp_setting( 'social_github' ),
						);
						foreach ( $socials as $name => $url ) :
							?>
							<a href="<?php echo esc_url( $url ? $url : '#' ); ?>" <?php echo $url ? 'target="_blank" rel="noreferrer"' : ''; ?> aria-label="<?php echo esc_attr( ucfirst( $name ) ); ?>" class="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:bg-white/10 hover:text-foreground">
								<?php echo pp_icon( $name, 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</a>
						<?php endforeach; ?>
					</div>
				</div>

				<?php if ( $pp_groups ) : ?>
					<?php foreach ( array_slice( $pp_groups, 0, 2, true ) as $group => $items ) : ?>
						<div>
							<h4 class="text-sm font-semibold"><?php echo esc_html( $group ); ?></h4>
							<ul class="mt-4 space-y-2 text-sm text-muted-foreground">
								<?php foreach ( $items as $l ) : ?>
									<li><a href="<?php echo esc_url( $l['href'] ); ?>" class="hover:text-foreground"><?php echo esc_html( $l['label'] ); ?></a></li>
								<?php endforeach; ?>
							</ul>
						</div>
					<?php endforeach; ?>
				<?php else : ?>
					<?php
					$menu_groups = array(
						'footer_explore' => __( 'Explore', 'promptpalette' ),
						'footer_company' => __( 'Company', 'promptpalette' ),
					);
					$defaults    = array(
						'Explore' => array(
							array( 'label' => __( 'Home', 'promptpalette' ), 'href' => home_url( '/' ) ),
							array( 'label' => __( 'Categories', 'promptpalette' ), 'href' => home_url( '/libraries/' ) ),
							array( 'label' => __( 'Premium', 'promptpalette' ), 'href' => home_url( '/premium/' ) ),
							array( 'label' => __( 'All prompts', 'promptpalette' ), 'href' => get_post_type_archive_link( 'prompt' ) ),
						),
						'Company' => array(
							array( 'label' => __( 'About', 'promptpalette' ), 'href' => home_url( '/about/' ) ),
							array( 'label' => __( 'Contact', 'promptpalette' ), 'href' => home_url( '/contact/' ) ),
							array( 'label' => __( 'Privacy', 'promptpalette' ), 'href' => home_url( '/privacy/' ) ),
							array( 'label' => __( 'Terms', 'promptpalette' ), 'href' => home_url( '/terms/' ) ),
						),
					);
					foreach ( $menu_groups as $loc => $label ) :
						?>
						<div>
							<h4 class="text-sm font-semibold"><?php echo esc_html( $label ); ?></h4>
							<?php if ( has_nav_menu( $loc ) ) : ?>
								<div class="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
									<?php
									wp_nav_menu(
										array(
											'theme_location' => $loc,
											'container'      => false,
											'items_wrap'     => '%3$s',
											'depth'          => 1,
											'walker'         => new PP_Link_Walker( 'hover:text-foreground' ),
										)
									);
									?>
								</div>
							<?php else : ?>
								<ul class="mt-4 space-y-2 text-sm text-muted-foreground">
									<?php foreach ( $defaults[ $label ] as $l ) : ?>
										<li><a href="<?php echo esc_url( $l['href'] ); ?>" class="hover:text-foreground"><?php echo esc_html( $l['label'] ); ?></a></li>
									<?php endforeach; ?>
								</ul>
							<?php endif; ?>
						</div>
						<?php
					endforeach;
					?>
				<?php endif; ?>
			</div>

			<div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:text-left">
				<span>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( pp_site_title() ); ?>. <?php esc_html_e( 'Crafted for creators.', 'promptpalette' ); ?></span>
				<span><?php esc_html_e( 'Made with care · Tested prompts for major AI tools', 'promptpalette' ); ?></span>
			</div>
		</div>
	</footer>
</div>

<div id="pp-toast" class="pointer-events-none fixed left-1/2 top-6 z-[300] -translate-x-1/2"></div>

<div id="pp-lightbox" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
	<img src="" alt="" class="max-h-[88vh] max-w-full rounded-2xl object-contain" />
	<button type="button" data-lightbox-close aria-label="<?php esc_attr_e( 'Close', 'promptpalette' ); ?>" class="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20">
		<?php echo pp_icon( 'x', 'h-5 w-5' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</button>
	<a data-lightbox-download href="#" download target="_blank" rel="noreferrer" class="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20">
		<?php echo pp_icon( 'download', 'h-4 w-4' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?> <?php esc_html_e( 'Download image', 'promptpalette' ); ?>
	</a>
</div>

<?php wp_footer(); ?>
</body>
</html>
