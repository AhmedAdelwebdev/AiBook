'use client';

export default function Header({ onOpenSettings }) {
  return (
    <header className="w-full max-w-7xl flex justify-between items-center px-6 py-8 md:py-12">
      <button onClick={onOpenSettings}
        className="px-4 py-2 text-2xl tracking-tight text-center rounded-[1.5rem] glass hover:bg-white/10 transition-all active:scale-90 shadow-xl border border-white/10"
      > 
        <span> الاعدادات </span>
      </button>
      
      <div className="group cursor-default">
        <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-2">
          Book <span className="text-[#00ffa6] shadow-sm">AI</span>
        </h1>
      </div>
    </header>
  );
}
