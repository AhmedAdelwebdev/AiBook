import { ClipboardPaste } from 'lucide-react';

export default function ConnectionPanel({ 
  googleAccessToken, 
  onAuthenticate, 
  selectedSheetId, 
  setSelectedSheetId, 
  spreadsheets, 
  selectedSheetName, 
  setSelectedSheetName,
  isProcessing,
  onProcess,
  onPasteAndProcess
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 grid grid-cols-2 gap-6">
        {!googleAccessToken ? (
          <button 
            onClick={onAuthenticate}
            className="btn-primary h-16 sm:h-20 rounded-2xl text-xl font-bold flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.02]"
          >
            حساب جوجل
          </button>
        ) : (
          <div className="h-16 sm:h-20 glass rounded-2xl px-8 flex flex-col justify-center border-r-8 border-r-[#00ffa6] shadow-xl">
            <span className="text-sm font-black tracking-widest text-[#00ffa6] uppercase">ملف البيانات</span>
            <select 
              value={selectedSheetId} 
              onChange={e => { setSelectedSheetId(e.target.value); localStorage.setItem('selected_sheet_id', e.target.value); }}
              className="bg-transparent text-lg md:text-xl font-black outline-none cursor-pointer appearance-none text-white w-full"
            >
              <option value="" className="bg-neutral-900">اختر الملف</option>
              {spreadsheets.map(f => <option key={f.id} value={f.id} className="bg-neutral-900">{f.name}</option>)}
            </select>
          </div>
        )}

        <div className={`h-16 sm:h-20 glass rounded-2xl px-8 flex flex-col justify-center transition-all shadow-xl ${!selectedSheetId ? 'opacity-30 grayscale cursor-not-allowed' : 'opacity-100 border-r-8 border-r-white/20'}`}>
          <span className="text-sm font-black text-[#00ffa6] tracking-widest mb-2">ورقة العمل</span>
          <input 
            value={selectedSheetName} 
            onChange={e => { setSelectedSheetName(e.target.value); localStorage.setItem('selected_sheet_name', e.target.value); }}
            className="bg-transparent text-lg md:text-xl font-black outline-none placeholder:opacity-20 text-white"
            placeholder="مثال: Sheet1"
            disabled={!selectedSheetId}
          />
        </div>
      </div>

      <div className="lg:col-span-4 flex items-center gap-4">
        <button 
          onClick={onPasteAndProcess}
          disabled={isProcessing || !googleAccessToken || !selectedSheetId}
          title="لصق ومعالجة فورية"
          className="w-20 h-16 sm:h-20 glass rounded-2xl flex items-center justify-center text-[#00ffa6] border border-[#00ffa6]/20 hover:bg-[#00ffa6]/10 transition-all shadow-xl disabled:opacity-20"
        >
          <ClipboardPaste size={32} />
        </button>       
         
        <button 
          onClick={onProcess} 
          disabled={isProcessing || !googleAccessToken || !selectedSheetId}
          className={`flex-1 h-16 sm:h-20 bg-accent/10 text-accent btn-primary rounded-2xl text-2xl font-black disabled:opacity-20 disabled:grayscale transition-all shadow-[0_20px_60px_rgba(0,255,166,0.3)] hover:scale-[1.05] active:scale-95`}
        >
          {isProcessing ? 'جاري...' : 'بدء المعالجة'}
        </button>
      </div>
    </div>
  );
}
