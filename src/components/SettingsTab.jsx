import { Key, Globe, Terminal, Type, Save, Copy, ClipboardPaste } from 'lucide-react';

export default function SettingsTab({
  settings,
  setSettings,
  saveSettings,
  showToast,
}) {
  return (
    <div className="w-full animate-slide-up pb-4 flex flex-col gap-4">
      {/* Export / Import */}
      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => { navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); showToast("تم نسخ الإعدادات"); }}
          className="flex items-center justify-center gap-2 bg-bg-input border border-border py-3 rounded-xl text-text-primary font-bold text-sm hover:border-accent hover:text-accent transition-all"
        >
          <Copy size={16} />
          <span>تصدير الإعدادات</span>
        </button>
        <button 
          onClick={async () => { try { const text = await navigator.clipboard.readText(); const parsed = JSON.parse(text); if (parsed?.GROQ_API_KEY) { setSettings(parsed); localStorage.setItem('recipe_ai_settings', JSON.stringify(parsed)); showToast("تم الاستيراد بنجاح"); } else { showToast("لا يوجد مفتاح Groq"); } } catch (err) { showToast("فشل اللصق"); } }}
          className="flex items-center justify-center gap-2 bg-accent-2 text-bg-main py-3 rounded-xl font-bold text-sm hover:brightness-110 transition-all"
        >
          <ClipboardPaste size={16} />
          <span>استيراد إعدادات</span>
        </button>
      </div>

      {/* Access Keys */}
      <section className="rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-accent/5 border-b border-border">
          <Key size={15} className="text-accent" />
          <h3 className="text-accent text-sm font-black tracking-wide">بيانات الوصول</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">Groq API Key</label>
            <input 
              type="password" 
              value={settings.GROQ_API_KEY || ''} 
              onChange={e => setSettings(s => ({ ...s, GROQ_API_KEY: e.target.value }))} 
              className="w-full px-4 py-3 bg-bg-main border border-border rounded-xl text-text-secondary text-sm outline-none focus:border-accent transition-all font-mono tracking-wider" 
              placeholder="gsk_••••••••••••••••" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">Google Client ID</label>
            <input 
              type="text" 
              value={settings.GOOGLE_CLIENT_ID || ''} 
              onChange={e => setSettings(s => ({ ...s, GOOGLE_CLIENT_ID: e.target.value }))} 
              className="w-full px-4 py-3 bg-bg-main border border-border rounded-xl text-text-secondary text-sm outline-none focus:border-accent transition-all font-mono text-left" 
              placeholder="xxxx.apps.googleusercontent.com" 
            />
          </div>
        </div>
      </section>

      {/* System Prompt */}
      <section className="rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-accent/5 border-b border-border">
          <Globe size={15} className="text-accent" />
          <h3 className="text-accent text-sm font-black tracking-wide">توجيهات الذكاء الاصطناعي</h3>
        </div>
        <div className="p-5 space-y-1.5">
          <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">System Prompt</label>
          <textarea 
            value={settings.SYSTEM_PROMPT || ''} 
            onChange={e => setSettings(s => ({ ...s, SYSTEM_PROMPT: e.target.value }))} 
            rows={7}
            className="w-full px-4 py-3 bg-bg-main text-text-secondary border border-border rounded-xl text-sm outline-none focus:border-accent transition-all resize-none leading-relaxed" 
            placeholder="أدخل توجيهات النظام هنا..."
          />
        </div>
      </section>

      {/* Technical */}
      <section className="rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-accent/5 border-b border-border">
          <Terminal size={15} className="text-accent" />
          <h3 className="text-accent text-sm font-black tracking-wide">إعدادات تقنية</h3>
        </div>
        <div className="p-5 grid grid-cols-1 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs text-text-secondary font-bold uppercase tracking-wider">Split Code</label>
            <textarea 
              value={settings.SPLIT_CODE || ''} 
              onChange={e => setSettings(s => ({ ...s, SPLIT_CODE: e.target.value }))} 
              rows={6} 
              dir="ltr"
              className="w-full px-4 py-3 bg-bg-main border border-border rounded-xl text-text-secondary text-xs outline-none focus:border-accent transition-all resize-none font-mono" 
              placeholder="function splitData(input) { ... }"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-text-secondary text-xs font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5"><Type size={12} />Split Text</span>
            </label>
            <input 
              type="text" dir='ltr' 
              value={settings.SPLIT_KEYWORD || ''} 
              onChange={e => setSettings(s => ({ ...s, SPLIT_KEYWORD: e.target.value }))} 
              className="w-full px-4 py-3 bg-bg-main border border-border rounded-xl text-text-secondary text-sm outline-none focus:border-accent transition-all font-mono" 
              placeholder="SPLIT" 
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <button 
        onClick={saveSettings} 
        className="w-full py-3.5 bg-accent-2 text-bg-main font-black text-sm rounded-2xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        <Save size={18} />
        <span>حفظ التغييرات</span>
      </button>
    </div>
  );
}
