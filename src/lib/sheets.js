function sanitize(val) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

/**
 * Appends data to a Google Sheet.
 * @param {Object} googleAuth - { accessToken, spreadsheetId, sheetName }
 * @param {Object} data - The JSON object from AI
 */
export async function appendToSheet(googleAuth, data) {
  const { accessToken, spreadsheetId, sheetName } = googleAuth;
  const targetSheet = sheetName || 'Sheet1';
  
  // Use a proper range to help Google find the start of the table
  // A:Z ensures it looks across standard columns
  const range = `'${targetSheet}'!A:Z`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  // Dynamically map all values from the data object, ignoring any keys
  const mappedValues = Object.values(data).map(val => sanitize(val));

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      values: [mappedValues]
    })
  });

  const resData = await response.json();
  
  if (resData.error) {
    console.error("Google Sheets API Error:", resData.error);
    throw new Error(resData.error.message);
  }
  
  return resData;
}
