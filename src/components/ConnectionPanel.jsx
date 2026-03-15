import { Database, FileText, ChevronDown, Plus } from 'lucide-react';

export default function ConnectionPanel({
  googleAccessToken,
  selectedSheetId,
  setSelectedSheetId,
  spreadsheets,
  selectedSheetName,
  setSelectedSheetName,
}) {
  if (!googleAccessToken) return null;

  const incrementSheetName = () => {
    const name = selectedSheetName || '';
    // Match trailing number: e.g. "B11" → "B12"
    const match = name.match(/^(.*?)(\d+)$/);
    let next;
    if (match) {
      next = match[1] + (parseInt(match[2], 10) + 1);
    } else {
      next = name + '1';
    }
    setSelectedSheetName(next);
    localStorage.setItem('selected_sheet_name', next);
  };

  return (
    <div className="grid grid-cols-2 gap-4 w-full pt-3">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-1">
          <Database size={16} className="text-accent" />
          <label className="text-text2 text-base font-black whitespace-nowrap">قاعدة البيانات</label>
        </div>
        <div className="relative">
          <select value={selectedSheetId}
            onChange={e => { setSelectedSheetId(e.target.value); localStorage.setItem('selected_sheet_id', e.target.value); }}
            className="w-full h-14 bg-input border border-border rounded-xl px-4 outline-none text-text2 text-lg font-bold appearance-none cursor-pointer focus:border-accent transition-all"
          >
            <option value="" className="bg-body">اختر قاعدة البيانات</option>
            {spreadsheets.map(f => <option key={f.id} value={f.id} className="bg-body">{f.name}</option>)}
          </select>
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text2 pointer-events-none">
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-1">
          <FileText size={16} className="text-accent" />
          <label className="text-text2 text-base font-black whitespace-nowrap">ورقة العمل</label>
        </div>
        <div className="relative">
          <input
            value={selectedSheetName}
            onChange={e => { setSelectedSheetName(e.target.value); localStorage.setItem('selected_sheet_name', e.target.value); }}
            className="w-full h-14 bg-input border border-border rounded-xl pr-4 pl-14 outline-none text-text2 text-lg font-bold focus:border-accent transition-all text-right"
            placeholder="مثلاً: Sheet1"
          />
          <button
            onClick={incrementSheetName}
            title="زيادة الرقم بمقدار 1"
            className="absolute left-1.5 top-1.5 bottom-1.5 w-11 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent hover:bg-accent hover:text-body transition-all active:scale-95"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
