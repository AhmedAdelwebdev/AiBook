'use client';

import { useState } from 'react';
import { appendToSheet, getSheetStats } from '@/lib/sheets';

export function useProcessing(settings, googleAuth, showToast, setErrorModal, setResultModal) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

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

  const startProcessing = async (textToProcess, currentInputText, setInputText) => {
    const finalSelection = textToProcess || currentInputText;
    if (!finalSelection.trim()) return showToast("لا يوجد نص للمعالجة");
    if (!googleAuth.googleAccessToken || !googleAuth.selectedSheetId) return showToast("يرجى ربط حساب جوجل واختيار ملف");

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
                googleAuth: { 
                  accessToken: googleAuth.googleAccessToken, 
                  spreadsheetId: googleAuth.selectedSheetId, 
                  sheetName: googleAuth.selectedSheetName 
                }
              })
            });

            const data = await res.json();
            if (!res.ok) {
              if (res.status === 401) throw new Error("Auth Failure");
              if (res.status === 429) {
                setStatusMessage(`جاري تجنب حد الطلبات... (محاولة ${retryCount + 1})`);
                await new Promise(r => setTimeout(r, 10000));
                retryCount++;
                continue;
              }
              throw new Error(data.error || "خطأ في المعالجة");
            }

            list.push(data.recipe);
            success = true;
            if (i < total - 1) await new Promise(r => setTimeout(r, 3000));
            
          } catch (err) {
            retryCount++;
            if (err.message === "Auth Failure") throw err;
            if (err.message === "Rate Limit") {
              setStatusMessage(`تم تجاوز حد الطلبات. جاري الانتظار دقيقة...`);
              await new Promise(r => setTimeout(r, 30000));
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

      const totalInSheet = await getSheetStats({ 
        accessToken: googleAuth.googleAccessToken, 
        spreadsheetId: googleAuth.selectedSheetId, 
        sheetName: googleAuth.selectedSheetName 
      });
      
      setProgress(100);
      await new Promise(r => setTimeout(r, 1000));

      setResultModal({ 
        open: true, 
        count: list.length, 
        details: list.map(r => r.name || 'وصفة'),
        totalRows: Math.max(0, totalInSheet - 1)
      });
      if (setInputText) setInputText('');
    } catch (error) {
      if (error.message === "Auth Failure") {
        googleAuth.setGoogleAccessToken('');
        localStorage.removeItem('google_access_token');
        setErrorModal({ open: true, message: "انتهت صلاحية الجلسة، يرجى إعادة ربط حساب جوجل" });
      } else {
        setErrorModal({ open: true, message: error.message });
      }
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
      setTimeout(() => setProgress(0), 500);
    }
  };

  const sendDirectToSheet = async (textToSend, setInputText) => {
    if (!textToSend || !textToSend.trim()) return showToast("يرجى كتابة نص أولاً");
    if (!googleAuth.googleAccessToken || !googleAuth.selectedSheetId) return showToast("يرجى ربط حساب جوجل واختيار ملف");

    setIsProcessing(true);
    setProgress(0);
    setStatusMessage("جاري الإرسال للشيت...");
    try {
      const auth = { 
        accessToken: googleAuth.googleAccessToken, 
        spreadsheetId: googleAuth.selectedSheetId, 
        sheetName: googleAuth.selectedSheetName 
      };

      const parts = textToSend.split(',').map(p => p.trim()).filter(p => p.length > 0);
      const data = parts.length > 1
        ? Object.fromEntries(parts.map((v, i) => [i, v]))
        : { value: textToSend };

      await appendToSheet(auth, data);
      
      setProgress(100);
      setStatusMessage("تم الحفظ بنجاح ✓");
      await new Promise(r => setTimeout(r, 1000));
      
      showToast(parts.length > 1 ? `تم الإرسال في ${parts.length} أعمدة ✓` : "تم الإرسال للشيت ✓");
      if (setInputText) setInputText('');
    } catch(err) {
      setErrorModal({ open: true, message: `فشل الإرسال: ${err.message}` });
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
      setTimeout(() => setProgress(0), 500);
    }
  };

  return { isProcessing, progress, statusMessage, startProcessing, sendDirectToSheet };
}
