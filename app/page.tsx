import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-cyan-950/30 blur-[100px] rounded-full" />

      <div className="relative z-10 text-center w-full max-w-sm md:max-w-none">
        <h1 className="text-5xl md:text-9xl font-extralight tracking-[0.3em] text-white mb-4">
          TIPHERETH
        </h1>
        
        <div className="h-[1px] w-16 bg-cyan-500 mx-auto mb-6 opacity-60" />

        <p className="text-zinc-500 text-[9px] md:text-xs tracking-[0.4em] uppercase font-light leading-relaxed mb-12 px-4">
          Bioingeniería Estética <br className="md:hidden" /> Neuroestética Avanzada <br className="md:hidden" /> Cartagena
        </p>

        <Link href="/maya-bio-mirror">
          <button className="w-full md:w-auto px-10 py-5 rounded-full border border-white/20 text-white text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm active:scale-95">
            Iniciar Bio-Mirror
          </button>
        </Link>
      </div>
    </main>
  );
}
