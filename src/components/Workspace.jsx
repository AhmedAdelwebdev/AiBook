import { ClipboardType, Loader2, ChevronLeft } from 'lucide-react';

export default function Workspace({
  inputText,
  setInputText,
  isProcessing,
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
      </div>

      {/* Smart paste button */}
      <div className="flex flex-col gap-1">
        <button
          onClick={onPasteAndProcess} disabled={isProcessing}
          className="w-full p-4 bg-card border border-border rounded-2xl flex items-center gap-3 text-text1 transition-all active:scale-[0.99] hover:border-accent justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-12 h-12 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center transition-all flex-shrink-0">
            <ClipboardType size={24} />
          </div>
          <span className="text-base font-semibold text-accent">لصق و إرسال إلى AI</span>
          <ChevronLeft size={24} className='text-accent/80' />
        </button>
      </div>
    </div>
  );
}
