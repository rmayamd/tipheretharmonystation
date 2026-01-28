import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-black flex flex-col items-center justify-center relative overflow-hidden px-6">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-cyan-950/20 blur-[80px] rounded-full" />

      <div className="relative z-10 text-center w-full">
        {/* Tamaño reducido y tracking ajustado para móviles */}
        <h1 className="text-3xl md:text-8xl font-thin tracking-[0.15em] md:tracking-[0.4em] text-white mb-2">
          TIPHERETH
        </h1>
        
        <div className="h-[1px] w-8 bg-cyan-500 mx-auto mb-6 opacity-40" />

        <p className="text-zinc-500 text-[7px] md:text-xs tracking-[0.3em] uppercase font-light mb-12">
          Bioingeniería Estética · Cartagena
        </p>

        <Link href="/maya-bio-mirror">
          <button className="w-full max-w-[240px] py-4 rounded-full border border-white/10 text-white text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-black transition-all backdrop-blur-sm active:scale-95">
            Iniciar Experiencia
          </button>
        </Link>
      </div>
    </main>
  );
}
