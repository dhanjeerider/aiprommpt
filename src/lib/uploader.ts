import { supabase } from "@/integrations/supabase/client";
import { uploadImageFn } from "./upload.functions";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Uploads to the project's own storage (primary), with the external
 * image host kept as a fallback if storage is unavailable.
 */
export async function uploadImage(file: File): Promise<string | null> {
  const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  try {
    const { error } = await supabase.storage.from("uploads").upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || "image/png",
      upsert: false,
    });
    if (error) throw error;
    const { data, error: signErr } = await supabase.storage
      .from("uploads")
      .createSignedUrl(path, TEN_YEARS);
    if (signErr) throw signErr;
    if (data?.signedUrl) return data.signedUrl;
  } catch (e) {
    console.error("storage upload failed, trying fallback", e);
  }

  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImageFn({ data: fd });
    return res?.url ?? null;
  } catch (e) {
    console.error("upload failed", e);
    return null;
  }
}
