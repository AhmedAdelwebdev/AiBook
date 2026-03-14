import { Key, Globe, Terminal, Type, Save, Copy, ClipboardPaste } from 'lucide-react';

export default function SettingsTab({
  settings,
  setSettings,
  saveSettings,
  showToast,
}) {
  return (
    <div className="w-full animate-slide-up pb-8 flex flex-col gap-8">
      {/* Export / Import */}
      <div className="grid grid-cols-2 gap-10">
        <button
          onClick={() => { navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); showToast("تم نسخ الإعدادات"); }}
          className="flex items-center justify-center gap-2 bg-input border border-border py-3 rounded-xl text-text1 font-bold text-base hover:border-accent hover:text-accent transition-all"
        >
          <Copy size={18} />
          <span className='pt-1 sm:pt-0'>تصدير</span>
        </button>
        <button
          onClick={async () => { try { const text = await navigator.clipboard.readText(); const parsed = JSON.parse(text); if (parsed?.GROQ_API_KEY) { setSettings(parsed); localStorage.setItem('recipe_ai_settings', JSON.stringify(parsed)); showToast("تم الاستيراد بنجاح"); } else { showToast("لا يوجد مفتاح Groq"); } } catch (err) { showToast("فشل اللصق"); } }}
          className="flex items-center justify-center gap-2 bg-accent text-body py-3 rounded-xl font-bold text-base hover:brightness-110 transition-all"
        >
          <ClipboardPaste size={18} />
          <span className='pt-1 sm:pt-0'>استيراد</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Access Keys */}
        <section className="space-y-6">
          <div>
            <div className="bg-card rounded-t-xl py-3 px-5">
              <h3 className="text-accent text-base pt-1 sm:pt-0 font-black uppercase tracking-wider">Groq API Key</h3>
            </div>
            <input
              type="text" dir="ltr"
              value={settings.GROQ_API_KEY || ''}
              onChange={e => setSettings(s => ({ ...s, GROQ_API_KEY: e.target.value }))}
              className="w-full px-3 py-3 bg-body border-2 border-card rounded-b-xl text-text2 text-base outline-none focus:border-accent transition-all font-mono"
              placeholder="gsk_••••"
            />
          </div>
          <div>
            <div className="bg-card rounded-t-xl py-3 px-5">
              <h3 className="text-accent text-base pt-1 sm:pt-0 font-black uppercase tracking-wider">Google Client ID</h3>
            </div>
            <input
              type="text" dir="ltr"
              value={settings.GOOGLE_CLIENT_ID || ''}
              onChange={e => setSettings(s => ({ ...s, GOOGLE_CLIENT_ID: e.target.value }))}
              className="w-full px-3 py-3 bg-body border-2 border-card rounded-b-xl text-text2 text-base outline-none focus:border-accent transition-all font-mono"
              placeholder="xxxx.apps.google"
            />
          </div>
        </section>

        {/* Technical */}
        <section className="space-y-6">
          <div>
            <div className="bg-card rounded-t-xl py-3 px-5">
              <h3 className="text-accent text-base pt-1 sm:pt-0 font-black uppercase tracking-wider">كلمة الفصل</h3>
            </div>
            <input
              type="text" dir='ltr'
              value={settings.SPLIT_KEYWORD || ''}
              onChange={e => setSettings(s => ({ ...s, SPLIT_KEYWORD: e.target.value }))}
              className="w-full px-3 py-3 bg-body border-2 border-card rounded-b-xl text-text2 text-base outline-none focus:border-accent transition-all font-mono"
              placeholder="Yasser B4"
            />
          </div>
          <div>
            <div className="bg-card rounded-t-xl py-3 px-5">
              <h3 className="text-accent text-base pt-1 sm:pt-0 font-black uppercase tracking-wider">كود الفصل</h3>
            </div>
            <textarea rows={4} dir="ltr"
              value={settings.SPLIT_CODE || ''}
              onChange={e => setSettings(s => ({ ...s, SPLIT_CODE: e.target.value }))}
              className="w-full px-3 py-3 bg-body border-2 border-card rounded-b-xl text-text2 text-base outline-none focus:border-accent transition-all resize-none font-mono"
              placeholder="Custom logic..."
            />
          </div>
        </section>
      </div>

      {/* System Prompt */}
      <section>
        <div className="bg-card rounded-t-xl px-4 py-3">
          <h3 className="text-accent text-base font-black uppercase tracking-wider">توجيهات الذكاء الاصطناعي</h3>
        </div>
        <textarea rows={6}
          value={settings.SYSTEM_PROMPT || ''}
          onChange={e => setSettings(s => ({ ...s, SYSTEM_PROMPT: e.target.value }))}
          className="w-full px-3 py-3 bg-body text-text2 border-2 border-card rounded-b-xl text-base outline-none focus:border-accent transition-all resize-none leading-relaxed"
          placeholder="أدخل توجيهات النظام..."
        />
      </section>

      {/* Save */}
      <button onClick={saveSettings} className="w-full py-3 bg-accent text-body font-black text-base rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg mt-2">
        <Save size={18} />
        <span className='pt-1 sm:pt-0'>حفظ الإعدادات</span>
      </button>
    </div>
  );
}
