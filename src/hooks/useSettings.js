'use client';

import { useState, useEffect } from 'react';

export function useSettings() {
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

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('recipe_ai_settings');
    if (saved) setSettings(s => ({ ...s, ...JSON.parse(saved) }));
  }, []);

  const saveSettings = (showToast) => {
    localStorage.setItem('recipe_ai_settings', JSON.stringify(settings));
    setShowSettings(false);
    if (showToast) showToast("تم الحفظ");
  };

  return { settings, setSettings, showSettings, setShowSettings, saveSettings };
}
