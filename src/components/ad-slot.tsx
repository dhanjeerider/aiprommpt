import { useEffect, useRef } from "react";

type Props = {
  client?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle";
  layout?: "in-article" | "in-feed";
  className?: string;
  variant?: "card" | "banner";
};

/**
 * Google AdSense slot styled to match the card grid.
 * When client/slot are provided (from site settings), a real <ins class="adsbygoogle"> is rendered.
 * Otherwise a placeholder card is shown so layout stays consistent.
 */
export function AdSlot({ client, slot, format = "auto", layout, className = "", variant = "card" }: Props) {
  const pushed = useRef(false);
  useEffect(() => {
    if (!client || !slot || pushed.current) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, [client, slot]);

  const wrapCls = variant === "banner"
    ? `glass-card flex min-h-[120px] w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 ${className}`
    : `glass-card flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/15 ${className}`;

  if (client && slot) {
    return (
      <div className={wrapCls}>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-ad-layout={layout}
          data-full-width-responsive="true"
        />
      </div>
    );
  }
  return (
    <div className={wrapCls} aria-label="Advertisement placeholder">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Advertisement</span>
    </div>
  );
}
