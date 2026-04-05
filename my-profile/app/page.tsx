"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Hash, Globe, Mail, ExternalLink, Code2, MoveRight } from "lucide-react";

export default function Profile() {
  const projects = [
    {
      title: "Task Orchestrator",
      description: "A distributed system for managing and executing complex workflows at scale with sub-millisecond latency.",
      tags: ["Go", "Kubernetes", "Redis", "gRPC"],
      link: "#",
      colSpan: "md:col-span-2",
    },
    {
      title: "Echo Visualizer",
      description: "Real-time audio processing and visualization.",
      tags: ["TypeScript", "WebAudio", "Three.js"],
      link: "#",
      colSpan: "md:col-span-1",
    },
    {
      title: "Quantum Ledger",
      description: "Experimental blockchain implementation focusing on post-quantum cryptography resistance.",
      tags: ["Rust", "Wasm", "Cryptography"],
      link: "#",
      colSpan: "md:col-span-1",
    },
    {
      title: "Nexus UI",
      description: "A sleek, accessible, and highly customizable React component library built with Tailwind CSS concepts.",
      tags: ["React", "TailwindCSS", "Framer Motion"],
      link: "#",
      colSpan: "md:col-span-2",
    },
  ];

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-50 selection:bg-indigo-500/30 overflow-hidden font-sans">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-20 animate-blob" style={{ animationDelay: "2s" }}></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 dark:opacity-20 animate-blob" style={{ animationDelay: "4s" }}></div>

      <div className="relative z-10 flex flex-col items-center pt-24 pb-16 px-6 sm:px-12 md:px-24 w-full max-w-7xl mx-auto min-h-screen justify-center">
        
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 text-center max-w-3xl mb-24 mt-12"
        >
          {/* Avatar */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-violet-500 blur-md opacity-60 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative h-40 w-40 rounded-full overflow-hidden border border-white/20 dark:border-white/10 dark:bg-zinc-900 shadow-2xl">
              <Image 
                src="/avatar.png" 
                alt="Lee Boyeon Profile Picture" 
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-linear-to-b from-zinc-900 to-zinc-600 dark:bg-linear-to-br dark:from-white dark:to-zinc-500"
            >
              Lee Boyeon
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-zinc-600 dark:text-zinc-400 font-medium tracking-wide flex items-center justify-center gap-2"
            >
              <Code2 className="w-6 h-6 text-indigo-500" />
              Software Engineer & Creative Technologist
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-zinc-500 dark:text-zinc-400/80 leading-relaxed max-w-2xl mx-auto font-light mt-4"
            >
              Designing and building high-performance systems with a focus on user experience and architectural elegance. Currently exploring the intersection of distributed computing and modern web technologies.
            </motion.p>
          </div>

          {/* Social Links Dock */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 mt-4 p-2 rounded-full glass"
          >
            {[
              { icon: Hash, label: "GitHub" },
              { icon: Globe, label: "LinkedIn" },
              { icon: Mail, label: "Email" }
            ].map((social, idx) => (
              <a
                key={social.label}
                href="#"
                className="p-3.5 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all duration-300"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" strokeWidth={2} />
              </a>
            ))}
          </motion.div>
        </motion.section>

        {/* Projects Section (Bento Grid) */}
        <section className="w-full max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-6 mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-500">Selected Work</h2>
            <div className="h-[1px] flex-1 bg-linear-to-r from-zinc-200 to-transparent dark:from-zinc-800 dark:to-transparent"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
            {projects.map((project, index) => (
              <motion.a
                key={index}
                href={project.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative flex flex-col justify-between p-8 rounded-3xl glass hover:bg-white/40 dark:hover:bg-zinc-900/50 transition-all duration-500 overflow-hidden ${project.colSpan}`}
              >
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/0 via-violet-500/0 to-blue-500/0 group-hover:from-indigo-500/5 group-hover:via-violet-500/5 group-hover:to-blue-500/5 transition-all duration-500"></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <ExternalLink className="w-5 h-5 text-zinc-400 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                  
                  <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-8 flex-grow font-light">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-zinc-200/50 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium backdrop-blur-sm border border-zinc-300/30 dark:border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <a href="#" className="flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-indigo-500 transition-colors group">
              View all projects 
              <MoveRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </section>

        <footer className="mt-32 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50 w-full max-w-5xl text-center flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-500 tracking-wide">
            © {new Date().getFullYear()} Lee Boyeon.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-600">
            Crafted with Next.js, Framer Motion, and Tailwind CSS.
          </p>
        </footer>
      </div>
    </div>
  );
}
