"use client";

export type UploadKind = "photo" | "audio" | "video";

export type UploadProgress = {
  percent: number;
  phase: "compressing" | "preparing" | "uploading" | "saving";
  label: string;
};

type UploadResult = {
  ok: true;
  kind: UploadKind;
  title: string;
  url: string;
  thumbnail?: string;
  provider: "cloudinary" | "local";
  public_id: string;
  bytesBefore: number;
  bytesUploaded: number;
  compressed: boolean;
};

type SignedUpload = {
  cloudName: string;
  apiKey: string;
  folder: string;
  timestamp: number;
  signature: string;
  resourceType: "image" | "video" | "auto";
};

function report(
  onProgress: ((progress: UploadProgress) => void) | undefined,
  progress: UploadProgress
) {
  onProgress?.(progress);
}

function changeExtension(fileName: string, extension: string) {
  const trimmed = fileName.replace(/\.[^.]+$/, "");
  return `${trimmed || "upload"}.${extension}`;
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = "async";
    image.src = url;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Image compression failed"))),
      type,
      quality
    );
  });
}

export async function compressImageForUpload(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return { file, compressed: false };
  }

  const image = await fileToImage(file);
  const maxEdge = 1800;
  const ratio = Math.min(1, maxEdge / Math.max(image.width, image.height));

  if (ratio === 1 && file.size < 1.2 * 1024 * 1024) {
    return { file, compressed: false };
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * ratio));
  canvas.height = Math.max(1, Math.round(image.height * ratio));

  const context = canvas.getContext("2d");
  if (!context) return { file, compressed: false };

  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const blob = await canvasToBlob(canvas, "image/jpeg", 0.78);

  if (blob.size >= file.size) {
    return { file, compressed: false };
  }

  const compressed = new File([blob], changeExtension(file.name, "jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });

  return { file: compressed, compressed: true };
}

async function jsonFetch<T>(url: string, init: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", ...init });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new Error(data?.error || data?.message || "Upload failed");
  }

  return data as T;
}

function xhrUpload<T>(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = false;

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return;
      onProgress?.(Math.round((event.loaded / event.total) * 100));
    };

    xhr.onload = () => {
      const data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
      } else {
        reject(new Error(data?.error?.message || data?.error || "Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network upload failed"));
    xhr.send(formData);
  });
}

async function uploadThroughAppRoute(
  file: File,
  kind: UploadKind,
  title: string,
  onProgress?: (progress: UploadProgress) => void,
  bytesBefore = file.size,
  compressed = false
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("kind", kind);
  formData.append("title", title);
  formData.append("file", file);

  const uploaded = await xhrUpload<any>("/api/upload", formData, (percent) =>
    report(onProgress, {
      percent,
      phase: "uploading",
      label: `Uploading ${percent}%`,
    })
  );

  return {
    ok: true,
    kind,
    title,
    url: uploaded.url,
    thumbnail: uploaded.thumbnail,
    provider: uploaded.provider || "local",
    public_id: uploaded.public_id || "",
    bytesBefore,
    bytesUploaded: file.size,
    compressed,
  };
}

export async function uploadAdminMediaFile({
  file,
  kind,
  title = "",
  onProgress,
}: {
  file: File;
  kind: UploadKind;
  title?: string;
  onProgress?: (progress: UploadProgress) => void;
}): Promise<UploadResult> {
  const bytesBefore = file.size;
  let uploadFile = file;
  let compressed = false;

  if (kind === "photo") {
    report(onProgress, {
      percent: 0,
      phase: "compressing",
      label: "Compressing image",
    });
    const prepared = await compressImageForUpload(file);
    uploadFile = prepared.file;
    compressed = prepared.compressed;
  }

  report(onProgress, {
    percent: 0,
    phase: "preparing",
    label: "Preparing upload",
  });

  let signature: SignedUpload;
  try {
    signature = await jsonFetch<SignedUpload>("/api/upload/signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        title,
        fileName: uploadFile.name,
        fileSize: uploadFile.size,
        contentType: uploadFile.type,
      }),
    });
  } catch (error: any) {
    if (error?.message !== "Cloudinary is not configured on the server") {
      throw error;
    }

    return uploadThroughAppRoute(
      uploadFile,
      kind,
      title,
      onProgress,
      bytesBefore,
      compressed
    );
  }

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`;
  const cloudinaryResult = await xhrUpload<any>(endpoint, formData, (percent) =>
    report(onProgress, {
      percent,
      phase: "uploading",
      label: `Uploading ${percent}%`,
    })
  );

  report(onProgress, {
    percent: 100,
    phase: "saving",
    label: "Saving upload",
  });

  await jsonFetch("/api/upload/complete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileSize: uploadFile.size }),
  });

  return {
    ok: true,
    kind,
    title,
    url: cloudinaryResult.secure_url,
    thumbnail:
      signature.resourceType === "image"
        ? cloudinaryResult.secure_url
        : cloudinaryResult.thumbnail_url,
    provider: "cloudinary",
    public_id: cloudinaryResult.public_id,
    bytesBefore,
    bytesUploaded: uploadFile.size,
    compressed,
  };
}
