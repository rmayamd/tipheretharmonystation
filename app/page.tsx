import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative px-6">
      {/* Glow de fondo (Efecto Tiphereth) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-thin tracking-[0.3em] text-white">
          TIPHERETH
        </h1>
        <div className="h-[1px] w-24 bg-cyan-500 mx-auto" />
        <p className="text-cyan-400 text-xs md:text-sm tracking-[0.5em] uppercase font-light">
          Bioingeniería Estética · Cartagena
        </p>

        <div className="pt-12">
          <Link href="/maya-bio-mirror">
            <button className="px-12 py-5 border border-white/20 rounded-full text-white tracking-[0.3em] uppercase text-[10px] hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-md">
              Iniciar Experiencia Bio-Mirror
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
