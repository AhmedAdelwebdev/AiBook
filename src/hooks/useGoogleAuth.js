'use client';

import { useState, useEffect } from 'react';

export function useGoogleAuth(settings, showToast) {
  const [googleAccessToken, setGoogleAccessToken] = useState('');
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [selectedSheetId, setSelectedSheetId] = useState('');
  const [selectedSheetName, setSelectedSheetName] = useState('Sheet1');
  const [isLoadingSheets, setIsLoadingSheets] = useState(false);

  useEffect(() => {
    setSelectedSheetId(localStorage.getItem('selected_sheet_id') || '');
    setSelectedSheetName(localStorage.getItem('selected_sheet_name') || 'Sheet1');
    const token = localStorage.getItem('google_access_token') || '';
    setGoogleAccessToken(token);

    const hashToken = new URLSearchParams(window.location.hash.substring(1)).get('access_token');
    if (hashToken) {
      setGoogleAccessToken(hashToken);
      localStorage.setItem('google_access_token', hashToken);
      window.location.hash = '';
    }
  }, []);

  useEffect(() => {
    if (googleAccessToken) fetchSpreadsheets();
  }, [googleAccessToken]);

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

  const authenticateGoogle = () => {
    if (!settings.GOOGLE_CLIENT_ID) {
      if (showToast) showToast("يرجى إدخال Client ID في الإعدادات");
      return;
    }
    const scope = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly';
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${settings.GOOGLE_CLIENT_ID}&redirect_uri=${window.location.origin}&response_type=token&scope=${scope}&prompt=consent`;
  };

  const signOut = () => {
    setGoogleAccessToken('');
    localStorage.removeItem('google_access_token');
    if (showToast) showToast('تم تسجيل الخروج');
  };

  return {
    googleAccessToken,
    setGoogleAccessToken,
    spreadsheets,
    selectedSheetId,
    setSelectedSheetId,
    selectedSheetName,
    setSelectedSheetName,
    isLoadingSheets,
    authenticateGoogle,
    signOut
  };
}
