import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploader";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const [s, setS] = useState<any>(null);
  useEffect(() => { supabase.from("site_settings").select("*").eq("id", 1).single().then(({ data }) => setS(data)); }, []);
  if (!s) return <div>Loading…</div>;
  const set = (k: string, v: any) => setS({ ...s, [k]: v });
  async function save() {
    const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
    if (error) return toast.error(error.message); toast.success("Saved");
  }
  async function upl(k: string, f: File) { const u = await uploadImage(f); if (u) set(k, u); }

  const fields: [string, string, string?][] = [
    ["site_title", "Site title"], ["site_tagline", "Tagline"],
    ["hero_title", "Hero title"], ["hero_gradient_text", "Hero gradient text"],
    ["hero_subtitle", "Hero subtitle", "textarea"],
    ["adsense_client", "AdSense client ID (ca-pub-…)"],
    ["ad_slot_grid", "Ad slot: grid"], ["ad_slot_detail", "Ad slot: detail"], ["ad_slot_sidebar", "Ad slot: sidebar"],
    ["upi_id", "UPI ID"], ["premium_price", "Premium price"], ["premium_currency", "Currency"],
    ["analytics_gtag", "Google Analytics tag"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between"><h1 className="text-2xl">Site settings</h1>
        <button onClick={save} className="btn-gradient rounded-full px-4 py-2 text-sm">Save</button></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {fields.map(([k, label, kind]) => (
          <label key={k} className="text-xs font-bold uppercase text-muted-foreground">{label}
            {kind === "textarea"
              ? <textarea rows={2} value={s[k] ?? ""} onChange={e => set(k, e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none" />
              : <input value={s[k] ?? ""} onChange={e => set(k, e.target.value)} className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm outline-none" />}
          </label>
        ))}
        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">Logo
          <input type="file" accept="image/*" onChange={e => e.target.files && upl("logo_url", e.target.files[0])} className="mt-1 block w-full text-sm" />
          {s.logo_url && <img src={s.logo_url} alt="" className="mt-2 h-16" />}
        </label>
        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">UPI QR
          <input type="file" accept="image/*" onChange={e => e.target.files && upl("upi_qr_url", e.target.files[0])} className="mt-1 block w-full text-sm" />
          {s.upi_qr_url && <img src={s.upi_qr_url} alt="" className="mt-2 h-40" />}
        </label>
      </div>
    </div>
  );
}
