import { ClipboardType, Loader2, ChevronLeft } from 'lucide-react';

export default function Workspace({
  inputText,
  setInputText,
  isProcessing,
  progress,
  statusMessage,
  onSendDirect,
  onPasteAndProcess
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onSendDirect();
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Input area */}
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden focus-within:border-accent transition-all">
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="اكتب القسم الجديد هنا..."
          className="w-full h-[30vh] md:h-[45vh] resize-none px-5 pt-5 pb-20 md:pb-24 text-lg md:text-2xl outline-none placeholder:text-text3 text-text1 bg-transparent leading-relaxed text-right font-medium"
          dir="rtl"
          disabled={isProcessing}
        />
        {/* Send button inside textarea */}
        <div className="absolute bottom-4 right-4">
          <button onClick={() => onSendDirect()}
            disabled={!inputText.trim() || isProcessing}
            className="bg-accent text-body px-5 py-2.5 md:px-6 md:py-3 rounded-xl flex items-center gap-2 font-black text-sm md:text-base shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>إرسال</span>
            <ChevronLeft size={20} />
          </button>
        </div>


        {/* Processing overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-body/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-50">
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-accent" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-text1">{progress}%</div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center px-4">
              <span className="text-accent text-base font-black flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {statusMessage || 'جاري المعالجة...'}
              </span>
              <span className="text-text2 text-sm">يرجى الانتظار</span>
            </div>
          </div>
        )}
      </div>

      {/* Smart paste button */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onPasteAndProcess} disabled={isProcessing}
          className="w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-3 text-text1 transition-all active:scale-[0.99] hover:border-accent justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-body transition-all flex-shrink-0">
            <ClipboardType size={22} />
          </div>
          <span className="text-base font-semibold text-accent">لصق و إرسال إلى AI</span>
          <ChevronLeft size={22} className='text-accent/80' />
        </button>
      </div>
    </div>
  );
}
