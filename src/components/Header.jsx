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
            <button onClick={onAuthenticate} className="flex items-center gap-3 px-5 py-2 bg-card text-accent border border-border rounded-full font-bold text-base shadow-sm hover:scale-105 transition-all active:scale-95">
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
                <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.712s.102-1.173.282-1.712V4.956H.957A8.998 8.998 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.017.957 4.956L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
              </svg>
              <span className="pt-1 sm:pt-0">Sign in</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-error/5 text-error border border-error/20 rounded-xl font-bold text-sm hover:bg-error hover:text-white transition-all active:scale-95"
              >
                <LogOut size={16} />
                <span>خروج</span>
              </button>

              <div className="bg-accent/10 text-accent px-3 py-1.5 rounded-xl font-bold text-xs border border-accent/20 flex items-center gap-1.5 hidden sm:flex">
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
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'home' ? 'text-accent' : 'text-text2 hover:text-text1'}`}
          >
            <Home size={16} />
            <span>الرئيسية</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'text-accent' : 'text-text2 hover:text-text1'}`}
          >
            <Settings size={16} />
            <span>الإعدادات</span>
          </button>
        </nav>

        <h1 className="text-3xl md:text-4xl mt-2 font-black flex items-center gap-0.5 select-none">
          <span className="text-text1">Book</span>
          <span className="text-accent">AI</span>
        </h1>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b-none border-t border-border/40 flex">
        <button onClick={() => setActiveTab('home')}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${activeTab === 'home' ? 'text-accent' : 'text-text2'}`}
        >
          {activeTab === 'home' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-accent" />}
          <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 1.8} />
          <span className="text-xs font-bold">الرئيسية</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${activeTab === 'settings' ? 'text-accent' : 'text-text2'}`}
        >
          {activeTab === 'settings' && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-0.5 rounded-full bg-accent" />}
          <Settings size={22} strokeWidth={activeTab === 'settings' ? 2.5 : 1.8} />
          <span className="text-xs font-bold">الإعدادات</span>
        </button>
      </nav>
    </>
  );
}
