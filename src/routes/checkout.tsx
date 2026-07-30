import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Upload, Check, Copy } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useSettings } from "@/lib/settings";
import { uploadImage } from "@/lib/uploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Premium Checkout — Pay with UPI" },
      { name: "description", content: "Complete your one-time premium purchase with UPI. Submit your UTR number and payment screenshot for instant verification." },
      { property: "og:title", content: "Premium Checkout" },
      { property: "og:description", content: "Pay once with UPI and unlock the full premium prompt library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/checkout" }],
  }),
});

function CheckoutPage() {
  const s = useSettings();
  const [email, setEmail] = useState("");
  const [utr, setUtr] = useState("");
  const [shot, setShot] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const price = s.premium_price ?? "499";
  const currency = s.premium_currency ?? "INR";
  const symbol = currency === "INR" ? "₹" : "";
  const upi = s.upi_id ?? "";
  const upiLink = upi
    ? `upi://pay?pa=${encodeURIComponent(upi)}&pn=${encodeURIComponent(s.site_title)}&am=${encodeURIComponent(price)}&cu=${encodeURIComponent(currency)}`
    : "";

  async function onFile(f: File) {
    setUploading(true);
    const url = await uploadImage(f);
    setUploading(false);
    if (!url) return toast.error("Screenshot upload failed. Please try again.");
    setShot(url);
    toast.success("Screenshot attached");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !utr.trim() || !shot) {
      toast.error("Email, UTR number and payment screenshot are all required");
      return;
    }
    setSending(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("premium_orders").insert({
      user_id: u.user?.id ?? null,
      email: email.trim(),
      utr: utr.trim(),
      screenshot_url: shot,
      amount: `${symbol}${price}`,
    });
    setSending(false);
    if (error) return toast.error(error.message);
    setDone(true);
  }

  if (done) {
    return (
      <PageShell>
        <div className="glass-strong mx-auto max-w-lg rounded-[28px] p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-extrabold tracking-tight">Payment submitted</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            We received your UTR and screenshot. Your premium access is usually activated within a few hours after manual verification.
          </p>
          <Link to="/" className="btn-gradient mt-6 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold">
            Back to home
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Complete your <span className="gradient-text">Premium</span> purchase
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Pay {symbol}{price} once via UPI, then submit your UTR number and payment screenshot below. Access is granted after verification.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 lg:grid-cols-2">
        <div className="glass-strong rounded-[28px] p-6 text-center">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount to pay</div>
          <div className="mt-1 text-4xl font-extrabold">{symbol}{price}</div>
          <div className="text-xs text-muted-foreground">one-time · lifetime access</div>

          {s.upi_qr_url ? (
            <img
              src={s.upi_qr_url}
              alt="UPI QR code"
              className="mx-auto mt-6 w-56 max-w-full rounded-2xl border border-white/10 bg-white p-2 object-contain"
            />
          ) : (
            <p className="mt-6 text-xs text-muted-foreground">QR code not configured yet.</p>
          )}

          {upi && (
            <>
              <button
                type="button"
                onClick={() => { navigator.clipboard?.writeText(upi); toast.success("UPI ID copied"); }}
                className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold"
              >
                <Copy className="h-4 w-4" /> {upi}
              </button>
              <a href={upiLink} className="btn-gradient mt-3 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
                Open UPI app to pay
              </a>
            </>
          )}
          {s.premium_note && <p className="mt-4 text-xs text-muted-foreground">{s.premium_note}</p>}
        </div>

        <form onSubmit={submit} className="glass-card rounded-[28px] p-6 text-left">
          <h2 className="text-lg font-extrabold tracking-tight">Submit payment proof</h2>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Email
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-normal normal-case text-foreground outline-none"
            />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            UTR / Transaction reference
            <input
              value={utr} onChange={(e) => setUtr(e.target.value)} required
              placeholder="e.g. 412345678901"
              className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-normal normal-case text-foreground outline-none"
            />
          </label>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Payment screenshot
            <div className="mt-1 flex items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <input
                type="file" accept="image/*"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
                className="flex-1 text-sm font-normal normal-case"
              />
            </div>
            {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>}
            {shot && <img src={shot} alt="Payment screenshot" className="mt-3 h-40 w-auto rounded-xl object-contain" />}
          </label>

          <button
            type="submit" disabled={sending}
            className="btn-gradient mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {sending ? "Submitting…" : "Submit for verification"}
          </button>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> Manually verified · usually within a few hours
          </div>
        </form>
      </div>
    </PageShell>
  );
}
