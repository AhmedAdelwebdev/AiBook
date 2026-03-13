export async function processWithGroq(recipeText, apiKey, systemPrompt) {
  const defaultPrompt = `You are a professional recipe extractor. Parse the text into JSON. 
          Fields: name, ingredients, preparation_method, preparation_duration, marination_duration, suitable_dishes, warnings, alternatives. 
          Rules: Use string values ONLY. Return valid JSON only.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt || defaultPrompt },
        { role: "user", content: recipeText }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    })
  });
  
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices[0].message.content;
}

const flattenAndConvertJSON = (obj) => {
  if (typeof obj !== 'object' || obj === null) return { value: String(obj) };
  
  const flatten = (o, prefix = '') => {
    return Object.keys(o).reduce((acc, k) => {
      const pre = prefix.length ? prefix + '_' : '';
      if (Array.isArray(o[k])) {
         // Join arrays with commas
         acc[pre + k] = o[k].map(v => typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v)).join(' , ');
      } else if (typeof o[k] === 'object' && o[k] !== null) {
         Object.assign(acc, flatten(o[k], pre + k));
      } else {
         acc[pre + k] = o[k] !== null && o[k] !== undefined ? String(o[k]) : '';
      }
      return acc;
    }, {});
  };

  return flatten(obj);
};

export function parseAIResponse(raw) {
  let parsedJson = null;
  try {
    parsedJson = JSON.parse(raw.trim());
  } catch (e) {
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first !== -1 && last !== -1) {
      try {
        parsedJson = JSON.parse(raw.slice(first, last + 1));
      } catch (innerE) {
        throw new Error("Failed to parse AI JSON response: " + innerE.message);
      }
    } else {
       throw new Error("Failed to parse AI JSON response. No JSON object found.");
    }
  }
  
  return flattenAndConvertJSON(parsedJson);
}
