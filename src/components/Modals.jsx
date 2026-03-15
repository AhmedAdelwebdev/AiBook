'use client';

import { CheckCheck, AlertCircle } from "lucide-react";

export default function Modals({
  resultModal, setResultModal,
  errorModal, setErrorModal
}) {
  return (
    <>
      {/* Success Modal */}
      {resultModal.open && (
        <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/40 backdrop-blur-xl px-4 py-10 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) setResultModal({ ...resultModal, open: false }) }}
        >
          <div className="relative w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] overflow-hidden animate-slide-up shadow-[0_30px_70px_rgba(0,0,0,0.5)] flex flex-col pointer-events-auto">
            
            {/* Header Area */}
            <div className="p-6 pb-2 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/20">
                  <CheckCheck size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white leading-none">اكتملت المعالجة</h2>
                  <p className="text-text2 text-[10px] uppercase tracking-widest mt-1 opacity-70">Success Operation</p>
                </div>
              </div>
              <button 
                onClick={() => setResultModal({ ...resultModal, open: false })}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-white/40 hover:text-white"
              >✕</button>
            </div>

            {/* Content Area */}
            <div className="p-6 flex flex-col gap-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                  <span className="text-3xl font-black text-accent">{resultModal.count}</span>
                  <span className="text-xs font-bold text-text2 opacity-60">وصفة جديدة</span>
                </div>
                {resultModal.totalRows > 0 && (
                  <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center">
                    <span className="text-3xl font-black text-white">{resultModal.totalRows}</span>
                    <span className="text-xs font-bold text-text2 opacity-60">إجمالي الشيت</span>
                  </div>
                )}
              </div>

              {/* List Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[10px] font-black text-text3 uppercase tracking-[0.2em] px-1">القائمة المستخرجة</h3>
                <div className="max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar no-scrollbar flex flex-col gap-2">
                  {resultModal.details.map((name, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/[0.02] border border-border/10 rounded-xl hover:bg-accent/5 transition-all group">
                      <div className="flex items-center gap-3 truncate">
                         <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent" />
                         <span className="text-sm font-bold text-text2 group-hover:text-white transition-colors truncate">{name || 'وصفة غير مسمى'}</span>
                      </div>
                      <span className="text-[10px] text-text3 font-mono">#{(i+1).toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button 
                onClick={() => setResultModal({ ...resultModal, open: false })} 
                className="w-full py-4 bg-accent text-body rounded-2xl text-base font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all"
              >
                عرض اللوحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 z-[250] bg-black/40 backdrop-blur-xl flex items-center justify-center p-4 py-10"
          onClick={(e) => { if (e.target === e.currentTarget) setErrorModal({ open: false, message: '' }) }}
        >
          <div className="w-full max-w-md bg-white/[0.05] backdrop-blur-3xl rounded-[2rem] border border-error/20 animate-slide-up shadow-2xl relative overflow-hidden flex flex-col">
            <div className="p-6 pb-2 flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center border border-error/20">
                <AlertCircle size={20} className="text-error" />
              </div>
              <h2 className="text-xl font-black text-white">تنبيه النظام</h2>
            </div>
            
            <div className="p-6">
              <div className="bg-error/5 p-5 rounded-2xl text-error text-sm font-bold leading-relaxed border border-error/10 mb-6 max-h-48 overflow-y-auto no-scrollbar">
                {errorModal.message}
              </div>

              <button 
                onClick={() => setErrorModal({ open: false, message: '' })} 
                className="w-full py-4 bg-white/5 hover:bg-error/10 text-text1 hover:text-error rounded-2xl font-black text-base transition-all border border-white/5"
              >
                فهمت، سأحاول مجدداً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}