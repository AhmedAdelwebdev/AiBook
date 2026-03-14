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
    // Match trailing number: e.g. "B11" → "B12", "Sheet3" → "Sheet4", "abc" → "abc1"
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-1">
          <Database size={14} className="text-accent" />
          <label className="text-text-primary text-sm font-bold">قاعدة البيانات</label>
        </div>
        <div className="relative">
          <select 
            value={selectedSheetId} 
            onChange={e => { setSelectedSheetId(e.target.value); localStorage.setItem('selected_sheet_id', e.target.value); }}
            className="w-full h-11 bg-bg-input border border-border rounded-xl px-4 pr-9 outline-none text-text-primary text-sm font-bold appearance-none cursor-pointer focus:border-accent transition-all"
          >
            <option value="" className="bg-bg-main">اختر قاعدة البيانات</option>
            {spreadsheets.map(f => <option key={f.id} value={f.id} className="bg-bg-main">{f.name}</option>)}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5 px-1">
          <FileText size={14} className="text-accent" />
          <label className="text-text-primary text-sm font-bold">ورقة العمل</label>
        </div>
        <div className="flex gap-2">
          <input 
            value={selectedSheetName} 
            onChange={e => { setSelectedSheetName(e.target.value); localStorage.setItem('selected_sheet_name', e.target.value); }}
            className="flex-1 h-11 bg-bg-input border border-border rounded-xl px-4 outline-none text-text-primary text-sm font-bold focus:border-accent transition-all text-right"
            placeholder="مثلاً: Sheet1"
          />
          <button
            onClick={incrementSheetName}
            title="زيادة الرقم بمقدار 1"
            className="h-11 w-11 flex-shrink-0 bg-bg-input border border-border rounded-xl flex items-center justify-center text-accent hover:bg-accent hover:text-bg-main hover:border-accent transition-all"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
