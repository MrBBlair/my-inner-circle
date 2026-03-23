/** Client-only demo: images stored as data URLs in localStorage — use cloud storage in production. */
export const MAX_THREAD_ATTACHMENTS = 4;
export const MAX_SINGLE_ATTACHMENT_CHARS = 1_200_000;

export function fileToOptimizedDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const maxEdge = 1280;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (w < 1 || h < 1) {
        reject(new Error("Invalid image dimensions."));
        return;
      }
      if (w > maxEdge || h > maxEdge) {
        const r = Math.min(maxEdge / w, maxEdge / h);
        w = Math.round(w * r);
        h = Math.round(h * r);
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Could not process image."));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      let quality = 0.82;
      let dataUrl = canvas.toDataURL("image/jpeg", quality);
      while (dataUrl.length > MAX_SINGLE_ATTACHMENT_CHARS && quality > 0.45) {
        quality -= 0.08;
        dataUrl = canvas.toDataURL("image/jpeg", quality);
      }
      if (dataUrl.length > MAX_SINGLE_ATTACHMENT_CHARS) {
        reject(new Error("Image is still too large after compression. Try a smaller photo."));
        return;
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    img.src = url;
  });
}
