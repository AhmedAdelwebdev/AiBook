'use client';

export default function Workspace({ 
  inputText, 
  setInputText, 
  isAutoPilot, 
  isProcessing, 
  progress,
  statusMessage
}) {
  return (
    <div className="relative group mt-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-[#00ffa6]/5 to-transparent blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
      
      <div className="relative overflow-hidden rounded-[2rem] shadow-xl border border-white/5">
        <textarea 
          value={inputText} 
          onChange={e => setInputText(e.target.value)}
          placeholder={isAutoPilot ? "الطيار الآلي نشط: بانتظار رسائل تليجرام..." : "الصق نص الوصفات هنا..."}
          className={`w-full h-[30vh] min-h-32 glass-dark p-8 md:p-10 text-xl md:text-2xl font-medium leading-relaxed outline-none transition-all resize-none placeholder:text-white/5 ${isAutoPilot ? 'border-2 border-dashed border-[#00ffa6]/20' : 'focus:border-[#00ffa6]/10'}`}
          dir="rtl"
          disabled={isProcessing || isAutoPilot}
        />
        
        {isAutoPilot && (
          <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full glass bg-[#00ffa6]/5 border-[#00ffa6]/10 shadow-lg animate-in fade-in slide-in-from-left">
            <span className="w-2 h-2 rounded-full bg-[#00ffa6] animate-ping" />
            <span className="text-[#00ffa6] text-[10px] font-black tracking-widest uppercase">الطيار الآلي نشط</span>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-row items-center justify-center gap-8 px-10 z-50 animate-in fade-in duration-300">
            {/* Progress Circle - Smaller for Compact View */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * progress) / 100} className="text-[#00ffa6] transition-all duration-700 ease-out" strokeLinecap="round" />
              </svg>
              <div className="text-xl font-black text-white">{progress}%</div>
            </div>
            
            <div className="flex flex-col text-right">
              <span className="text-[#00ffa6] font-black text-lg mb-1 animate-pulse">
                {statusMessage || 'جاري المعالجة...'}
              </span>
              <p className="text-white/30 text-sm font-medium">
                يرجى الانتظار، يتم تنظيم البيانات الآن.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
