'use client';

export default function Header({ onOpenSettings }) {
  return (
    <header className="w-full max-w-7xl flex justify-between items-center px-6 py-8 md:py-12">
      <div className="group cursor-default">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-2">
          وصفات <span className="bg-[#00ffa6] text-black px-3 py-1 rounded-xl skew-x-[-10deg] inline-block shadow-lg">AI</span>
        </h1>
        <div className="h-1 w-full bg-[#00ffa6] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-right mt-2" />
      </div>
      
      <button 
        onClick={onOpenSettings}
        className="w-14 h-14 rounded-[1.5rem] glass flex items-center justify-center hover:bg-white/10 transition-all active:scale-90 shadow-xl border border-white/10"
      >
        <span className="text-2xl">⚙️</span>
      </button>
    </header>
  );
}
