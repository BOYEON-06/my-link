export default function Profile() {
  const projects = [
    {
      title: "Task Orchestrator",
      description: "A distributed system for managing and executing complex workflows at scale.",
      tags: ["Go", "Kubernetes", "Redis"],
      link: "#",
    },
    {
      title: "Echo Visualizer",
      description: "Real-time audio processing and visualization using WebAudio API and Three.js.",
      tags: ["TypeScript", "Three.js", "WebAudio"],
      link: "#",
    },
    {
      title: "Quantum Ledger",
      description: "Experimental blockchain implementation focusing on post-quantum cryptography.",
      tags: ["Rust", "Wasm", "Cryptography"],
      link: "#",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="flex flex-1 flex-col items-center py-16 px-6 sm:px-12 md:px-24">
        {/* Profile Header */}
        <section className="flex flex-col items-center gap-6 text-center max-w-2xl mb-16">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 blur-sm opacity-40 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-900">
              <div className="flex items-center justify-center h-full w-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-16 h-16 opacity-20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Lee Boyeon</h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 font-medium">Software Engineer & Creative Technologist</p>
            <p className="text-base text-zinc-500 dark:text-zinc-500 leading-relaxed max-w-lg mx-auto">
              Designing and building high-performance systems with a focus on user experience and architectural elegance. Currently exploring the intersection of distributed computing and modern web technologies.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-4">
            <a
              href="#"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm"
              aria-label="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm"
              aria-label="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a
              href="#"
              className="p-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all shadow-sm"
              aria-label="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
            </a>
          </div>
        </section>

        {/* Projects Section */}
        <section className="w-full max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Featured Projects</h2>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                className="group p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col h-full gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-zinc-200 dark:border-zinc-800 w-full max-w-5xl text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-600">
            © {new Date().getFullYear()} Lee Boyeon. Built with Next.js & Tailwind CSS.
          </p>
        </footer>
      </main>
    </div>
  );
}
