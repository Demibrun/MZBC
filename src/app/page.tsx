import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import MapEmbed from "@/components/MapEmbed";
import MediaPreview from "@/components/MediaPreview";
import ServiceAlert from "@/components/ServiceAlert";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesSection />
      <ServiceAlert />
      <MediaPreview />
      <MapEmbed />
    </main>
  );
}
