'use client';

import { useRef, useState } from "react";

export default function ImageUploader({
  label = "Upload image",
  value,
  onChange,
  help,
}: {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  help?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  async function pickFile() {
    fileRef.current?.click();
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      setPreview(url);
      onChange(url);
    } catch (err) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={pickFile}
          className="btn-outline disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? "Uploading…" : label}
        </button>
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="h-16 w-16 rounded object-cover border"
          />
        ) : (
          <div className="h-16 w-16 rounded border bg-gray-50 grid place-content-center text-xs text-gray-500">
            No image
          </div>
        )}
      </div>
      {help && <p className="mt-2 text-xs text-gray-600">{help}</p>}
      <input ref={fileRef} onChange={onFile} type="file" accept="image/*" hidden />
    </div>
  );
}
