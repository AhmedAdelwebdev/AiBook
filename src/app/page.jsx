'use client';

import Header from '@/components/Header';
import ConnectionPanel from '@/components/ConnectionPanel';
import Workspace from '@/components/Workspace';
import Modals from '@/components/Modals';
import { useRecipeApp } from '@/hooks/useRecipeApp';

export default function Home() {
  const {
    inputText, setInputText,
    directInputText, setDirectInputText,
    isProcessing,
    progress,
    statusMessage,
    showSettings, setShowSettings,
    toast,
    mounted,
    resultModal, setResultModal,
    errorModal, setErrorModal,
    googleAccessToken, setGoogleAccessToken,
    spreadsheets,
    selectedSheetId, setSelectedSheetId,
    selectedSheetName, setSelectedSheetName,
    settings, setSettings,
    startProcessing,
    authenticateGoogle,
    saveSettings,
    showToast,
    handlePasteAndProcess,
    sendDirectToSheet,
    handlePasteAndSendDirect
  } = useRecipeApp();

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#00ffa6]/30 font-arabic">
      
      <Header onOpenSettings={() => setShowSettings(true)} />


      <main className="w-full max-w-7xl px-6 flex flex-col gap-12 pb-16">
        
        <ConnectionPanel 
          googleAccessToken={googleAccessToken}
          settings={settings}
          onAuthenticate={authenticateGoogle}
          selectedSheetId={selectedSheetId}
          setSelectedSheetId={setSelectedSheetId}
          spreadsheets={spreadsheets}
          selectedSheetName={selectedSheetName}
          setSelectedSheetName={setSelectedSheetName}
          isProcessing={isProcessing}
          onProcess={() => startProcessing()}
          onPasteAndProcess={handlePasteAndProcess}
        />

        <Workspace 
          inputText={inputText}
          setInputText={setInputText}
          directInputText={directInputText}
          setDirectInputText={setDirectInputText}
          isProcessing={isProcessing}
          progress={progress}
          statusMessage={statusMessage}
          onProcess={() => startProcessing()}
          onSendDirect={sendDirectToSheet}
          onPasteAndSendDirect={handlePasteAndSendDirect}
        />
      </main>

      <Modals 
        resultModal={resultModal}
        setResultModal={setResultModal}
        errorModal={errorModal}
        setErrorModal={setErrorModal}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        settings={settings}
        setSettings={setSettings}
        onSaveSettings={saveSettings}
        showToast={showToast}
        onSignOut={() => { 
          setGoogleAccessToken(''); 
          localStorage.removeItem('google_access_token'); 
          setShowSettings(false);
        }}
      />

      {toast.show && (
        <div className="fixed bottom-12 z-[500] bg-[#00ffa6] text-black px-12 py-3 rounded-[2rem] font-black text-lg shadow-2xl animate-slide-up">
          {toast.message}
        </div>
      )}

    </div>
  );
}
