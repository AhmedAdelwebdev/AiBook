import Workspace from './Workspace';
import ConnectionPanel from './ConnectionPanel';

export default function HomeTab({
  googleAccessToken,
  inputText,
  setInputText,
  isProcessing,
  progress,
  statusMessage,
  sendDirectToSheet,
  selectedSheetId,
  setSelectedSheetId,
  spreadsheets,
  selectedSheetName,
  setSelectedSheetName,
  handlePasteAndProcess
}) {
  return (
    <div className="grid grid-cols-1 gap-4 animate-slide-up">
      <Workspace
        inputText={inputText}
        setInputText={setInputText}
        isProcessing={isProcessing}
        onSendDirect={() => sendDirectToSheet(inputText)}
        onPasteAndProcess={handlePasteAndProcess}
      />

      <ConnectionPanel
        googleAccessToken={googleAccessToken}
        selectedSheetId={selectedSheetId}
        setSelectedSheetId={setSelectedSheetId}
        spreadsheets={spreadsheets}
        selectedSheetName={selectedSheetName}
        setSelectedSheetName={setSelectedSheetName}
      />

      {/* Full-page processing overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[300] bg-body/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="6" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * progress) / 100} className="text-accent" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-text1">{progress}%</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-accent text-lg font-black">{statusMessage || 'جاري المعالجة...'}</span>
            <span className="text-text2 text-sm">يرجى الانتظار وعدم إغلاق الصفحة</span>
          </div>
        </div>
      )}
    </div>
  );
}
