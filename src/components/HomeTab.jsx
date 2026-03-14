import Header from './Header';
import Workspace from './Workspace';
import ConnectionPanel from './ConnectionPanel';

export default function HomeTab({ 
  googleAccessToken, 
  authenticateGoogle, 
  inputText, 
  setInputText, 
  directInputText, 
  setDirectInputText, 
  isProcessing, 
  progress, 
  statusMessage, 
  startProcessing, 
  sendDirectToSheet, 
  handlePasteAndSendDirect,
  settings,
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
        progress={progress}
        statusMessage={statusMessage}
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
        <div className="fixed inset-0 z-[300] bg-bg-main/80 backdrop-blur-sm flex flex-col items-center justify-center gap-6">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90">
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
              <circle cx="50%" cy="50%" r="45%" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * progress) / 100} className="text-accent" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-text-primary">{progress}%</div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-accent text-lg font-black">{statusMessage || 'جاري المعالجة...'}</span>
            <span className="text-text-secondary text-sm">يرجى الانتظار وعدم إغلاق الصفحة</span>
          </div>
        </div>
      )}
    </div>
  );
}
