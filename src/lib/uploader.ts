import { uploadImageFn } from "./upload.functions";

export async function uploadImage(file: File): Promise<string | null> {
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
