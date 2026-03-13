'use client';

export default function Workspace({ 
  inputText, 
  setInputText, 
  isAutoPilot, 
  setIsAutoPilot,
  isProcessing, 
  progress,
  statusMessage,
  onProcess
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim() && !isProcessing && !isAutoPilot) {
        onProcess();
      }
    }
  };

  return (
    <div className="relative group mt-2">
      <div className="absolute -inset-2 bg-gradient-to-r from-accent/5 to-transparent blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
      
      <div className="relative glass-dark overflow-hidden rounded-[2rem] shadow-xl border border-white/5">
        <textarea 
          value={inputText} 
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isAutoPilot ? "الطيار الآلي نشط: بانتظار رسائل تليجرام..." : "الصق نص الوصفات هنا..."}
          className={`w-full h-[40vh] min-h-42 p-8 md:p-10 text-xl md:text-2xl font-medium  outline-none placeholder:text-white/20 ${isAutoPilot ? 'border-2 border-dashed border-accent/20' : 'focus:border-accent/10'}`}
          dir="rtl"
          disabled={isProcessing || isAutoPilot}
        />
        
        <button 
          onClick={() => setIsAutoPilot(!isAutoPilot)}
          className={`absolute bottom-6 left-6 px-5 py-3 text-md! rounded-full flex items-center gap-3 transition-all font-black text-[10px] tracking-widest uppercase shadow-2xl z-20 ${isAutoPilot ? 'bg-accent/10 text-accent border-accent' : 'glass text-gray-400 hover:text-accent'}`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isAutoPilot ? 'bg-accent animate-pulse' : 'bg-white/40'}`} />
          الطيار الآلي {isAutoPilot ? 'نشط' : 'متوقف'}
        </button>

        {isProcessing && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-row items-center justify-center gap-8 px-10 z-50 animate-in fade-in duration-300">
            {/* Progress Circle - Smaller for Compact View */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" className="text-white/5" />
                <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="264" strokeDashoffset={264 - (264 * progress) / 100} className="text-accent transition-all duration-700 ease-out" strokeLinecap="round" />
              </svg>
              <div className="text-xl font-black text-white">{progress}%</div>
            </div>
            
            <div className="flex flex-col text-right">
              <span className="text-accent font-black text-lg mb-1 animate-pulse">
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
