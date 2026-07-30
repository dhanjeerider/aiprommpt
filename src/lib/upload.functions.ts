import { createServerFn } from "@tanstack/react-start";

/**
 * Relays an image upload to the image host from the server.
 * Doing it browser-side fails because the host does not send CORS headers.
 */
export const uploadImageFn = createServerFn({ method: "POST" })
  .inputValidator((data: FormData) => {
    if (!(data instanceof FormData)) throw new Error("Expected form data");
    return data;
  })
  .handler(async ({ data }) => {
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("No file provided");
    if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
    if (file.size > 12 * 1024 * 1024) throw new Error("Image must be under 12MB");

    const fd = new FormData();
    fd.append("source", file, file.name || "upload.png");
    fd.append("key", "6d207e02198a847aa98d0a2a901485a5");
    fd.append("format", "json");

    const res = await fetch("https://freeimage.host/api/1/upload", { method: "POST", body: fd });
    const json = (await res.json()) as { image?: { url?: string }; error?: { message?: string } };
    const url = json?.image?.url;
    if (!url) throw new Error(json?.error?.message ?? "Upload failed");
    return { url };
  });
