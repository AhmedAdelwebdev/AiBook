'use client';

export default function Modals({
  resultModal, setResultModal,
  errorModal, setErrorModal,
  showSettings, setShowSettings,
  settings, setSettings,
  onSaveSettings,
  showToast,
  onSignOut
}) {
  return (
    <>
      {/* نافذة النجاح - تصميم عرضي مطور */}
      {resultModal.open && (
        <div 
          className="fixed inset-0 z-[200] overflow-y-auto bg-black/90 backdrop-blur-3xl"
          onClick={(e) => { if (e.target === e.currentTarget) setResultModal({ ...resultModal, open: false }) }}
        >
          <div 
            className="flex min-h-full items-center justify-center p-4 sm:p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setResultModal({ ...resultModal, open: false }) }}
          >
            <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 animate-slide-up shadow-[0_0_80px_rgba(0,255,166,0.1)] flex flex-col md:flex-row overflow-hidden">
              <div className="p-6 md:p-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.03] to-transparent shrink-0 md:w-[30%] border-b md:border-b-0 md:border-l border-white/5">
                <div className="w-16 h-16 md:w-28 md:h-28 bg-[#00ffa6]/20 rounded-full flex items-center justify-center text-4xl md:text-7xl mb-4 md:mb-6 shadow-[0_0_50px_rgba(0,255,166,0.2)] animate-bounce-slow">✨</div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white text-center leading-tight">مهمة ناجحة</h2>
                <div className="mt-3 md:mt-4 px-3 py-1.5 md:px-4 md:py-2 bg-[#00ffa6] text-black rounded-full font-black text-xs md:text-sm">اكتملت المعالجة</div>
              </div>
              <div className="p-5 md:p-10 flex flex-col flex-1">
                <div className="mb-4 md:mb-6 shrink-0">
                  <p className="text-white/80 text-lg sm:text-2xl lg:text-3xl font-medium leading-normal">
                    لقد استخرجت <span className="text-[#00ffa6] font-black underline decoration-2 sm:decoration-4 underline-offset-4 sm:underline-offset-8">{resultModal.count} وصفة</span> ذكية.
                  </p>
                  <p className="text-white/30 text-xs sm:text-lg mt-1 sm:mt-2 font-medium">تم النشر بنجاح في جدول البيانات الخاص بك.</p>
                </div>
                {/* تم تعديل التمرير التلقائي ووضع حد أقصى للحماية من التمدد اللانهائي */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto custom-scrollbar max-h-[40vh] mb-5 md:mb-8 pr-1 md:pr-2">
                  {resultModal.details.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 sm:p-5 glass rounded-xl sm:rounded-[1.5rem] border border-white/5 group hover:border-[#00ffa6]/40 transition-all bg-white/[0.01]">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#00ffa6] shrink-0 shadow-[0_0_10px_rgba(0,255,166,0.5)]" />
                      <span className="text-sm sm:text-xl font-bold truncate text-white/90">{name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => setResultModal({ ...resultModal, open: false })} className="w-full mt-auto shrink-0 py-3 sm:py-6 btn-primary rounded-xl sm:rounded-[1.5rem] text-lg sm:text-2xl font-black shadow-2xl transition-all active:scale-95">العودة للوحة التحكم</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* نافذة الخطأ */}
      {errorModal.open && (
        <div 
          className="fixed inset-0 z-[250] overflow-y-auto bg-black/95 backdrop-blur-3xl"
          onClick={(e) => { if (e.target === e.currentTarget) setErrorModal({ open: false, message: '' }) }}
        >
          <div 
             className="flex min-h-full items-center justify-center p-4"
             onClick={(e) => { if (e.target === e.currentTarget) setErrorModal({ open: false, message: '' }) }}
          >
            <div className="w-full max-w-xl bg-[#0a0a0a] rounded-[3rem] p-8 border border-red-500/20 text-center animate-slide-up shadow-2xl">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-5xl mx-auto mb-6">🛑</div>
              <h2 className="text-4xl font-black text-white mb-4">فشل في المحرك</h2>
              <div className="bg-red-500/5 p-4 sm:p-6 rounded-2xl text-red-400 text-sm sm:text-xl font-mono text-center mb-8 border border-red-500/10 max-h-48 overflow-y-auto leading-relaxed custom-scrollbar">
                {errorModal.message}
              </div>
              <button onClick={() => setErrorModal({ open: false, message: '' })} className="w-full py-4 sm:py-6 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl font-black text-xl sm:text-2xl transition-all">فهمت المشكلة</button>
            </div>
          </div>
        </div>
      )}

      {/* لوحة الإعدادات الاحترافية */}
      {showSettings && (
        <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-xl flex flex-col"
          onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false) }}
        >
          <div className="shrink-0 w-full max-w-7xl mx-auto border-b border-white/8 bg-black/40 backdrop-blur-lg">
            <div className="px-5 sm:px-8 lg:px-12 py-3 flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight whitespace-nowrap">إعدادات المحرك</h2>
                <div className="mt-2 h-1 w-16 bg-[#00ffa6] rounded-full shadow-glow" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={onSignOut} className="text-sm font-bold opacity-60 hover:text-red-500 duration-200 mx-4">تسجيل الخروج</button>
                
                <button onClick={() => setShowSettings(false)} className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-red-600/70 text-white text-xl font-bold transition-colors shadow-md">✕</button>
              </div>
            </div>
          </div>

          <div 
             className="flex-1 overflow-y-auto"
             onClick={(e) => { if (e.target === e.currentTarget) setShowSettings(false) }}
          >
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

          {/* Fixed Bottom Action Bar */}
          <div className="shrink-0 border-t border-white/8 bg-black/60 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4">
              <button onClick={onSaveSettings} className="w-full py-4 text-2xl font-black rounded-2xl bg-gradient-to-r from-[#00ffa6] to-[#00cc88] hover:from-[#00e695] hover:to-[#00b377] text-black shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-[0.98]">حفظ التغييرات</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}