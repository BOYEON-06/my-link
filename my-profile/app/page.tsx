import Image from "next/image";
import { Hash, Globe, Mail, ExternalLink, MoveRight } from "lucide-react";

export default function Profile() {
  const projects = [
    {
      title: "English Learning Assistant",
      description: "2025 광운대학교 공학설계입문 12조 작품",
      tags: ["Python"],
      link: "https://github.com/BOYEON-06/English_Learning_Assistant",
      colSpan: "md:col-span-2",
      colorClass: "neo-box-yellow",
    },
    {
      title: "CSVtransform",
      description: "Arduino 센서로 측정한 값 CSV 파일로 변환",
      tags: ["Python"],
      link: "https://github.com/BOYEON-06/CSVtransform",
      colSpan: "md:col-span-1",
      colorClass: "neo-box-pink",
    },
    {
      title: "ESGWebSite",
      description: "ESG 웹사이트 개발 프로젝트",
      tags: ["Python"],
      link: "https://github.com/BOYEON-06/ESGWebSite",
      colSpan: "md:col-span-1",
      colorClass: "neo-box-green",
    },
    {
      title: "deepfake",
      description: "딥페이크 관련 스터디 및 개발",
      tags: ["Python"],
      link: "https://github.com/BOYEON-06/deepfake",
      colSpan: "md:col-span-2",
      colorClass: "neo-box-blue",
    },
    {
      title: "ShortestPath",
      description: "최단 경로 탐색 알고리즘 구현 실습",
      tags: ["JavaScript"],
      link: "https://github.com/BOYEON-06/ShortestPath",
      colSpan: "md:col-span-1",
      colorClass: "neo-box-orange",
    },
    {
      title: "Spring-STUDY",
      description: "Spring Framework 백엔드 학습",
      tags: ["Java"],
      link: "https://github.com/BOYEON-06/Spring-STUDY",
      colSpan: "md:col-span-2",
      colorClass: "neo-box-yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-black font-sans selection:bg-black selection:text-white pb-24">
      {/* Top Border Accent */}
      <div className="h-4 w-full bg-black border-b-[4px] border-black"></div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-24 pt-12">
        {/* Navigation / Header */}
        <header className="flex justify-between items-center mb-16 border-4 border-black p-4 neo-box bg-white">
          <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap flex items-center">
            <span className="bg-black text-white px-2 py-1 mr-2">&gt;_</span> BOY<span className="text-[var(--color-neo-pink)]">EON</span>
          </div>
          <a href="mailto:contact@example.com" className="neo-btn px-6 py-2 bg-[var(--color-neo-yellow)]">
            Hire Me
          </a>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-12 items-stretch mb-24">
          <div className="flex-1 flex flex-col gap-8">
            <div className="neo-box p-8 md:p-12 bg-white flex flex-col justify-center h-full">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-6">
                Lee <br/>
                <span className="text-transparent" style={{ WebkitTextStroke: "2px black" }}>Boyeon</span>
              </h1>
              <p className="text-xl sm:text-2xl font-bold border-l-8 border-black pl-4 mb-4">
                개발자 이보연 (BOYEON-06)
              </p>
              <p className="text-lg font-medium max-w-xl">
                📍 Republic of Korea (South Korea)<br/>
                Python, JavaScript, Java 등 다양한 기술을 탐구하고 학습하는 개발자입니다. 알고리즘 최적화와 사용자 중심의 백엔드/프론트엔드 시스템 구축에 관심이 많습니다.
              </p>
            </div>
            
            <div className="flex gap-4 flex-wrap">
              <a href="https://github.com/BOYEON-06" target="_blank" rel="noopener noreferrer" className="neo-btn flex-1 py-4 bg-[var(--color-neo-green)] text-lg min-w-[140px]">
                <Hash className="w-6 h-6 mr-2" /> GitHub
              </a>
              <a href="https://velog.io/@2b0yeon" target="_blank" rel="noopener noreferrer" className="neo-btn flex-1 py-4 bg-[var(--color-neo-blue)] text-lg min-w-[140px]">
                <Globe className="w-6 h-6 mr-2" /> Velog
              </a>
            </div>
          </div>
          
          {/* Avatar Area */}
          <div className="w-full lg:w-1/3 flex-shrink-0">
            <div className="neo-box bg-[var(--color-neo-pink)] p-4 h-full flex flex-col items-center justify-center min-h-[400px]">
              <div className="relative w-full aspect-square border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden bg-white">
                <Image
                  src="https://github.com/BOYEON-06.png" 
                  alt="Lee Boyeon Profile Picture"
                  fill
                  priority
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-300"
                  unoptimized={true}
                />
              </div>
              <div className="w-full mt-8 flex items-center justify-between border-4 border-black bg-white p-3 font-bold text-lg shadow-[4px_4px_0px_#000]">
                <span>STATUS:</span>
                <span className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 border-2 border-black rounded-full animate-pulse"></div> ACTIVE</span>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-24">
          <div className="neo-box bg-[var(--color-neo-yellow)] inline-block px-8 py-4 mb-8">
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
              Repositories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(250px,auto)]">
            {projects.map((project, index) => (
              <a
                key={index}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`neo-box ${project.colorClass} p-8 flex flex-col justify-between ${project.colSpan} group`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-3xl font-black tracking-tight border-b-4 border-transparent group-hover:border-black inline-block transition-colors break-words text-ellipsis overflow-hidden">
                      {project.title}
                    </h3>
                    <div className="p-2 border-4 border-black bg-white group-hover:bg-black group-hover:text-white transition-colors ml-4 shrink-0">
                      <ExternalLink className="w-6 h-6 stroke-[3]" />
                    </div>
                  </div>
                  
                  <p className="text-black font-bold text-lg mb-8 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t-4 border-black">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white border-2 border-black text-black text-sm font-bold uppercase shadow-[2px_2px_0px_#000]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-12 flex justify-center">
            <a href="https://github.com/BOYEON-06?tab=repositories" target="_blank" rel="noopener noreferrer" className="neo-btn px-8 py-4 text-xl bg-white group hover:-translate-y-2 hover:translate-x-0 transition-transform">
              View all repositories 
              <MoveRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="neo-box bg-black text-white p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-lg font-bold">
            © {new Date().getFullYear()} LEE BOYEON.
          </p>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-[var(--color-neo-pink)] text-black border-2 border-white font-bold text-sm uppercase shadow-[4px_4px_0px_#fff]">
              Next.js
            </div>
            <div className="px-4 py-2 bg-[var(--color-neo-blue)] text-black border-2 border-white font-bold text-sm uppercase shadow-[4px_4px_0px_#fff]">
              Tailwind V4
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
