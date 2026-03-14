import { Home, Settings, LogOut, ShieldCheck, User } from 'lucide-react';

export default function Header({ 
  googleAccessToken, 
  onAuthenticate, 
  activeTab, 
  setActiveTab,
  onSignOut 
}) {
  return (
    <>
      {/* Top bar */}
      <header className="w-full flex justify-between items-center p-6 pb-4 md:py-4 px-1">
        {/* Auth */}
        <div className="flex items-center gap-2">
          {!googleAccessToken ? (
            <button onClick={onAuthenticate} className="bg-accent/10 text-accent p-3 md:px-4 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all font-bold text-sm shadow">
              <User size={20} />
              <span className="hidden sm:block">تسجيل الدخول</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={onSignOut} title="تسجيل الخروج"
                className="p-2 text-error bg-error/10 border border-error/20 rounded-xl hover:bg-error hover:text-white transition-all"
              >
                <LogOut size={18} />
              </button>

              <div className="bg-accent/10 text-accent px-3 py-1.5 rounded-xl font-bold text-sm border border-accent/20 flex items-center gap-1.5 hidden sm:flex">
                <ShieldCheck size={14} />
                <span>متصل</span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop nav - center */}
        <nav className="hidden md:flex items-center">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'home' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Home size={16} />
            <span>الرئيسية</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'text-accent' : 'text-text-secondary hover:text-text-primary'}`}
          >
            <Settings size={16} />
            <span>الإعدادات</span>
          </button>
        </nav>
        
        <h1 className="text-3xl md:text-4xl mt-2 font-black flex items-center gap-0.5 select-none">
          <span className="text-text-primary">Book</span>
          <span className="text-accent">AI</span>
        </h1>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-card/95 backdrop-blur-md border-b-none border-t border-border/40 flex">
        <button onClick={() => setActiveTab('home')} 
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${activeTab === 'home' ? 'text-accent' : 'text-text-secondary'}`}
        >
          {activeTab === 'home' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-accent" />}
          <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />
          <span className="text-xs font-bold">الرئيسية</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')} 
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${activeTab === 'settings' ? 'text-accent' : 'text-text-secondary'}`}
        >
          {activeTab === 'settings' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-accent" />}
          <Settings size={22} strokeWidth={activeTab === 'settings' ? 2.5 : 1.8} />
          <span className="text-xs font-bold">الإعدادات</span>
        </button>
      </nav>
    </>
  );
}
