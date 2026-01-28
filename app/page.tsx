import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-black flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[250px] h-[250px] bg-cyan-950/30 blur-[80px] rounded-full" />

      <div className="relative z-10 text-center w-full">
        {/* Ajuste de tamaño: text-4xl en móvil, text-8xl en PC */}
        <h1 className="text-4xl md:text-8xl font-extralight tracking-[0.2em] md:tracking-[0.4em] text-white mb-4">
          TIPHERETH
        </h1>
        
        <div className="h-[1px] w-12 bg-cyan-500 mx-auto mb-6 opacity-60" />

        <p className="text-zinc-500 text-[8px] md:text-xs tracking-[0.3em] uppercase font-light leading-relaxed mb-12 px-2">
          Bioingeniería Estética · Cartagena
        </p>

        <Link href="/maya-bio-mirror">
          <button className="w-full max-w-[260px] py-5 rounded-full border border-white/20 text-white text-[9px] tracking-[0.3em] uppercase font-bold hover:bg-white hover:text-black transition-all duration-500 backdrop-blur-sm active:scale-95">
            Iniciar Experiencia
          </button>
        </Link>
      </div>
    </main>
  );
}
