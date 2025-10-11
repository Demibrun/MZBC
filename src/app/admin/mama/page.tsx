// src/app/admin/mama/page.tsx
"use client";

import { useEffect, useState } from "react";

type MamaItem = { _id: string; title?: string; url: string; videoId: string };

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(init?.method && init.method !== "GET" ? { "Content-Type": "application/json" } : {}),
      // send admin header key (fallback if you don't have the admin cookie)
      ...(process.env.NEXT_PUBLIC_ADMIN_KEY ? { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY } : {}),
    },
    credentials: "include",
  });
  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try { msg = JSON.parse(text)?.error || msg; } catch {}
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }
  try { return JSON.parse(text) as T; } catch { return text as unknown as T; }
}

export default function AdminMamaPage() {
  const [title, setTitle] = useState("");
  const [youtube, setYoutube] = useState("");
  const [busy, setBusy] = useState(false);
  const [items, setItems] = useState<MamaItem[]>([]);

  async function load() {
    try {
      const d = await api<{ items: MamaItem[] }>("/api/mama");
      setItems(d.items || []);
    } catch {
      setItems([]);
    }
  }
  useEffect(() => { load(); }, []);

  async function add() {
    if (!youtube) return alert("Enter a YouTube URL or ID");
    setBusy(true);
    try {
      await api("/api/mama", { method: "POST", body: JSON.stringify({ title, youtube }) });
      setTitle(""); setYoutube("");
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/mama?id=${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin · Mama’s Section</h1>

      <div className="rounded-xl border bg-white p-5 mb-6">
        <h2 className="text-lg font-semibold mb-3">Add Video</h2>
        <label className="block mb-3">
          <span className="text-sm font-medium">Title (optional)</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <label className="block">
          <span className="text-sm font-medium">YouTube URL or Video ID</span>
          <input value={youtube} onChange={(e) => setYoutube(e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
        </label>
        <button
          disabled={busy}
          onClick={add}
          className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
        >
          {busy ? "Adding…" : "Add"}
        </button>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold mb-3">List</h2>
        {items.length === 0 ? (
          <p>No videos yet.</p>
        ) : (
          <div className="grid gap-4">
            {items.map((v) => (
              <div key={v._id} className="border rounded p-3">
                {v.title && <div className="font-semibold mb-1">{v.title}</div>}
                <div className="text-xs text-gray-600 break-all mb-2">{v.url}</div>
                <div className="aspect-video w-full overflow-hidden rounded border">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${v.videoId}`}
                    title={v.title || "Mama video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <button onClick={() => del(v._id)} className="mt-2 text-red-600 underline">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
