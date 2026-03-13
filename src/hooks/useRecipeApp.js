'use client';

import { useState, useEffect, useRef } from 'react';

export function useRecipeApp() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [mounted, setMounted] = useState(false);
  
  const [resultModal, setResultModal] = useState({ open: false, count: 0, details: [] });
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [selectedSheetId, setSelectedSheetId] = useState('');
  const [selectedSheetName, setSelectedSheetName] = useState('Sheet1');
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  const [isAutoPilot, setIsAutoPilot] = useState(false);
  const [lastUpdateId, setLastUpdateId] = useState(0);
  const autoPilotTimer = useRef(null);

  const [settings, setSettings] = useState({
    GROQ_API_KEY: '',
    GOOGLE_CLIENT_ID: '', 
    SPLIT_KEYWORD: 'Yasser B4',
    SPLIT_REGEX: '',
    SPLIT_CODE: `// Custom Splitting Logic
if(!text.includes("Yasser B4")){
  return [text.trim()]
}
return text.split("Yasser B4").slice(1).map(t=>t.trim() + "\\n\\n-------------")`,
    SYSTEM_PROMPT: `أنت خبير استخراج بيانات متخصص في تحليل نصوص وصفات الطعام وتحويلها إلى بيانات منظمة بصيغة JSON.

مهمتك: استخرج معلومات وصفة واحدة فقط وحولها إلى الحقول التالية بالضبط:
- name
- ingredients
- preparation_method
- preparation_duration
- suitable_dishes
- warnings
- alternatives

القواعد:
1. كل قيمة string في سطر واحد فقط (لا \\n).
2. العناصر المتعددة تفصل بـ " , ".
3. اسم الوصفة: العنوان الرئيسي (لا تتركه فارغاً).
4. preparation_method: وصف الخطوات في جملة واحدة متصلة وسلسة.
5. preparation_duration: "XX دقيقة" أو "XX إلى YY دقيقة" (إذا نطاق اختر الأعلى).
6. أخرج JSON فقط بدون أي نص إضافي أو شرح.`,
    TG_BOT_TOKEN: '',
    TG_CHAT_ID: ''
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('recipe_ai_settings');
    if (saved) setSettings(s => ({ ...s, ...JSON.parse(saved) }));
    
    setSelectedSheetId(localStorage.getItem('selected_sheet_id') || '');
    setSelectedSheetName(localStorage.getItem('selected_sheet_name') || 'Sheet1');
    setGoogleAccessToken(localStorage.getItem('google_access_token') || '');
    setLastUpdateId(Number(localStorage.getItem('tg_last_update_id')) || 0);

    const hashToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (hashToken) {
      setGoogleAccessToken(hashToken);
      localStorage.setItem('google_access_token', hashToken);
      window.location.hash = '';
    }
  }, []);

  useEffect(() => { if (googleAccessToken) fetchSpreadsheets(); }, [googleAccessToken]);

  useEffect(() => {
    const initAutoPilot = async () => {
      if (isAutoPilot && mounted && !isProcessing) {
        try {
          const res = await fetch(`https://api.telegram.org/bot${settings.TG_BOT_TOKEN}/getUpdates?limit=1&offset=-1`);
          const data = await res.json();
          if (data.ok && data.result.length > 0) {
            const currentMax = data.result[0].update_id;
            setLastUpdateId(currentMax);
            localStorage.setItem('tg_last_update_id', currentMax);
          }
        } catch (e) { console.error("Baseline error", e); }
        autoPilotTimer.current = setInterval(checkTelegramUpdates, 10000);
      } else {
        clearInterval(autoPilotTimer.current);
      }
    };
    initAutoPilot();
    return () => clearInterval(autoPilotTimer.current);
  }, [isAutoPilot, isProcessing, mounted]);

  const checkTelegramUpdates = async () => {
    if (!settings.TG_BOT_TOKEN || isProcessing) return;
    try {
      const offset = lastUpdateId + 1;
      const res = await fetch(`https://api.telegram.org/bot${settings.TG_BOT_TOKEN}/getUpdates?offset=${offset}&limit=5`);
      const data = await res.json();
      if (data.ok && data.result.length > 0) {
        const latestUpdate = data.result[data.result.length - 1];
        const newUpdateId = latestUpdate.update_id;
        const validUpdates = settings.TG_CHAT_ID 
          ? data.result.filter(u => u.message && String(u.message.chat.id) === String(settings.TG_CHAT_ID))
          : data.result.filter(u => u.message);

        if (validUpdates.length > 0) {
          const latestValid = validUpdates[validUpdates.length - 1];
          const text = latestValid.message.text;
          if (text) {
            setLastUpdateId(newUpdateId);
            localStorage.setItem('tg_last_update_id', newUpdateId);
            startProcessing(text);
          }
        } else {
          setLastUpdateId(newUpdateId);
          localStorage.setItem('tg_last_update_id', newUpdateId);
        }
      }
    } catch (e) { console.error("Auto-Pilot Error:", e); }
  };

  const fetchSpreadsheets = async () => {
    if (!googleAccessToken) return;
    setIsLoadingSheets(true);
    try {
      const res = await fetch('https://www.googleapis.com/drive/v3/files?q=mimeType=\'application/vnd.google-apps.spreadsheet\'', {
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      });
      const data = await res.json();
      if (data.files) setSpreadsheets(data.files);
      else if (data.error?.code === 401) setGoogleAccessToken('');
    } catch (e) { } finally { setIsLoadingSheets(false); }
  };

  const startProcessing = async (textToProcess) => {
    const finalSelection = textToProcess || inputText;
    if (!finalSelection.trim()) return showToast("لا يوجد نص للمعالجة");
    if (!googleAccessToken || !selectedSheetId) return showToast("يرجى ربط حساب جوجل واختيار ملف");

    setIsProcessing(true);
    setProgress(0);
    const list = [];

    try {
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: finalSelection,
          settings,
          googleAuth: {
            accessToken: googleAccessToken,
            spreadsheetId: selectedSheetId,
            sheetName: selectedSheetName
          }
        })
      });

      if (!response.body) throw new Error("فشل الاتصال بالخادم");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep the last partial line in buffer

        lines.filter(Boolean).forEach(line => {
          try {
            const data = JSON.parse(line);
            if (data.error) throw new Error(data.error);
            if (data.status) setStatusMessage(data.status);
            if (data.progress !== null && data.progress !== undefined) setProgress(data.progress);
            if (data.recipe) list.push(data.recipe);
            if (data.done) {
              setResultModal({ open: true, count: data.count, details: list });
              if (!isAutoPilot) setInputText('');
              setProgress(100);
            }
          } catch (e) { 
            if (e.message !== "Auth Failure") console.error("Stream parse error", e); 
            else throw e; // Re-throw auth failure to be caught by outer catch
          }
        });
      }
    } catch (error) {
       const isAuthError = 
         error.message.toLowerCase().includes('authentication') || 
         error.message.toLowerCase().includes('credential') || 
         error.message.toLowerCase().includes('auth failure');
         
      if (isAuthError) {
        setGoogleAccessToken('');
        localStorage.removeItem('google_access_token');
        setIsAutoPilot(false);
      }
      setErrorModal({ open: true, message: error.message === "Auth Failure" ? "انتهت صلاحية الجلسة، يرجى إعادة ربط حساب جوجل" : error.message });
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const authenticateGoogle = () => {
    const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly';
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${settings.GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}&response_type=token&scope=${scope}`;
  };

  const showToast = (m) => { setToast({ show: true, message: m }); setTimeout(() => setToast({ show: false, message: '' }), 3000); };

  const saveSettings = () => {
    localStorage.setItem('recipe_ai_settings', JSON.stringify(settings));
    setShowSettings(false);
    showToast("تم الحفظ");
  };

  return {
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
  };
}
