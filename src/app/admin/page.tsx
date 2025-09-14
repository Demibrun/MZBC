'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import ImageUploader from '../../components/ImageUploader';

/* =========================
   Types
========================= */
type Settings = {
  siteName: string; ministryName: string; vision: string; address: string;
  phoneSmsOnly: string; email: string; instagram: string; facebook: string;
  youtube: string; logoUrl: string; heroHeadline: string; heroSub: string;
  yt1?: string; yt2?: string; yt3?: string;
};
type Leader = { _id?: string; name: string; title: string; photoUrl: string; bio?: string; order?: number };
type Service = { _id?: string; name: string; day: string; time: string; details?: string; imageUrl?: string; visible?: boolean; order?: number };
type Announcement = { _id?: string; title: string; body: string; startDate?: string; endDate?: string; featured?: boolean };

/* =========================
   Small UI helpers
========================= */
function TabButton({ active, onClick, children }:{
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-t ${active ? 'bg-white border border-b-0' : 'bg-gray-100 border border-gray-200'}`}
    >
      {children}
    </button>
  );
}
function Field({ label, value, onChange }:{
  label: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <label className="text-sm">
      {label}
      <input className="mt-1 w-full border rounded px-3 py-2" value={value} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}
function SmallField({ label, value, onChange, type="text" }:{
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input type={type} className="mt-1 w-full border rounded px-3 py-2" value={value} onChange={e=>onChange(e.target.value)} />
    </label>
  );
}

/* =========================
   Admin page
========================= */
export default function Admin(){
  const { data: session, status } = useSession();
  const [tab, setTab] = useState<'settings'|'leaders'|'services'|'announcements'>('settings');

  // DEV-only auto login (guarded by public env flags)
  useEffect(()=>{
    if (status === 'unauthenticated' && process.env.NEXT_PUBLIC_DEV_AUTO_LOGIN === 'true') {
      const email = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
      const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;
      if (email && password) {
        signIn('credentials', { email, password, callbackUrl: '/admin', redirect: true });
      }
    }
  }, [status]);

  if (!session) {
    return (
      <main className="mx-auto max-w-xl p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <form className="mt-4 flex flex-col gap-2" onSubmit={async e=>{
          e.preventDefault();
          const f = new FormData(e.currentTarget as HTMLFormElement);
          await signIn('credentials', {
            email: f.get('email') as string,
            password: f.get('password') as string,
            callbackUrl: '/admin'
          });
        }}>
          <label className="text-sm">Email</label>
          <input name="email" className="border rounded px-3 py-2" defaultValue="akinsipeoluwademilade@gmail.com" />
          <label className="text-sm">Password</label>
          <input name="password" type="password" className="border rounded px-3 py-2" defaultValue="ChangeMe123!" />
          <button className="btn-primary" type="submit">Sign in</button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button className="btn-outline" onClick={()=>signOut({ callbackUrl: '/' })}>Sign out</button>
      </div>

      <div className="mt-6">
        <div className="flex gap-2">
          <TabButton active={tab==='settings'} onClick={()=>setTab('settings')}>Site Settings</TabButton>
          <TabButton active={tab==='leaders'} onClick={()=>setTab('leaders')}>Leaders</TabButton>
          <TabButton active={tab==='services'} onClick={()=>setTab('services')}>Services</TabButton>
          <TabButton active={tab==='announcements'} onClick={()=>setTab('announcements')}>Announcements</TabButton>
        </div>

        <div className="border rounded-b p-4 bg-white">
          {tab==='settings' && <SettingsPanel />}
          {tab==='leaders' && <LeadersPanel />}
          {tab==='services' && <ServicesPanel />}
          {tab==='announcements' && <AnnouncementsPanel />}
        </div>
      </div>
    </main>
  );
}

/* =========================
   Panels (fully defined)
========================= */

/* ---- Settings ---- */
function SettingsPanel(): JSX.Element {
  const [data, setData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{ (async ()=>{
    const res = await fetch('/api/settings');
    setData(await res.json());
  })(); }, []);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
    alert(res.ok ? 'Settings saved' : 'Error saving settings');
  }

  if (!data) return <div>Loading…</div>;

  return (
    <form onSubmit={save} className="grid gap-3">
      <div className="grid md:grid-cols-2 gap-3">
        <Field label="Site Name" value={data.siteName} onChange={v=>setData({...data, siteName:v})}/>
        <Field label="Parent Ministry" value={data.ministryName} onChange={v=>setData({...data, ministryName:v})}/>
        <Field label="Vision (tagline)" value={data.vision} onChange={v=>setData({...data, vision:v})}/>
        <Field label="Address" value={data.address} onChange={v=>setData({...data, address:v})}/>
        <Field label="Phone (SMS only)" value={data.phoneSmsOnly} onChange={v=>setData({...data, phoneSmsOnly:v})}/>
        <Field label="Contact Email" value={data.email} onChange={v=>setData({...data, email:v})}/>
        <Field label="Instagram" value={data.instagram} onChange={v=>setData({...data, instagram:v})}/>
        <Field label="Facebook" value={data.facebook} onChange={v=>setData({...data, facebook:v})}/>
        <Field label="YouTube" value={data.youtube} onChange={v=>setData({...data, youtube:v})}/>
        <Field label="Hero Headline" value={data.heroHeadline} onChange={v=>setData({...data, heroHeadline:v})}/>
        <Field label="Hero Subtext" value={data.heroSub} onChange={v=>setData({...data, heroSub:v})}/>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <ImageUploader
          label="Upload Logo"
          value={data.logoUrl}
          onChange={url=>setData({...data, logoUrl:url})}
          help="PNG/JPG. In production, swap to cloud storage."
        />
        <div className="grid grid-cols-3 gap-2">
          <SmallField label="YouTube ID 1" value={data.yt1||''} onChange={v=>setData({...data, yt1:v})}/>
          <SmallField label="YouTube ID 2" value={data.yt2||''} onChange={v=>setData({...data, yt2:v})}/>
          <SmallField label="YouTube ID 3" value={data.yt3||''} onChange={v=>setData({...data, yt3:v})}/>
        </div>
      </div>

      <button className="btn-primary w-fit" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
    </form>
  );
}

/* ---- Leaders ---- */
function LeadersPanel(): JSX.Element {
  const [items, setItems] = useState<Leader[]>([]);
  const [editing, setEditing] = useState<Leader | null>(null);

  async function refresh(){ setItems(await (await fetch('/api/leaders')).json()); }
  useEffect(()=>{ refresh(); }, []);

  function startNew(){ setEditing({ name:'', title:'', photoUrl:'', bio:'', order: items.length+1 }); }
  function startEdit(l:Leader){ setEditing({ ...l }); }

  async function save(){
    if(!editing) return;
    const method = editing._id ? 'PUT' : 'POST';
    const res = await fetch('/api/leaders', {
      method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(editing)
    });
    if(res.ok){ setEditing(null); refresh(); } else alert('Error saving leader');
  }
  async function remove(id?:string){
    if(!id) return;
    if(!confirm('Delete this leader?')) return;
    const res = await fetch(`/api/leaders?id=${id}`, { method:'DELETE' });
    if(res.ok) refresh(); else alert('Error deleting');
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">All Leaders</h3>
        <button className="btn-primary" onClick={startNew}>Add Leader</button>
      </div>

      <ul className="space-y-2">
        {items.map(l=>(
          <li key={l._id} className="card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={l.photoUrl||'/uploads/placeholder.png'} className="h-12 w-12 rounded-full object-cover border" alt="" />
              <div>
                <div className="font-medium">{l.name}</div>
                <div className="text-xs text-gray-600">{l.title}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={()=>startEdit(l)}>Edit</button>
              <button className="btn-outline" onClick={()=>remove(l._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="card p-4">
          <h4 className="font-semibold mb-2">{editing._id ? 'Edit Leader' : 'New Leader'}</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name" value={editing.name} onChange={v=>setEditing({...editing, name:v})}/>
            <Field label="Title" value={editing.title} onChange={v=>setEditing({...editing, title:v})}/>
            <Field label="Bio" value={editing.bio||''} onChange={v=>setEditing({...editing, bio:v})}/>
            <Field label="Order" value={String(editing.order||0)} onChange={v=>setEditing({...editing, order:Number(v)||0})}/>
            <ImageUploader label="Photo" value={editing.photoUrl} onChange={url=>setEditing({...editing, photoUrl:url})}/>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={save}>Save</button>
            <button className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Services ---- */
function ServicesPanel(): JSX.Element {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);

  async function refresh(){ setItems(await (await fetch('/api/services')).json()); }
  useEffect(()=>{ refresh(); }, []);

  function startNew(){ setEditing({ name:'', day:'', time:'', details:'', visible:true, order: items.length+1 }); }
  function startEdit(s:Service){ setEditing({ ...s }); }

  async function save(){
    if(!editing) return;
    const method = editing._id ? 'PUT' : 'POST';
    const res = await fetch('/api/services', {
      method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(editing)
    });
    if(res.ok){ setEditing(null); refresh(); } else alert('Error saving service');
  }
  async function remove(id?:string){
    if(!id) return;
    if(!confirm('Delete this service?')) return;
    const res = await fetch(`/api/services?id=${id}`, { method:'DELETE' });
    if(res.ok) refresh(); else alert('Error deleting');
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">All Services</h3>
        <button className="btn-primary" onClick={startNew}>Add Service</button>
      </div>

      <ul className="space-y-2">
        {items.map(s=>(
          <li key={s._id} className="card p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={s.imageUrl||'/uploads/placeholder.png'} className="h-12 w-12 rounded object-cover border" alt="" />
              <div>
                <div className="font-medium">{s.name} <span className="text-xs text-gray-600">({s.day})</span></div>
                <div className="text-xs text-gray-600">{s.time}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={()=>startEdit(s)}>Edit</button>
              <button className="btn-outline" onClick={()=>remove(s._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="card p-4">
          <h4 className="font-semibold mb-2">{editing._id ? 'Edit Service' : 'New Service'}</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Name" value={editing.name} onChange={v=>setEditing({...editing, name:v})}/>
            <Field label="Day" value={editing.day} onChange={v=>setEditing({...editing, day:v})}/>
            <Field label="Time" value={editing.time} onChange={v=>setEditing({...editing, time:v})}/>
            <Field label="Details" value={editing.details||''} onChange={v=>setEditing({...editing, details:v})}/>
            <Field label="Order" value={String(editing.order||0)} onChange={v=>setEditing({...editing, order:Number(v)||0})}/>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.visible} onChange={e=>setEditing({...editing, visible:e.target.checked})}/>
              Visible on site
            </label>
            <ImageUploader label="Promo Image" value={editing.imageUrl||''} onChange={url=>setEditing({...editing, imageUrl:url})}/>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={save}>Save</button>
            <button className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Announcements ---- */
function AnnouncementsPanel(): JSX.Element {
  const [items, setItems] = useState<Announcement[]>([]);
  const [editing, setEditing] = useState<Announcement | null>(null);

  async function refresh(){ setItems(await (await fetch('/api/announcements')).json()); }
  useEffect(()=>{ refresh(); }, []);

  function startNew(){ setEditing({ title:'', body:'', featured:false }); }
  function startEdit(a:Announcement){
    setEditing({
      ...a,
      startDate: a.startDate ? a.startDate.slice(0,10) : '',
      endDate: a.endDate ? a.endDate.slice(0,10) : '',
    });
  }

  async function save(){
    if(!editing) return;
    const method = editing._id ? 'PUT' : 'POST';
    const res = await fetch('/api/announcements', {
      method, headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(editing)
    });
    if(res.ok){ setEditing(null); refresh(); } else alert('Error saving announcement');
  }
  async function remove(id?:string){
    if(!id) return;
    if(!confirm('Delete this announcement?')) return;
    const res = await fetch(`/api/announcements?id=${id}`, { method:'DELETE' });
    if(res.ok) refresh(); else alert('Error deleting');
  }

  return (
    <div className="grid gap-4">
      <div className="flex justify-between">
        <h3 className="font-semibold">All Announcements</h3>
        <button className="btn-primary" onClick={startNew}>Add Announcement</button>
      </div>

      <ul className="space-y-2">
        {items.map(a=>(
          <li key={a._id} className="card p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-xs text-gray-600">
                {a.startDate?.slice(0,10)} → {a.endDate?.slice(0,10)}
                {a.featured && <span className="ml-2 rounded bg-amber-100 px-1 text-amber-800">featured</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={()=>startEdit(a)}>Edit</button>
              <button className="btn-outline" onClick={()=>remove(a._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {editing && (
        <div className="card p-4">
          <h4 className="font-semibold mb-2">{editing._id ? 'Edit Announcement' : 'New Announcement'}</h4>
          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Title" value={editing.title} onChange={v=>setEditing({...editing, title:v})}/>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.featured} onChange={e=>setEditing({...editing, featured:e.target.checked})}/>
              Featured banner on home page
            </label>
            <Field label="Body" value={editing.body} onChange={v=>setEditing({...editing, body:v})}/>
            <SmallField label="Start Date" type="date" value={editing.startDate||''} onChange={v=>setEditing({...editing, startDate:v})}/>
            <SmallField label="End Date" type="date" value={editing.endDate||''} onChange={v=>setEditing({...editing, endDate:v})}/>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary" onClick={save}>Save</button>
            <button className="btn-outline" onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
