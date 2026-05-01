import { motion } from "framer-motion";
import { Compass, MapPin, Sparkles, Rocket, Shield, Search, Globe } from "lucide-react";

export default function WanderlustPortfolio() {
  return (
    <div className="bg-black text-white scroll-smooth">
      {/* NAV */}
      <nav className="fixed top-0 w-full bg-black/70 backdrop-blur-md z-50 flex justify-between items-center px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold">
          <Compass /> Wanderlust
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="#about">About</a>
          <a href="#features">Features</a>
          <a href="#architecture">Architecture</a>
          <a href="#tech">Tech</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold"
        >
          Wanderlust
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mt-4 max-w-xl"
        >
          AI-Powered Travel Discovery & Planning Platform with Hybrid Search Intelligence
        </motion.p>

        <motion.a
          href="#about"
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-6 py-3 bg-white text-black rounded-full font-semibold"
        >
          Explore Project
        </motion.a>
      </section>

      {/* ABOUT */}
      <section id="about" className="min-h-screen flex items-center px-10">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold mb-4">Overview</h2>
          <p className="text-gray-400 leading-relaxed">
            Wanderlust is a full-stack travel platform combining traditional listing systems
            with AI-powered semantic search and retrieval-augmented generation (RAG).
            It understands both structured filters and natural language travel intent.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="min-h-screen px-10 py-20">
        <h2 className="text-4xl font-bold mb-10">Features</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Hybrid Search", desc: "MongoDB + Vector AI semantic retrieval" },
            { icon: Sparkles, title: "AI Assistant", desc: "RAG-based intelligent recommendations" },
            { icon: MapPin, title: "Location System", desc: "Geo-based travel discovery via APIs" },
            { icon: Shield, title: "Auth System", desc: "Secure Passport.js authentication" },
            { icon: Rocket, title: "Performance", desc: "Debounced + paginated architecture" },
            { icon: Globe, title: "Scalable Design", desc: "Production-ready system architecture" },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white/5 rounded-2xl border border-white/10"
            >
              <f.icon className="mb-3" />
              <h3 className="font-semibold text-lg">{f.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section id="architecture" className="min-h-screen px-10 py-20">
        <h2 className="text-4xl font-bold mb-6">System Architecture</h2>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 font-mono text-sm">
          User Query → Intent Detection → Routing Layer → MongoDB / Vector DB → LLM → Response
        </div>
      </section>

      {/* TECH */}
      <section id="tech" className="min-h-screen px-10 py-20">
        <h2 className="text-4xl font-bold mb-10">Tech Stack</h2>

        <div className="flex flex-wrap gap-3">
          {[
            "React",
            "Node.js",
            "Express",
            "MongoDB",
            "Vector Search",
            "Hugging Face",
            "Cloudinary",
            "Bootstrap",
          ].map((t) => (
            <span
              key={t}
              className="px-4 py-2 bg-white/10 rounded-full text-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 border-t border-white/10 text-gray-500">
        Built by Srishti Verma • Full Stack Developer & AI Enthusiast
      </footer>
    </div>
  );
}

