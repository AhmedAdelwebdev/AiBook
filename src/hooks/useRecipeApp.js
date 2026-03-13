'use client';

import { useState, useEffect } from 'react';
import { appendToSheet } from '@/lib/sheets';

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

  const [directInputText, setDirectInputText] = useState('');

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
6. أخرج JSON فقط بدون أي نص إضافي أو شرح.`
  });

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('recipe_ai_settings');
    if (saved) setSettings(s => ({ ...s, ...JSON.parse(saved) }));
    
    setSelectedSheetId(localStorage.getItem('selected_sheet_id') || '');
    setSelectedSheetName(localStorage.getItem('selected_sheet_name') || 'Sheet1');
    setGoogleAccessToken(localStorage.getItem('google_access_token') || '');

    const hashToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (hashToken) {
      setGoogleAccessToken(hashToken);
      localStorage.setItem('google_access_token', hashToken);
      window.location.hash = '';
    }
  }, []);

  useEffect(() => { if (googleAccessToken) fetchSpreadsheets(); }, [googleAccessToken]);


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

  const splitRecipes = (text, kw, regexStr, customCode) => {
    const tContent = text.trim();
    if (customCode) {
      try {
        const dynamicSplitter = new Function('text', customCode);
        const result = dynamicSplitter(tContent);
        if (Array.isArray(result)) return result.map(t => t.trim()).filter(t => t.length > 5);
      } catch (e) { console.error("Dynamic Split Error:", e); }
    }
    if (regexStr) {
      try {
        const regex = new RegExp(regexStr, 'g');
        return tContent.split(regex).map(t => t.trim()).filter(t => t.length > 5);
      } catch (e) {}
    }
    if (!kw || !tContent.includes(kw)) return [tContent];
    return tContent.split(kw).map(t => t.trim()).filter(t => t.length > 5);
  };

  const startProcessing = async (textToProcess) => {
    const finalSelection = textToProcess || inputText;
    if (!finalSelection.trim()) return showToast("لا يوجد نص للمعالجة");
    if (!googleAccessToken || !selectedSheetId) return showToast("يرجى ربط حساب جوجل واختيار ملف");

    setIsProcessing(true);
    setProgress(0);
    const list = [];

    try {
      const recipes = splitRecipes(finalSelection, settings.SPLIT_KEYWORD, settings.SPLIT_REGEX, settings.SPLIT_CODE);
      const total = recipes.length;
      if (total === 0) throw new Error("لم يتم العثور على وصفات صالحة بعد التقسيم.");

      setStatusMessage(`تم العثور على ${total} وصفة. جاري المعالجة...`);

      for (let i = 0; i < total; i++) {
        let retryCount = 0;
        let success = false;
        
        while (!success && retryCount < 3) {
          try {
            const currentPercent = Math.round((i / total) * 100);
            setStatusMessage(`جاري معالجة ${i + 1} من ${total}`);
            setProgress(currentPercent);

            const res = await fetch('/api/process', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: recipes[i],
                settings,
                googleAuth: { accessToken: googleAccessToken, spreadsheetId: selectedSheetId, sheetName: selectedSheetName }
              })
            });

            const data = await res.json();
            if (!res.ok) {
              if (res.status === 401) throw new Error("Auth Failure");
              if (res.status === 429) throw new Error("Rate Limit");
              throw new Error(data.error || "خطأ في المعالجة");
            }

            list.push(data.recipe);
            success = true;
            
            // Add minimum delay to avoid rate limits
            if (i < total - 1) await new Promise(r => setTimeout(r, 2000));
            
          } catch (err) {
            retryCount++;
            if (err.message === "Auth Failure") throw err;

            if (err.message === "Rate Limit") {
              setStatusMessage(`تم تجاوز حد الطلبات. جاري الانتظار دقيقة...`);
              await new Promise(r => setTimeout(r, 60000));
            } else {
              setStatusMessage(`فشل في رقم ${i+1}. إعادة المحاولة (${retryCount}/3)...`);
              await new Promise(r => setTimeout(r, 5000));
            }
          }
        }
        
        if (!success) {
          showToast(`تم تخطي وصفة ${i+1} لفشلها المتكرر.`);
        }
      }

      setResultModal({ open: true, count: list.length, details: list.map(r => r.name || 'وصفة') });
      setInputText('');
      setProgress(100);

    } catch (error) {
      if (error.message === "Auth Failure") {
        setGoogleAccessToken('');
        localStorage.removeItem('google_access_token');
        setErrorModal({ open: true, message: "انتهت صلاحية الجلسة، يرجى إعادة ربط حساب جوجل" });
      } else {
        setErrorModal({ open: true, message: error.message });
      }
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handlePasteAndProcess = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return showToast("الحافظة فارغة.");
      setInputText(text);
      startProcessing(text);
    } catch (e) {
      showToast("يرجى لصق النص يدوياً قبل المعالجة.");
    }
  };

  const handlePasteAndSendDirect = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) return showToast("الحافظة فارغة.");
      setDirectInputText(text);
      await sendDirectToSheet(text);
    } catch (e) {
      showToast("فشل اللصق، حاول اللصق يدوياً.");
    }
  };

  const sendDirectToSheet = async (textToSend) => {
    const finalSelection = textToSend || directInputText;
    if (!finalSelection.trim()) return showToast("يرجى إدخال نص أولاً");
    if (!googleAccessToken || !selectedSheetId) return showToast("يرجى ربط حساب جوجل واختيار ملف");

    setIsProcessing(true);
    setStatusMessage("جاري الإرسال للشيت مباشرة...");
    try {
      const googleAuth = { accessToken: googleAccessToken, spreadsheetId: selectedSheetId, sheetName: selectedSheetName };
      await appendToSheet(googleAuth, { value: finalSelection });
      showToast("تم إرسال النص للشيت بنجاح!");
      setDirectInputText('');
    } catch(err) {
      setErrorModal({ open: true, message: `فشل الإرسال: ${err.message}` });
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
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
    handlePasteAndSendDirect,
    sendDirectToSheet
  };
}
