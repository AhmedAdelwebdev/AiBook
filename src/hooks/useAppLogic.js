'use client';

import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { useGoogleAuth } from './useGoogleAuth';
import { useProcessing } from './useProcessing';

export function useAppLogic() {
  const [mounted, setMounted] = useState(false);
  const [inputText, setInputText] = useState('');
  const [directInputText, setDirectInputText] = useState('');
  const [toast, setToast] = useState({ show: false, message: '' });
  const [resultModal, setResultModal] = useState({ open: false, count: 0, details: [], totalRows: 0 });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const showToast = (m) => { 
    setToast({ show: true, message: m }); 
    setTimeout(() => setToast({ show: false, message: '' }), 3000); 
  };

  const settingsHook = useSettings();
  const googleAuth = useGoogleAuth(settingsHook.settings, showToast);
  const processing = useProcessing(
    settingsHook.settings, 
    googleAuth, 
    showToast, 
    setErrorModal, 
    setResultModal
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handlePasteAndProcess = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return showToast("الحافظة فارغة.");
      setInputText(text);
      processing.startProcessing(text, text, setInputText);
    } catch (e) {
      showToast("يرجى لصق النص يدوياً قبل المعالجة.");
    }
  };

  const handlePasteAndSendDirect = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return showToast("الحافظة فارغة.");
      
      const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      if (wordCount < 10) {
        return showToast(`النص قصير جداً (${wordCount} كلمات)`);
      }
      
      setInputText(text);
      await processing.startProcessing(text, text, setInputText);
    } catch (e) {
      showToast("فشل اللصق، حاول اللصق يدوياً.");
    }
  };

  return {
    // UI State
    mounted,
    inputText, setInputText,
    directInputText, setDirectInputText,
    toast, showToast,
    resultModal, setResultModal,
    errorModal, setErrorModal,

    // Settings
    ...settingsHook,

    // Google Auth
    ...googleAuth,

    // Processing
    ...processing,

    // Handlers
    handlePasteAndProcess,
    handlePasteAndSendDirect,
    startProcessing: (text) => processing.startProcessing(text || inputText, inputText, setInputText),
    sendDirectToSheet: (text) => processing.sendDirectToSheet(text || inputText, setInputText)
  };
}
