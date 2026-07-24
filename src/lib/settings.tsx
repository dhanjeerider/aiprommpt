import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
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
};

const defaults: SiteSettings = {
  site_title: "PromptPalette",
  site_tagline: "A curated library of AI photo editing prompts.",
  hero_title: "AI Photo Editing Prompts",
  hero_gradient_text: "Gemini & ChatGPT",
  hero_subtitle: "Copy, paste, and generate stunning Images in seconds.",
  logo_url: null,
  favicon_url: null,
  adsense_client: null,
  ad_slot_grid: null,
  ad_slot_detail: null,
  ad_slot_sidebar: null,
  popular_tags: ["Men", "Woman", "Couple", "Family", "Birthday"],
  upi_id: null,
  upi_qr_url: null,
  premium_price: null,
  premium_currency: "INR",
  analytics_gtag: null,
};

const Ctx = createContext<SiteSettings>(defaults);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<SiteSettings>(defaults);
  useEffect(() => {
    let alive = true;
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      if (!alive || !data) return;
      setS({ ...defaults, ...(data as any) });
    });
    return () => { alive = false; };
  }, []);
  return <Ctx.Provider value={s}>{children}</Ctx.Provider>;
}

export function useSettings() {
  return useContext(Ctx);
}
