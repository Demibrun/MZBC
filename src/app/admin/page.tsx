"use client";

import { useEffect, useState } from "react";

/** Fetch helper that always sends cookies and returns clear errors */
async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      ...(init?.method && init.method !== "GET"
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  let raw = "";
  try {
    raw = await res.text();
  } catch {}

  if (!res.ok) {
    let msg = raw;
    try {
      const j = JSON.parse(raw);
      msg = j?.error || j?.message || msg;
    } catch {}
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }

  if (!raw) return undefined as T;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

const TABS = [
  "Zion Daily",
  "Testimonies",
  "Prayer Points",
  "Humor",
  "Deliverance",
  "Pastors",
  "Units",
  "Ministry Groups",
  "Media",
] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const [authed, setAuthed] = useState<null | boolean>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("Zion Daily");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const done = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(null), 1800);
  };

  /** Auth check on mount */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await api("/api/auth/check");
        if (mounted) setAuthed(true);
      } catch {
        if (mounted) setAuthed(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      setAuthed(true);
      done("Logged in");
    } catch (err: any) {
      alert(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Zion Daily ---------------- */
  type Entry = {
    _id?: string;
    date?: string;
    title: string;
    subtitle?: string;
    text: string;
  };
  type SectionKey =
    | "wordOfDay"
    | "prophetic"
    | "sundaySchool"
    | "devotional"
    | "homecare";
  const [zdSection, setZdSection] = useState<SectionKey>("wordOfDay");
  const [zdDate, setZdDate] = useState("");
  const [zdTitle, setZdTitle] = useState("");
  const [zdSubtitle, setZdSubtitle] = useState("");
  const [zdText, setZdText] = useState("");
  const [historySection, setHistorySection] =
    useState<SectionKey>("wordOfDay");
  const [history, setHistory] = useState<Entry[]>([]);
  async function loadHistory() {
    try {
      const d = await api<{ section?: { items?: Entry[] } }>(
        `/api/daily?section=${historySection}`
      );
      setHistory(d?.section?.items || []);
    } catch {
      setHistory([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Zion Daily") loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab, historySection]);

  async function addZionDaily() {
    if (!zdTitle || !zdText) return alert("Title and text are required");
    setBusy(true);
    try {
      await api("/api/daily", {
        method: "POST",
        body: JSON.stringify({
          section: zdSection,
          entry: {
            date: zdDate || undefined,
            title: zdTitle,
            subtitle: zdSubtitle || undefined,
            text: zdText,
          },
        }),
      });
      setZdDate("");
      setZdTitle("");
      setZdSubtitle("");
      setZdText("");
      if (historySection === zdSection) loadHistory();
      done("Zion Daily added");
    } catch (err: any) {
      alert(err?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }
  async function deleteZionDaily(id: string) {
    if (!confirm("Delete this entry?")) return;
    setBusy(true);
    try {
      await api(`/api/daily?section=${historySection}&id=${id}`, {
        method: "DELETE",
      });
      loadHistory();
      done("Deleted");
    } catch (err: any) {
      alert(err?.message || "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Testimonies ---------------- */
  type Testimony = {
    _id: string;
    title: string;
    name?: string;
    body: string;
    approved?: boolean;
  };
  const [tTitle, setTTitle] = useState("");
  const [tName, setTName] = useState("");
  const [tBody, setTBody] = useState("");
  const [tests, setTests] = useState<Testimony[]>([]);
  async function loadTests() {
    try {
      const d = await api<{ items?: Testimony[] }>(
        "/api/testimonies?all=1"
      );
      setTests(d?.items || []);
    } catch {
      setTests([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Testimonies") loadTests();
  }, [authed, tab]);
  async function addTest() {
    if (!tTitle || !tBody) return alert("Title and body required");
    setBusy(true);
    try {
      await api("/api/testimonies", {
        method: "POST",
        body: JSON.stringify({
          title: tTitle,
          name: tName || undefined,
          body: tBody,
          approved: true,
        }),
      });
      setTTitle("");
      setTName("");
      setTBody("");
      loadTests();
      done("Added");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delTest(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/testimonies?id=${id}`, { method: "DELETE" });
      loadTests();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Prayer Points ---------------- */
  type PP = { _id: string; title: string; body: string };
  const [pp, setPp] = useState<PP[]>([]);
  const [ppTitle, setPpTitle] = useState("");
  const [ppBody, setPpBody] = useState("");
  async function loadPp() {
    try {
      const d = await api<{ items?: PP[] }>("/api/prayer");
      setPp(d?.items || []);
    } catch {
      setPp([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Prayer Points") loadPp();
  }, [authed, tab]);
  async function addPp() {
    if (!ppTitle || !ppBody) return alert("Title and content required");
    setBusy(true);
    try {
      await api("/api/prayer", {
        method: "POST",
        body: JSON.stringify({ title: ppTitle, body: ppBody }),
      });
      setPpTitle("");
      setPpBody("");
      loadPp();
      done("Added");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delPp(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/prayer?id=${id}`, { method: "DELETE" });
      loadPp();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Humor ---------------- */
  type Humor = { humor?: string; scienceFact?: string; healthFact?: string };
  const [humor, setHumor] = useState<Humor>({});
  useEffect(() => {
    (async () => {
      if (authed && tab === "Humor") {
        try {
          const d = await api<{ item?: Humor }>("/api/humor");
          setHumor(d?.item || {});
        } catch {
          setHumor({});
        }
      }
    })();
  }, [authed, tab]);
  async function saveHumor() {
    setBusy(true);
    try {
      await api("/api/humor", {
        method: "PUT",
        body: JSON.stringify(humor),
      });
      done("Saved");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Deliverance ---------------- */
  type Deliv = {
    zoomId?: string;
    zoomPasscode?: string;
    instructions?: string;
  };
  const [deliv, setDeliv] = useState<Deliv>({});
  useEffect(() => {
    (async () => {
      if (authed && tab === "Deliverance") {
        try {
          const d = await api<{ item?: Deliv }>("/api/deliverance");
          setDeliv(d?.item || {});
        } catch {
          setDeliv({});
        }
      }
    })();
  }, [authed, tab]);
  async function saveDeliv() {
    setBusy(true);
    try {
      await api("/api/deliverance", {
        method: "PUT",
        body: JSON.stringify(deliv),
      });
      done("Saved");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Pastors & Units ---------------- */
  type Pastor = {
    _id: string;
    name: string;
    photoUrl?: string;
    order?: number;
  };
  type Unit = {
    _id: string;
    name: string;
    description?: string;
    joinLink?: string;
    order?: number;
  };

  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [pName, setPName] = useState("");
  const [pPhoto, setPPhoto] = useState("");
  const [pOrder, setPOrder] = useState<number | "">("");

  async function loadPastors() {
    try {
      const d = await api<{ items?: Pastor[] }>(
        "/api/workforce/pastors"
      );
      setPastors(d?.items || []);
    } catch {
      setPastors([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Pastors") loadPastors();
  }, [authed, tab]);
  async function addPastor() {
    if (!pName) return alert("Name required");
    setBusy(true);
    try {
      await api("/api/workforce/pastors", {
        method: "POST",
        body: JSON.stringify({
          name: pName,
          photoUrl: pPhoto,
          order: pOrder || 0,
        }),
      });
      setPName("");
      setPPhoto("");
      setPOrder("");
      loadPastors();
      done("Added");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delPastor(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/workforce/pastors?id=${id}`, {
        method: "DELETE",
      });
      loadPastors();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  const [units, setUnits] = useState<Unit[]>([]);
  const [uName, setUName] = useState("");
  const [uDesc, setUDesc] = useState("");
  const [uJoin, setUJoin] = useState("");
  async function loadUnits() {
    try {
      const d = await api<{ items?: Unit[] }>("/api/workforce/units");
      setUnits(d?.items || []);
    } catch {
      setUnits([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Units") loadUnits();
  }, [authed, tab]);
  async function addUnit() {
    if (!uName) return alert("Name required");
    setBusy(true);
    try {
      await api("/api/workforce/units", {
        method: "POST",
        body: JSON.stringify({
          name: uName,
          description: uDesc,
          joinLink: uJoin,
        }),
      });
      setUName("");
      setUDesc("");
      setUJoin("");
      loadUnits();
      done("Added");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delUnit(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/workforce/units?id=${id}`, {
        method: "DELETE",
      });
      loadUnits();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Ministry Groups ---------------- */
  type Group = {
    _id: string;
    key: string;
    title?: string;
    photoUrl?: string;
    body?: string;
  };
  const [groups, setGroups] = useState<Group[]>([]);
  const [gKey, setGKey] = useState("women");
  const [gTitle, setGTitle] = useState("");
  const [gPhoto, setGPhoto] = useState("");
  const [gBody, setGBody] = useState("");
  async function loadGroups() {
    try {
      const d = await api<{ items?: Group[] }>("/api/ministry-groups");
      setGroups(d?.items || []);
    } catch {
      setGroups([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Ministry Groups") loadGroups();
  }, [authed, tab]);
  async function saveGroup() {
    setBusy(true);
    try {
      await api("/api/ministry-groups", {
        method: "POST",
        body: JSON.stringify({
          key: gKey,
          title: gTitle,
          photoUrl: gPhoto,
          body: gBody,
        }),
      });
      setGTitle("");
      setGPhoto("");
      setGBody("");
      loadGroups();
      done("Saved");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delGroup(id: string) {
    if (!confirm("Delete group?")) return;
    setBusy(true);
    try {
      await api(`/api/ministry-groups?id=${id}`, {
        method: "DELETE",
      });
      loadGroups();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  /** ---------------- Media ---------------- */
  type Media = {
    _id: string;
    kind: "youtube" | "photo" | "audio";
    title?: string;
    url: string;
    thumbnail?: string;
  };
  const [media, setMedia] = useState<Media[]>([]);
  const [mKind, setMKind] =
    useState<"youtube" | "photo" | "audio">("youtube");
  const [mTitle, setMTitle] = useState("");
  const [mUrl, setMUrl] = useState("");
  const [mThumb, setMThumb] = useState("");
  async function loadMedia() {
    try {
      const d = await api<{ items?: Media[] }>("/api/media");
      setMedia(d?.items || []);
    } catch {
      setMedia([]);
    }
  }
  useEffect(() => {
    if (authed && tab === "Media") loadMedia();
  }, [authed, tab]);
  async function addMedia() {
    if (!mUrl) return alert("URL / Video ID required");
    setBusy(true);
    try {
      await api("/api/media", {
        method: "POST",
        body: JSON.stringify({
          kind: mKind,
          title: mTitle,
          url: mUrl,
          thumbnail: mThumb,
        }),
      });
      setMTitle("");
      setMUrl("");
      setMThumb("");
      loadMedia();
      done("Added");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }
  async function delMedia(id: string) {
    if (!confirm("Delete?")) return;
    setBusy(true);
    try {
      await api(`/api/media?id=${id}`, { method: "DELETE" });
      loadMedia();
      done("Deleted");
    } catch (e: any) {
      alert(e?.message || "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (authed === null)
    return (
      <main className="max-w-6xl mx-auto px-4 py-10">Checking…</main>
    );

  if (!authed) {
    return (
      <main className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="grid gap-3">
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>
          <button
            disabled={busy}
            className="rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded ${
              tab === t
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {toast && (
        <div className="mb-4 rounded bg-green-600 text-white px-3 py-2">
          {toast}
        </div>
      )}

      {/* Zion Daily */}
      {tab === "Zion Daily" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Add New Entry</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Section</span>
                <select
                  value={zdSection}
                  onChange={(e) =>
                    setZdSection(e.target.value as SectionKey)
                  }
                  className="mt-1 w-full rounded border px-3 py-2"
                >
                  <option value="wordOfDay">Word of the Day</option>
                  <option value="prophetic">Prophetic Declaration</option>
                  <option value="sundaySchool">Sunday School</option>
                  <option value="devotional">Daily Devotional</option>
                  <option value="homecare">Homecare Fellowship</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium">Date (optional)</span>
                <input
                  value={zdDate}
                  onChange={(e) => setZdDate(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
            </div>
            <div className="grid md:grid-cols-2 gap-3 mt-3">
              <label className="block">
                <span className="text-sm font-medium">Title</span>
                <input
                  value={zdTitle}
                  onChange={(e) => setZdTitle(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Subtitle</span>
                <input
                  value={zdSubtitle}
                  onChange={(e) => setZdSubtitle(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
            </div>
            <label className="block mt-3">
              <span className="text-sm font-medium">Text</span>
              <textarea
                value={zdText}
                onChange={(e) => setZdText(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 min-h-[140px]"
              />
            </label>
            <button
              disabled={busy}
              onClick={addZionDaily}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Saving…" : "Add Entry"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">History</h2>
              <label className="text-sm">
                <span className="mr-2">Section:</span>
                <select
                  value={historySection}
                  onChange={(e) =>
                    setHistorySection(e.target.value as SectionKey)
                  }
                  className="rounded border px-3 py-2"
                >
                  <option value="wordOfDay">Word of the Day</option>
                  <option value="prophetic">Prophetic Declaration</option>
                  <option value="sundaySchool">Sunday School</option>
                  <option value="devotional">Daily Devotional</option>
                  <option value="homecare">Homecare Fellowship</option>
                </select>
              </label>
            </div>
            <div className="grid gap-3">
              {history.length === 0 && <p>No entries yet.</p>}
              {history.map((h) => (
                <div key={h._id} className="border rounded p-3">
                  <div className="font-semibold">{h.title}</div>
                  {h.subtitle && (
                    <div className="text-xs text-gray-600">{h.subtitle}</div>
                  )}
                  {h.date && (
                    <div className="text-xs text-gray-600 mt-1">{h.date}</div>
                  )}
                  <div className="whitespace-pre-wrap text-sm mt-2">
                    {h.text}
                  </div>
                  {h._id && (
                    <button
                      onClick={() => deleteZionDaily(h._id!)}
                      className="mt-2 text-red-600 underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonies */}
      {tab === "Testimonies" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Add Testimony</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Title</span>
                <input
                  value={tTitle}
                  onChange={(e) => setTTitle(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Name (optional)</span>
                <input
                  value={tName}
                  onChange={(e) => setTName(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
            </div>
            <label className="block mt-3">
              <span className="text-sm font-medium">Body</span>
              <textarea
                value={tBody}
                onChange={(e) => setTBody(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 min-h-[140px]"
              />
            </label>
            <button
              disabled={busy}
              onClick={addTest}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Saving…" : "Add Testimony"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">All Testimonies</h2>
            <div className="grid gap-3">
              {tests.length === 0 && <p>No testimonies yet.</p>}
              {tests.map((t) => (
                <div key={t._id} className="border rounded p-3">
                  <div className="font-semibold">
                    {t.title} {t.name ? `— ${t.name}` : ""}
                  </div>
                  <div className="whitespace-pre-wrap text-sm mt-2">
                    {t.body}
                  </div>
                  <button
                    onClick={() => delTest(t._id)}
                    className="mt-2 text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prayer Points */}
      {tab === "Prayer Points" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Add Prayer Point</h2>
            <label className="block">
              <span className="text-sm font-medium">Title</span>
              <input
                value={ppTitle}
                onChange={(e) => setPpTitle(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="block mt-3">
              <span className="text-sm font-medium">Content</span>
              <textarea
                value={ppBody}
                onChange={(e) => setPpBody(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 min-h-[120px]"
              />
            </label>
            <button
              disabled={busy}
              onClick={addPp}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Adding…" : "Add"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">List</h2>
            <div className="grid gap-3">
              {pp.length === 0 && <p>No items.</p>}
              {pp.map((p) => (
                <div key={p._id} className="border rounded p-3">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm whitespace-pre-wrap mt-1">
                    {p.body}
                  </div>
                  <button
                    onClick={() => delPp(p._id)}
                    className="mt-2 text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Humor */}
      {tab === "Humor" && (
        <section className="rounded-xl border bg-white p-5 grid gap-3">
          <h2 className="text-xl font-bold">Humor & Facts</h2>
          <label className="block">
            <span className="text-sm font-medium">Humor of the Week</span>
            <textarea
              value={humor.humor || ""}
              onChange={(e) => setHumor({ ...humor, humor: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2 min-h-[100px]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Science Fact</span>
            <textarea
              value={humor.scienceFact || ""}
              onChange={(e) =>
                setHumor({ ...humor, scienceFact: e.target.value })
              }
              className="mt-1 w-full rounded border px-3 py-2 min-h-[80px]"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Health Fact</span>
            <textarea
              value={humor.healthFact || ""}
              onChange={(e) =>
                setHumor({ ...humor, healthFact: e.target.value })
              }
              className="mt-1 w-full rounded border px-3 py-2 min-h-[80px]"
            />
          </label>
          <button
            disabled={busy}
            onClick={saveHumor}
            className="rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </section>
      )}

      {/* Deliverance */}
      {tab === "Deliverance" && (
        <section className="rounded-xl border bg-white p-5 grid gap-3">
          <h2 className="text-xl font-bold">Deliverance (Zoom)</h2>
          <label className="block">
            <span className="text-sm font-medium">Zoom ID</span>
            <input
              value={deliv.zoomId || ""}
              onChange={(e) => setDeliv({ ...deliv, zoomId: e.target.value })}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Passcode</span>
            <input
              value={deliv.zoomPasscode || ""}
              onChange={(e) =>
                setDeliv({ ...deliv, zoomPasscode: e.target.value })
              }
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Instructions</span>
            <textarea
              value={deliv.instructions || ""}
              onChange={(e) =>
                setDeliv({ ...deliv, instructions: e.target.value })
              }
              className="mt-1 w-full rounded border px-3 py-2 min-h-[100px]"
            />
          </label>
          <button
            disabled={busy}
            onClick={saveDeliv}
            className="rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
          >
            {busy ? "Saving…" : "Save"}
          </button>
        </section>
      )}

      {/* Pastors */}
      {tab === "Pastors" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Add Pastor</h2>
            <div className="grid md:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Name</span>
                <input
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Photo URL</span>
                <input
                  value={pPhoto}
                  onChange={(e) => setPPhoto(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Order</span>
                <input
                  type="number"
                  value={pOrder as any}
                  onChange={(e) => setPOrder(Number(e.target.value) || "")}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
            </div>
            <button
              disabled={busy}
              onClick={addPastor}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Adding…" : "Add"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">List</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {pastors.map((p) => (
                <div key={p._id} className="border rounded p-3">
                  <div className="font-semibold">{p.name}</div>
                  {p.photoUrl && (
                    <img
                      src={p.photoUrl}
                      alt={p.name}
                      className="mt-2 h-32 object-cover rounded"
                    />
                  )}
                  <button
                    onClick={() => delPastor(p._id)}
                    className="mt-2 text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Units */}
      {tab === "Units" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Add Unit</h2>
            <label className="block">
              <span className="text-sm font-medium">Unit Name</span>
              <input
                value={uName}
                onChange={(e) => setUName(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="block mt-3">
              <span className="text-sm font-medium">Description</span>
              <textarea
                value={uDesc}
                onChange={(e) => setUDesc(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 min-h-[100px]"
              />
            </label>
            <label className="block mt-3">
              <span className="text-sm font-medium">Join Link (optional)</span>
              <input
                value={uJoin}
                onChange={(e) => setUJoin(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <button
              disabled={busy}
              onClick={addUnit}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Adding…" : "Add"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">List</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {units.map((u) => (
                <div key={u._id} className="border rounded p-3">
                  <div className="font-semibold">{u.name}</div>
                  <p className="text-sm mt-1">{u.description}</p>
                  {u.joinLink && (
                    <a
                      className="underline text-blue-700 mt-1 inline-block"
                      href={u.joinLink}
                    >
                      Join →
                    </a>
                  )}
                  <button
                    onClick={() => delUnit(u._id)}
                    className="mt-2 text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ministry Groups */}
      {tab === "Ministry Groups" && (
        <section className="grid gap-4">
          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">Save / Upsert Group</h2>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-sm font-medium">Key</span>
                <input
                  value={gKey}
                  onChange={(e) => setGKey(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                  placeholder="women, beacons, men, heritage, champions"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium">Title</span>
                <input
                  value={gTitle}
                  onChange={(e) => setGTitle(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </label>
            </div>
            <label className="block mt-3">
              <span className="text-sm font-medium">Photo URL</span>
              <input
                value={gPhoto}
                onChange={(e) => setGPhoto(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
            <label className="block mt-3">
              <span className="text-sm font-medium">Body</span>
              <textarea
                value={gBody}
                onChange={(e) => setGBody(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 min-h-[100px]"
              />
            </label>
            <button
              disabled={busy}
              onClick={saveGroup}
              className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
            >
              {busy ? "Saving…" : "Save"}
            </button>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <h2 className="text-xl font-bold mb-3">List</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {groups.map((g) => (
                <div key={g._id} className="border rounded p-3">
                  <div className="font-semibold">
                    {g.title}{" "}
                    <span className="text-xs text-gray-500">({g.key})</span>
                  </div>
                  {g.photoUrl && (
                    <img
                      src={g.photoUrl}
                      className="mt-2 h-32 object-cover rounded"
                      alt={g.title}
                    />
                  )}
                  <button
                    onClick={() => delGroup(g._id)}
                    className="mt-2 text-red-600 underline"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media */}
{tab === "Media" && (
  <section className="grid gap-4">
    <div className="rounded-xl border bg-white p-5">
      <h2 className="text-xl font-bold mb-3">Add Media</h2>

      {/* Kind chooser keeps YouTube/Photo/Audio */}
      <label className="block">
        <span className="text-sm font-medium">Kind</span>
        <select
          value={mKind}
          onChange={(e) => setMKind(e.target.value as any)}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="youtube">YouTube (enter video ID)</option>
          <option value="photo">Photo (Upload from device)</option>
          <option value="audio">Audio (Upload from device)</option>
        </select>
      </label>

      {/* Title always available */}
      <div className="grid md:grid-cols-3 gap-3 mt-3">
        <label className="block">
          <span className="text-sm font-medium">Title</span>
          <input
            value={mTitle}
            onChange={(e) => setMTitle(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </label>

        {/* For YouTube: Video ID field (old behavior) */}
        {mKind === "youtube" && (
          <>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium">YouTube Video ID</span>
              <input
                value={mUrl}
                onChange={(e) => setMUrl(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="e.g., dQw4w9WgXcQ"
              />
            </label>
          </>
        )}

        {/* For Photo: file input */}
        {mKind === "photo" && (
          <>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium">Select Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  (e.target as any)._mzfile = f;
                }}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
          </>
        )}

        {/* For Audio: file input */}
        {mKind === "audio" && (
          <>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium">Select Audio</span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  (e.target as any)._mzfile = f;
                }}
                className="mt-1 w-full rounded border px-3 py-2"
              />
            </label>
          </>
        )}
      </div>

      <button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            if (mKind === "youtube") {
              if (!mUrl) return alert("Video ID required");
              await api("/api/media", {
                method: "POST",
                body: JSON.stringify({
                  kind: "youtube",
                  title: mTitle,
                  url: mUrl,
                }),
              });
            } else {
              // pick the input that stored a temporary ref on change
              const input = document.querySelector(
                mKind === "photo"
                  ? 'input[type="file"][accept^="image"]'
                  : 'input[type="file"][accept^="audio"]'
              ) as HTMLInputElement & { _mzfile?: File };

              const file = input?._mzfile;
              if (!file) return alert("Please choose a file to upload");

              const fd = new FormData();
              fd.append("kind", mKind);
              fd.append("title", mTitle || "");
              fd.append("file", file);

              const up = await fetch("/api/media/upload", {
                method: "POST",
                body: fd,
                credentials: "include",
              });

              if (!up.ok) {
                const msg = await up.text();
                throw new Error(msg);
              }

              const payload = await up.json();
              // save to media collection using your existing /api/media route
              await api("/api/media", {
                method: "POST",
                body: JSON.stringify({
                  kind: mKind,
                  title: mTitle,
                  url: payload.url,
                  thumbnail: payload.thumbnail || undefined,
                }),
              });
            }

            // reset
            setMTitle("");
            setMUrl("");
            setMThumb("");
            loadMedia();
            done("Added");
          } catch (e: any) {
            alert(e?.message || "Failed");
          } finally {
            setBusy(false);
          }
        }}
        className="mt-3 rounded bg-[var(--mz-primary-blue)] px-4 py-2 font-semibold text-white"
      >
        {busy ? (mKind === "youtube" ? "Adding…" : "Uploading…") : "Add"}
      </button>
    </div>

    <div className="rounded-xl border bg-white p-5">
      <h2 className="text-xl font-bold mb-3">List</h2>
      <div className="grid md:grid-cols-3 gap-3">
        {media.map((m) => (
          <div key={m._id} className="border rounded p-3">
            <div className="text-xs uppercase text-gray-500">{m.kind}</div>
            <div className="font-semibold">{m.title}</div>
            <div className="break-all text-xs text-gray-600">{m.url}</div>
            <button
              onClick={() => delMedia(m._id)}
              className="mt-2 text-red-600 underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
)}
    </main>
  );
}
