export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Section from "../components/Section";
import ServiceCard from "../components/ServiceCard";
import MediaCarousel from "../components/MediaCarousel";
import MapEmbed from "../components/MapEmbed";
import SocialIcons from "../components/SocialIcons";
import { dbConnect } from "../lib/db";
import { Leader, Service, SiteSettings } from "../lib/models";

export default async function Home(){
  await dbConnect();
  const settings = await SiteSettings.findOne();
  const services = await Service.find().sort({ order:1 });
  const leaders = await Leader.find().sort({ order:1 });
  const media = [settings?.yt1, settings?.yt2, settings?.yt3].filter(Boolean) as string[];

  return (
    <main>
      <Header />
      <Hero />

      <Section id="about" title="About">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-5">
            <h3 className="font-semibold">Mount Zion Prayer Ministry Int&apos;l</h3>
            <p className="mt-2">We are a Pentecostal church devoted to the Word, worship, prayer, and the power of the Holy Spirit.</p>
          </div>
          <div className="card p-5">
            <h3 className="font-semibold">Mount Zion Bible Church Nigeria</h3>
            <p className="mt-2">As a church family, we gather weekly to learn, pray, and serve our community in Ibadan and beyond.</p>
          </div>
        </div>
        <div className="mt-6 card p-5">
          <h3 className="font-semibold">Our Vision</h3>
          <p className="mt-2">“Zion, where captives become captains.”</p>
        </div>
      </Section>

      <Section id="leadership" title="Leadership">
        <div className="grid md:grid-cols-3 gap-4">
          {leaders.map((l:any)=> (
            <div className="card p-4 text-center" key={l._id}>
              <img src={l.photoUrl||"/placeholder-leader.jpg"} alt={l.name} className="mx-auto h-40 w-40 rounded-full object-cover"/>
              <div className="mt-3 font-semibold">{l.name}</div>
              <div className="text-sm text-gray-600">{l.title}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="services" title="Services & Times">
        <div className="grid gap-4">
          {services.map((s:any)=> s.visible && (
            <ServiceCard key={s._id} title={s.name} badge={s.day} time={s.time} image={s.imageUrl||undefined}>
              {s.details}
            </ServiceCard>
          ))}
        </div>
      </Section>

      <Section id="media" title="Media (Sermons & Highlights)">
        <MediaCarousel ids={media} />
        <div className="mt-4">
          <a className="btn-outline" href={settings?.youtube||"#"} target="_blank">More on YouTube</a>
        </div>
      </Section>

      <Section id="visit" title="Visit Us (Map & Directions)">
        <MapEmbed address={settings?.address || "26 Busayo Taiwo Street, Oni and Sons, Ibadan, Nigeria"} />
      </Section>

      <Section id="contact" title="Contact & Socials">
        <div className="grid md:grid-cols-2 gap-6">
          <form className="card p-5" action="/api/contact" method="post">
            <input className="mb-2 w-full border rounded px-3 py-2" name="name" placeholder="Full name" required />
            <input className="mb-2 w-full border rounded px-3 py-2" name="email" type="email" placeholder="Email" required />
            <input className="mb-2 w-full border rounded px-3 py-2" name="phone" placeholder="Phone (optional)" />
            <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />
            <textarea className="mb-3 w-full border rounded px-3 py-2" name="message" placeholder="How can we pray with you?" rows={5} required />
            <button className="btn-primary" type="submit">Send</button>
            <p className="mt-2 text-xs">SMS-only line: 0814 859 9942 • <a className="underline" href="mailto:mzpmintal@gmail.com">mzpmintal@gmail.com</a></p>
          </form>
          <div className="card p-5">
            <h3 className="font-semibold">Follow & Watch</h3>
            <div className="mt-3"><SocialIcons /></div>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
