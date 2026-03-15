'use client';

import HomeTab from '@/components/HomeTab';
import SettingsTab from '@/components/SettingsTab';
import Modals from '@/components/Modals';
import { useAppLogic } from '@/hooks/useAppLogic';
import { useState } from 'react';
import Header from '@/components/Header';

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
  } = useAppLogic();

  const [activeTab, setActiveTab] = useState('home');

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col items-center selection:bg-accent/30 font-arabic pb-20 md:pb-8">
      <main className="w-full max-w-5xl px-4 md:px-6 flex flex-col gap-3 md:gap-5">
        <Header
          googleAccessToken={googleAccessToken}
          onAuthenticate={authenticateGoogle}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSignOut={() => {
            setGoogleAccessToken('');
            localStorage.removeItem('google_access_token');
            showToast('تم تسجيل الخروج');
          }}
        />

        {activeTab === 'home' ? (
          <HomeTab
            googleAccessToken={googleAccessToken}
            authenticateGoogle={authenticateGoogle}
            inputText={inputText}
            setInputText={setInputText}
            directInputText={directInputText}
            setDirectInputText={setDirectInputText}
            isProcessing={isProcessing}
            progress={progress}
            statusMessage={statusMessage}
            startProcessing={startProcessing}
            sendDirectToSheet={sendDirectToSheet}
            handlePasteAndSendDirect={handlePasteAndSendDirect}
            settings={settings}
            selectedSheetId={selectedSheetId}
            setSelectedSheetId={setSelectedSheetId}
            spreadsheets={spreadsheets}
            selectedSheetName={selectedSheetName}
            setSelectedSheetName={setSelectedSheetName}
            handlePasteAndProcess={handlePasteAndProcess}
          />
        ) : (
          <SettingsTab
            googleAccessToken={googleAccessToken}
            setGoogleAccessToken={setGoogleAccessToken}
            settings={settings}
            setSettings={setSettings}
            saveSettings={saveSettings}
            showToast={showToast}
          />
        )}
      </main>

      <Modals
        resultModal={resultModal}
        setResultModal={setResultModal}
        errorModal={errorModal}
        setErrorModal={setErrorModal}
      />

      {toast.show && (
        <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[500] bg-accent text-body px-6 py-2.5 rounded-2xl font-black text-sm shadow-2xl animate-slide-up whitespace-nowrap">
          {toast.message}
        </div>
      )}
    </div>
  );
}
