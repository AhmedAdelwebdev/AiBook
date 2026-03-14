'use client';

import { CheckCheck } from "lucide-react";

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
      {/* نافذة النجاح */}
      {resultModal.open && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/90 backdrop-blur-3xl"
          onClick={(e) => { if (e.target === e.currentTarget) setResultModal({ ...resultModal, open: false }) }}
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setResultModal({ ...resultModal, open: false }) }}
          >
            <div className="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 animate-slide-up shadow-[0_0_80px_rgba(0,255,166,0.05)] flex flex-col md:flex-row overflow-hidden">
              <div className="p-6 md:p-10 flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.03] to-transparent shrink-0 md:w-[30%] border-b md:border-b-0 md:border-l border-white/5">
                <div className="w-16 h-16 md:w-28 md:h-28 bg-accent/15 rounded-full flex items-center justify-center text-4xl md:text-7xl mb-4 md:mb-6 animate-bounce-slow">
                  <CheckCheck size={60} className="text-accent" />
                </div>
                <div className="px-3 py-1.5 md:px-4 md:py-2 bg-accent text-body rounded-full font-black text-xs md:text-sm">
                  اكتملت المعالجة
                </div>
                <h2 className="mt-3 md:mt-4 text-2xl md:text-3xl lg:text-4xl font-black text-white text-center leading-tight">
                  مهمة ناجحة
                </h2>
              </div>
              <div className="p-5 md:p-10 flex flex-col flex-1">
                <div className="mb-4 md:mb-6 shrink-0">
                  <p className="text-text1 text-lg sm:text-2xl lg:text-3xl font-medium leading-normal">
                    لقد استخرجت <span className="text-accent font-black">{resultModal.count} وصفة</span>
                  </p>
                  <p className="text-text2 text-xs sm:text-lg mt-1 sm:mt-2 font-medium">تم النشر بنجاح في جدول البيانات الخاص بك</p>

                  {resultModal.totalRows > 0 && (
                    <div className="mt-4 p-3 sm:p-4 bg-accent/5 rounded-2xl border border-accent/20 flex items-center justify-between">
                      <span className="text-text2 text-xs sm:text-base">إجمالي الصفوف في الشيت الآن</span>
                      <span className="text-accent text-lg sm:text-2xl font-black">{resultModal.totalRows}</span>
                    </div>
                  )}
                </div>
                {/* تم تعديل التمرير التلقائي ووضع حد أقصى للحماية من التمدد اللانهائي */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 overflow-y-auto custom-scrollbar max-h-[40vh] mb-5 md:mb-8 pr-1 md:pr-2">
                  {resultModal.details.map((name, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 sm:p-5 glass rounded-xl sm:rounded-[1.5rem] border border-white/5 group hover:border-accent/40 transition-all bg-white/[0.01]">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-accent shrink-0" />
                      <span className="text-sm sm:text-xl font-bold truncate text-text2">{name}</span>
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
              <div className="bg-red-500/5 p-4 sm:p-6 rounded-2xl text-red-400 text-sm sm:text-xl  text-center mb-8 border border-red-500/10 max-h-48 overflow-y-auto leading-relaxed custom-scrollbar">
                {errorModal.message}
              </div>
              <button onClick={() => setErrorModal({ open: false, message: '' })} className="w-full py-4 sm:py-6 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl font-black text-xl sm:text-2xl transition-all">فهمت المشكلة</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}