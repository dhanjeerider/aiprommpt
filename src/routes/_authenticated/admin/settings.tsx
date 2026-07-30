import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { uploadImage } from "@/lib/uploader";

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

type Settings = {
  id: number;
  site_title: string;
  site_tagline: string;
  hero_title: string;
  hero_gradient_text: string;
  hero_subtitle: string;
  logo_url: string | null;
  favicon_url: string | null;
  adsense_client: string | null;
  ad_slot_grid: string | null;
  ad_slot_detail: string | null;
  ad_slot_sidebar: string | null;
  popular_tags: string[];
  upi_id: string | null;
  upi_qr_url: string | null;
  premium_price: string | null;
  premium_currency: string | null;
  analytics_gtag: string | null;
  premium_note: string | null;
  footer_links: { label: string; href: string; group?: string }[] | null;
};


function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null);
  const [tagsStr, setTagsStr] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) { toast.error(error.message); return; }
    if (!data) {
      // Create row if missing so admin settings always save
      const { data: created, error: insErr } = await supabase.from("site_settings").insert({ id: 1 }).select().single();
      if (insErr) { toast.error(insErr.message); return; }
      setS(created as Settings);
      setTagsStr((created as Settings).popular_tags?.join(", ") ?? "");
      return;
    }
    setS(data as Settings);
    setTagsStr((data as Settings).popular_tags?.join(", ") ?? "");
  }
  useEffect(() => { load(); }, []);

  if (!s) return <div className="text-muted-foreground">Loading settings…</div>;

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS({ ...s, [k]: v });

  async function save() {
    if (!s) return;
    setSaving(true);
    const payload: Partial<Settings> = {
      ...s,
      popular_tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean),
    };
    // id is the primary key — do not include in update payload
    delete (payload as any).id;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", 1);
    setSaving(false);
    if (error) { toast.error("Save failed: " + error.message); return; }
    toast.success("Settings saved — refresh the site to see changes");
    load();
  }

  async function upl(k: "logo_url" | "favicon_url" | "upi_qr_url", f: File) {
    const u = await uploadImage(f);
    if (!u) return toast.error("Upload failed");
    const patch: any = { [k]: u };
    const { error } = await supabase.from("site_settings").update(patch).eq("id", 1);
    if (error) return toast.error(error.message);
    set(k, u);
    toast.success("Uploaded and saved");
  }

  const textFields: Array<[keyof Settings, string, "textarea"?]> = [
    ["site_title", "Site title"],
    ["site_tagline", "Tagline", "textarea"],
    ["hero_title", "Hero title"],
    ["hero_gradient_text", "Hero gradient text"],
    ["hero_subtitle", "Hero subtitle", "textarea"],
    ["adsense_client", "AdSense client ID (ca-pub-…)"],
    ["ad_slot_grid", "Ad slot: grid"],
    ["ad_slot_detail", "Ad slot: detail"],
    ["ad_slot_sidebar", "Ad slot: sidebar"],
    ["upi_id", "UPI ID"],
    ["premium_price", "Premium price"],
    ["premium_currency", "Currency"],
    ["analytics_gtag", "Google Analytics tag"],
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl">Site settings</h1>
        <button onClick={save} disabled={saving} className="btn-gradient rounded-full px-4 py-2 text-sm disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {textFields.map(([k, label, kind]) => (
          <label key={String(k)} className="text-xs font-bold uppercase text-muted-foreground">
            {label}
            {kind === "textarea" ? (
              <textarea rows={2} value={(s[k] as string) ?? ""} onChange={e => set(k, e.target.value as any)}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
            ) : (
              <input value={(s[k] as string) ?? ""} onChange={e => set(k, e.target.value as any)}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
            )}
          </label>
        ))}

        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">
          Popular tags (comma separated — shown on home hero)
          <input value={tagsStr} onChange={e => setTagsStr(e.target.value)}
            placeholder="Men, Woman, Couple, Family, Birthday"
            className="mt-1 w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-foreground outline-none" />
        </label>

        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">
          Logo (auto-saves)
          <input type="file" accept="image/*" onChange={e => e.target.files && upl("logo_url", e.target.files[0])} className="mt-1 block w-full text-sm" />
          {s.logo_url && (
            <div className="mt-2 flex items-center gap-3">
              <img src={s.logo_url} alt="" className="h-16 w-16 rounded-full object-cover" />
              <button type="button" onClick={async () => { await supabase.from("site_settings").update({ logo_url: null }).eq("id", 1); set("logo_url", null); toast.success("Logo removed"); }}
                className="text-xs text-red-400 hover:underline">Remove</button>
            </div>
          )}
        </label>

        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">
          Favicon (auto-saves)
          <input type="file" accept="image/*" onChange={e => e.target.files && upl("favicon_url", e.target.files[0])} className="mt-1 block w-full text-sm" />
          {s.favicon_url && <img src={s.favicon_url} alt="" className="mt-2 h-10 w-10 rounded-md object-cover" />}
        </label>

        <label className="text-xs font-bold uppercase text-muted-foreground md:col-span-2">
          UPI QR (auto-saves)
          <input type="file" accept="image/*" onChange={e => e.target.files && upl("upi_qr_url", e.target.files[0])} className="mt-1 block w-full text-sm" />
          {s.upi_qr_url && <img src={s.upi_qr_url} alt="" className="mt-2 h-40" />}
        </label>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Tip: After saving, the site reads live settings — refresh any open tab to see the new logo, title, hero text, and popular tags.
      </p>
    </div>
  );
}
