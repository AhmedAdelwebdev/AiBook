import { Send, ClipboardPlus } from 'lucide-react';

export default function Workspace({ 
  inputText, 
  setInputText, 
  directInputText,
  setDirectInputText,
  isProcessing, 
  progress,
  statusMessage,
  onProcess,
  onSendDirect,
  onPasteAndSendDirect
}) {
  const handleKeyDown = (e) => {
    // Only trigger processing on Enter for desktop screens (width > 768)
    if (e.key === 'Enter' && !e.shiftKey && typeof window !== 'undefined' && window.innerWidth > 768) {
      e.preventDefault();
      if (inputText.trim() && !isProcessing) {
        onProcess();
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-2">
      <div className="relative group">
        <div className="absolute -inset-2 bg-gradient-to-r from-accent/5 to-transparent blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <div className="relative glass-dark overflow-hidden rounded-[2rem] shadow-xl border border-white/5">
          <textarea 
            value={inputText} 
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="الصق نص الوصفات هنا..."
            className="w-full h-[35vh] resize-none min-h-42 p-8 md:p-10 text-xl md:text-2xl font-medium outline-none placeholder:text-white/20 focus:border-accent/10"
            dir="rtl"
            disabled={isProcessing}
          />

          {isProcessing && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl flex flex-row items-center justify-center gap-8 px-10 z-50 animate-in fade-in duration-300">
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

      {/* Direct Send Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        <div className="md:col-span-9 glass rounded-[1.5rem] p-1.5 flex items-center gap-2 border border-white/5 shadow-lg group focus-within:border-[#00ffa6]/30 transition-all">
          <input 
            type="text" 
            value={directInputText}
            onChange={e => setDirectInputText(e.target.value)}
            placeholder="أدخل نصاً للإرسال المباشر (أول عمود فقط)..."
            className="flex-1 bg-transparent px-6 py-4 outline-none text-white text-lg font-medium"
            dir="rtl"
          />
          <button 
            onClick={onPasteAndSendDirect}
            className="p-4 hover:bg-[#00ffa6]/10 rounded-2xl text-[#00ffa6] transition-all group-hover:scale-110 active:scale-90"
            title="لصق وإرسال فوري"
          >
            <ClipboardPlus size={28} />
          </button>
        </div>
        
        <button 
          onClick={() => onSendDirect()}
          disabled={!directInputText.trim() || isProcessing}
          className="md:col-span-3 h-full py-4 bg-white/5 hover:bg-white/10 rounded-[1.5rem] flex items-center justify-center gap-3 text-white font-black text-lg border border-white/10 transition-all active:scale-95 disabled:opacity-20 shadow-xl"
        >
          <span>إرسال مباشر</span>
          <Send size={24} className="text-[#00ffa6]" />
        </button>
      </div>
    </div>
  );
}
