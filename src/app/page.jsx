'use client';

import Header from '@/components/Header';
import ConnectionPanel from '@/components/ConnectionPanel';
import Workspace from '@/components/Workspace';
import Modals from '@/components/Modals';
import { useRecipeApp } from '@/hooks/useRecipeApp';

export default function Home() {
  const {
    inputText, setInputText,
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
    isAutoPilot, setIsAutoPilot,
    settings, setSettings,
    startProcessing,
    authenticateGoogle,
    saveSettings,
    showToast
  } = useRecipeApp();

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-[#00ffa6]/30 font-arabic">
      
      <Header onOpenSettings={() => setShowSettings(true)} />


      <main className="w-full max-w-7xl px-6 flex flex-col gap-12 pb-16">
        
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAutoPilot(!isAutoPilot)}
            className={`px-8 h-14 rounded-[1.75rem] flex items-center gap-4 transition-all font-black text-sm tracking-widest border-2 shadow-xl ${isAutoPilot ? 'bg-[#00ffa6] text-black border-[#00ffa6]' : 'glass text-white/40 border-white/5'}`}
          >
            <span className={`w-3 h-3 rounded-full ${isAutoPilot ? 'bg-black animate-pulse' : 'bg-white/20'}`} />
            الطيار الآلي {isAutoPilot ? 'نشط' : 'متوقف'}
          </button>
        </div>

        <ConnectionPanel 
          googleAccessToken={googleAccessToken}
          settings={settings}
          onAuthenticate={authenticateGoogle}
          onSignOut={() => { setGoogleAccessToken(''); localStorage.removeItem('google_access_token'); }}
          selectedSheetId={selectedSheetId}
          setSelectedSheetId={setSelectedSheetId}
          spreadsheets={spreadsheets}
          selectedSheetName={selectedSheetName}
          setSelectedSheetName={setSelectedSheetName}
          isProcessing={isProcessing}
          onProcess={() => startProcessing()}
        />

        <Workspace 
          inputText={inputText}
          setInputText={setInputText}
          isAutoPilot={isAutoPilot}
          isProcessing={isProcessing}
          progress={progress}
          statusMessage={statusMessage}
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
      />

      {toast.show && (
        <div className="fixed bottom-12 z-[500] bg-[#00ffa6] text-black px-12 py-5 rounded-[2rem] font-black text-lg shadow-2xl animate-slide-up">
          {toast.message}
        </div>
      )}

    </div>
  );
}
