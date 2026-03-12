'use client';

export default function Modals({
  resultModal, setResultModal,
  errorModal, setErrorModal,
  showSettings, setShowSettings,
  settings, setSettings,
  onSaveSettings,
  showToast
}) {
  return (
    <>
      {/* نافذة النجاح - تصميم عرضي مطور */}
      {resultModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-3 md:p-6 overflow-hidden">
          <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 animate-slide-up shadow-[0_0_80px_rgba(0,255,166,0.1)] flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
            <div className="p-6 md:p-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.03] to-transparent md:w-[30%] border-b md:border-b-0 md:border-l border-white/5">
              <div className="w-20 h-20 md:w-28 md:h-28 bg-[#00ffa6]/20 rounded-full flex items-center justify-center text-5xl md:text-7xl mb-6 shadow-[0_0_50px_rgba(0,255,166,0.2)] animate-bounce-slow">✨</div>
              <h2 className="text-3xl md:text-4xl font-black text-white text-center leading-tight">مهمة ناجحة</h2>
              <div className="mt-4 px-4 py-2 bg-[#00ffa6] text-black rounded-full font-black text-sm">اكتملت المعالجة</div>
            </div>
            <div className="p-6 md:p-10 flex flex-col flex-grow overflow-hidden">
              <div className="mb-6">
                <p className="text-white/80 text-2xl md:text-3xl font-medium leading-normal">
                  لقد استخرجت <span className="text-[#00ffa6] font-black underline decoration-4 underline-offset-8">{resultModal.count} وصفة</span> ذكية.
                </p>
                <p className="text-white/30 text-lg mt-2 font-medium">تم النشر بنجاح في جدول البيانات الخاص بك.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto mb-8 pr-2 custom-scrollbar flex-grow">
                {resultModal.details.map((name, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 glass rounded-[1.5rem] border border-white/5 group hover:border-[#00ffa6]/40 transition-all bg-white/[0.01]">
                    <div className="w-3 h-3 rounded-full bg-[#00ffa6] shadow-[0_0_10px_rgba(0,255,166,0.5)]" />
                    <span className="text-xl font-bold truncate text-white/90">{name}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setResultModal({ ...resultModal, open: false })} className="w-full py-6 btn-primary rounded-[1.5rem] text-2xl font-black shadow-2xl transition-all active:scale-95">العودة للوحة التحكم</button>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الخطأ */}
      {errorModal.open && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
          <div className="w-full max-w-xl bg-[#0a0a0a] rounded-[3rem] p-8 border border-red-500/20 text-center animate-slide-up shadow-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🛑</div>
            <h2 className="text-4xl font-black text-white mb-4">فشل في المحرك</h2>
            <div className="bg-red-500/5 p-6 rounded-2xl text-red-400 text-xl font-mono text-center mb-8 border border-red-500/10 max-h-48 overflow-auto leading-relaxed">
              {errorModal.message}
            </div>
            <button onClick={() => setErrorModal({ open: false, message: '' })} className="w-full py-6 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl font-black text-2xl transition-all">فهمت المشكلة</button>
          </div>
        </div>
      )}

      {/* لوحة الإعدادات الاحترافية - بناءً على تعديل المستخدم الأخير */}
      {showSettings && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="shrink-0 w-full max-w-7xl mx-auto border-b border-white/8 bg-black/40 backdrop-blur-lg">
            <div className="px-5 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">إعدادات المحرك</h2>
                <div className="mt-2 h-1.5 w-20 bg-[#00ffa6] rounded-full shadow-glow" />
              </div>
              <button onClick={() => setShowSettings(false)} className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-red-600/70 text-white text-xl font-bold transition-colors shadow-md">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12 lg:mb-16">
                <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); showToast("تم نسخ الإعدادات"); }} className="py-6 px-8 bg-white/6 hover:bg-white/12 rounded-2xl text-lg font-semibold tracking-wide border border-white/10 transition-all shadow-sm">نسخ الإعدادات الحالية</button>
                <button onClick={async () => { try { const text = await navigator.clipboard.readText(); const parsed = JSON.parse(text); if (parsed?.GROQ_API_KEY) { setSettings(parsed); localStorage.setItem('recipe_ai_settings', JSON.stringify(parsed)); showToast("تم استيراد الإعدادات بنجاح"); } else { showToast("النص لا يحتوي على مفتاح Groq صالح"); } } catch (err) { showToast("فشل اللصق – تأكد من صحة النص"); } }} className="py-6 px-8 bg-[#00ffa6]/10 hover:bg-[#00ffa6]/20 text-[#00ffa6] rounded-2xl text-lg font-semibold tracking-wide border border-[#00ffa6]/30 transition-all shadow-sm">لصق إعدادات جاهزة</button>
              </div>

              <div className="space-y-16 lg:space-y-20">
                <section>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 pb-3 border-b border-[#00ffa6]/20">بيانات الوصول الأساسية</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-10">
                    <div className="space-y-2">
                      <label className="block text-[#00ffa6] font-medium text-lg">Groq API Key</label>
                      <input type="text" value={settings.GROQ_API_KEY || ''} onChange={e => setSettings(s => ({ ...s, GROQ_API_KEY: e.target.value }))} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:border-[#00ffa6]/60 focus:ring-2 focus:ring-[#00ffa6]/30 outline-none transition-all" placeholder="gsk_..." />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#00ffa6] font-medium text-lg">Google Client ID</label>
                      <input type="text" value={settings.GOOGLE_CLIENT_ID || ''} onChange={e => setSettings(s => ({ ...s, GOOGLE_CLIENT_ID: e.target.value }))} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:border-[#00ffa6]/60 focus:ring-2 focus:ring-[#00ffa6]/30 outline-none transition-all" placeholder="xxxxxxxx.apps.googleusercontent.com" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 pb-3 border-b border-[#0088cc]/20">إشعارات تليجرام</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-10">
                    <div className="space-y-2">
                      <label className="block text-[#0088cc] font-medium text-lg">Bot Token</label>
                      <input type="text" value={settings.TG_BOT_TOKEN || ''} onChange={e => setSettings(s => ({ ...s, TG_BOT_TOKEN: e.target.value }))} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:border-[#0088cc]/60 focus:ring-2 focus:ring-[#0088cc]/30 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[#0088cc] font-medium text-lg">Chat ID</label>
                      <input type="text" value={settings.TG_CHAT_ID || ''} onChange={e => setSettings(s => ({ ...s, TG_CHAT_ID: e.target.value }))} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:border-[#0088cc]/60 focus:ring-2 focus:ring-[#0088cc]/30 outline-none transition-all" />
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 pb-3 border-b border-[#00ffa6]/20">منطق معالجة واستخراج الوصفات</h3>
                  <div className="space-y-10 lg:space-y-12">
                    <div className="space-y-3">
                      <label className="block text-[#00ffa6] font-medium text-lg">System Prompt (توجيهات الـ AI)</label>
                      <textarea value={settings.SYSTEM_PROMPT || ''} onChange={e => setSettings(s => ({ ...s, SYSTEM_PROMPT: e.target.value }))} rows={10} className="w-full px-5 py-4 text-lg sm:text-xl bg-white/5 border border-white/10 rounded-xl font-mono leading-relaxed focus:border-[#00ffa6]/60 focus:ring-2 focus:ring-[#00ffa6]/30 outline-none transition-all resize-y min-h-[180px]" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[#00ffa6] font-medium text-lg">كود التقسيم البرمجي (JavaScript)</label>
                      <textarea value={settings.SPLIT_CODE || ''} onChange={e => setSettings(s => ({ ...s, SPLIT_CODE: e.target.value }))} rows={5} dir="ltr" className="w-full px-5 py-4 text-lg sm:text-xl bg-white/5 border border-white/10 rounded-xl text-sm font-mono leading-normal focus:border-[#00ffa6]/60 focus:ring-2 focus:ring-[#00ffa6]/30 outline-none transition-all resize-y min-h-[180px]" placeholder="// مثال بسيط\nfunction splitRecipes(text) {\n  return text.split('\n\n');\n}" />
                    </div>
                    <div className="max-w-md min-w-full">
                      <label className="block text-white/80 font-medium text-lg mb-2">كلمة الفصل التلقائية</label>
                      <input value={settings.SPLIT_KEYWORD || ''} onChange={e => setSettings(s => ({ ...s, SPLIT_KEYWORD: e.target.value }))} className="min-w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:border-[#00ffa6]/60 focus:ring-2 focus:ring-[#00ffa6]/30 outline-none transition-all" placeholder="مثال: --- أو *****" />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/8 bg-black/60 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-6">
              <button onClick={onSaveSettings} className="w-full py-6 text-2xl font-black rounded-2xl bg-gradient-to-r from-[#00ffa6] to-[#00cc88] hover:from-[#00e695] hover:to-[#00b377] text-black shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-[0.98]">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}