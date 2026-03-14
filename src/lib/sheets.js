function sanitize(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

/**
 * Creates a new sheet tab inside an existing spreadsheet.
 */
async function createSheet(accessToken, spreadsheetId, sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      requests: [{
        addSheet: {
          properties: { title: sheetName }
        }
      }]
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(`فشل إنشاء الورقة: ${data.error.message}`);
  return data;
}

/**
 * Appends data to a Google Sheet.
 * Auto-creates the sheet if it doesn't exist.
 * @param {Object} googleAuth - { accessToken, spreadsheetId, sheetName }
 * @param {Object} data - The JSON object from AI
 */
export async function appendToSheet(googleAuth, data) {
  const { accessToken, spreadsheetId, sheetName } = googleAuth;
  const targetSheet = sheetName || 'Sheet1';
  
  const range = `'${targetSheet}'!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;
  const mappedValues = Object.values(data).map(val => sanitize(val));

  const doAppend = async () => fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values: [mappedValues] })
  });

  let response = await doAppend();
  let resData = await response.json();

  // If sheet not found (400 error mentioning the range), create it and retry
  if (resData.error && (resData.error.code === 400 || resData.error.status === 'INVALID_ARGUMENT')) {
    await createSheet(accessToken, spreadsheetId, targetSheet);
    response = await doAppend();
    resData = await response.json();
  }
  
  if (resData.error) {
    console.error("Google Sheets API Error:", resData.error);
    throw new Error(resData.error.message);
  }
  
  return resData;
}
