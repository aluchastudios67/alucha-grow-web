import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/alucha/Navbar";
import { Hero } from "@/components/alucha/Hero";
import { Features } from "@/components/alucha/Features";
import { Builder } from "@/components/alucha/Builder";
import { Portfolio } from "@/components/alucha/Portfolio";
import { Pricing } from "@/components/alucha/Pricing";
import { Contact } from "@/components/alucha/Contact";
import { Footer } from "@/components/alucha/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Alucha Studios — We grow web masterpieces" },
      { name: "description", content: "Alucha Studios is a Georgian website builder and digital agency crafting sharp, fast, organic websites with bespoke 3D visuals and lightning performance." },
      { property: "og:title", content: "Alucha Studios — We grow web masterpieces" },
      { property: "og:description", content: "Sharp. Fast. Organic. Georgian-grown websites engineered for the world." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <Builder />
      <Portfolio />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
