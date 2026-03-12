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

  // Explicit mapping based on your prompt to ensure columns are always in the same order
  // regardless of how the AI returns the JSON keys.
  const schema = [
    'name',
    'ingredients',
    'preparation_method',
    'preparation_duration',
    'suitable_dishes',
    'warnings',
    'alternatives'
  ];

  // Map data to the schema. If a key is missing from AI, it becomes an empty string.
  const mappedValues = schema.map(key => sanitize(data[key] || ''));

  // Logic for any EXTRAs: If the user adds fields to the prompt that aren't in the schema, 
  // we append them at the end so no data is lost.
  const extraKeys = Object.keys(data).filter(key => !schema.includes(key));
  extraKeys.forEach(key => {
    mappedValues.push(sanitize(data[key]));
  });

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
