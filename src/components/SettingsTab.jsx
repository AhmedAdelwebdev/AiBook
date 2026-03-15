import { Key, Globe, Terminal, Type, Save, Copy, ClipboardPaste, Cpu, Zap, Settings2 } from 'lucide-react';

const InputWrapper = ({ label, icon: Icon, children, description }) => (
  <div className="flex flex-col gap-3 group">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-accent/10 text-accent group-focus-within:bg-accent group-focus-within:text-body transition-all duration-500">
          <Icon size={16} />
        </div>
        <span className="text-sm font-black text-text1/90 tracking-wide">{label}</span>
      </div>
      {description && <span className="text-xs font-bold text-text3 italic">{description}</span>}
    </div>
    <div className="relative rounded-2xl bg-border overflow-hidden transition-all duration-500 shadow-2xl">
      <div className="bg-body/80 rounded-2xl overflow-hidden border-2 border-border/50">
        {children}
      </div>
    </div>
  </div>
);

export default function SettingsTab({
  settings,
  setSettings,
  saveSettings,
  showToast,
}) {

  return (
    <div className="w-full animate-slide-up pb-24 flex flex-col gap-10 max-w-5xl mx-auto">
      
      {/* Header with Glass Actions */}
      <div className="flex items-center justify-between bg-card/20 p-4 rounded-[2rem] border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3 px-4">
          <Settings2 className="text-accent animate-pulse" size={20} />
          <span className="font-black text-text2 text-sm uppercase tracking-widest">التخصيص المتقدم</span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => { navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); showToast("تم نسخ الإعدادات"); }}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-text2 hover:text-accent transition-all border border-white/5"
            title="تصدير"
          >
            <Copy size={18} />
          </button>
          <button
            onClick={async () => { try { const text = await navigator.clipboard.readText(); const parsed = JSON.parse(text); if (parsed?.GROQ_API_KEY) { setSettings(parsed); localStorage.setItem('recipe_ai_settings', JSON.stringify(parsed)); showToast("تم الاستيراد بنجاح"); } else { showToast("لا يوجد مفتاح Groq"); } } catch (err) { showToast("فشل اللصق"); } }}
            className="p-3 bg-accent/10 hover:bg-accent text-accent hover:text-body rounded-2xl transition-all border border-accent/20"
            title="استيراد"
          >
            <ClipboardPaste size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* API Section */}
        <div className="flex flex-col gap-8">
          <InputWrapper label="Groq Key" icon={Key} description="AI ENGINE">
            <input
              type="text" dir="ltr"
              value={settings.GROQ_API_KEY || ''}
              onChange={e => setSettings(s => ({ ...s, GROQ_API_KEY: e.target.value }))}
              className="w-full px-6 py-4 bg-transparent text-text1 text-base outline-none placeholder:text-text3 font-mono"
              placeholder="gsk_••••"
            />
          </InputWrapper>

          <InputWrapper label="Google Client" icon={Globe} description="CLOUD STORAGE">
            <input
              type="text" dir="ltr"
              value={settings.GOOGLE_CLIENT_ID || ''}
              onChange={e => setSettings(s => ({ ...s, GOOGLE_CLIENT_ID: e.target.value }))}
              className="w-full px-6 py-4 bg-transparent text-text1 text-base outline-none placeholder:text-text3 font-mono"
              placeholder="apps.google.com"
            />
          </InputWrapper>
        </div>

        {/* Technical Section */}
        <div className="flex flex-col gap-8">
          <InputWrapper label="كلمة الفصل" icon={Terminal} description="STRUCTURE">
            <input
              type="text" dir="ltr"
              value={settings.SPLIT_KEYWORD || ''}
              onChange={e => setSettings(s => ({ ...s, SPLIT_KEYWORD: e.target.value }))}
              className="w-full px-6 py-4 bg-transparent text-text1 text-base outline-none placeholder:text-text3"
              placeholder="مثال: يحيى"
            />
          </InputWrapper>

          <InputWrapper label="كود التقسيم" icon={Cpu} description="CUSTOM LOGIC">
            <textarea
              rows={4} dir="ltr"
              value={settings.SPLIT_CODE || ''}
              onChange={e => setSettings(s => ({ ...s, SPLIT_CODE: e.target.value }))}
              className="w-full px-6 py-4 bg-transparent text-text1 text-base outline-none placeholder:text-text3 resize-none font-mono text-sm"
              placeholder="// Write your logic..."
            />
          </InputWrapper>
        </div>
      </div>

      {/* Full Width Section */}
      <InputWrapper label="توجيهات النظام (Prompt)" icon={Type} description="AI INTELLIGENCE">
        <textarea
          rows={6}
          value={settings.SYSTEM_PROMPT || ''}
          onChange={e => setSettings(s => ({ ...s, SYSTEM_PROMPT: e.target.value }))}
          className="w-full px-6 py-6 bg-transparent text-text1 text-base outline-none placeholder:text-text3 leading-relaxed resize-none"
          placeholder="أدخل التعليمات هنا..."
        />
      </InputWrapper>

      {/* Futuristic Save Button */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={saveSettings} 
          className="group relative px-12 py-4 bg-accent text-body font-black text-lg rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(56,189,248,0.2)] hover:shadow-[0_0_60px_rgba(56,189,248,0.4)] transition-all duration-500"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="flex items-center gap-3 relative z-10">
            <Zap size={20} className="fill-current" />
            <span className='pt-1 sm:pt-0'>حفظ الإعدادات</span>
          </div>
        </button>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1s infinite;
        }
      `}</style>
    </div>
  );
}
