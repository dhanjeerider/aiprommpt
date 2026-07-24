export async function uploadImage(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.append("source", file);
  fd.append("key", "6d207e02198a847aa98d0a2a901485a5");
  fd.append("format", "json");
  try {
    const r = await fetch("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
    const j = await r.json();
    return j?.image?.url ?? null;
  } catch { return null; }
}
