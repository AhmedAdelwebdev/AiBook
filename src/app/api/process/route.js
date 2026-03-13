import { processWithGroq, parseAIResponse } from '@/lib/groq';
import { appendToSheet } from '@/lib/sheets';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { text, settings, googleAuth } = await req.json();

    if (!text || !settings || !googleAuth) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const { GROQ_API_KEY, SYSTEM_PROMPT } = settings;

    // 1. Process with AI
    const aiRaw = await processWithGroq(text, GROQ_API_KEY, SYSTEM_PROMPT);
    const parsed = parseAIResponse(aiRaw);

    // 2. Append to Google Sheets
    await appendToSheet(googleAuth, parsed);

    return Response.json({ success: true, name: parsed.name || 'وصفة غير مسماة', recipe: parsed });

  } catch (error) {
    const isAuthError = error.message.toLowerCase().includes('authentication') || 
                        error.message.toLowerCase().includes('credential') || 
                        error.message.includes('401');
    const isRateLimit = error.message.toLowerCase().includes('rate limit') || 
                        error.message.includes('429');

    let status = 500;
    if (isAuthError) status = 401;
    if (isRateLimit) status = 429;

    return Response.json({ error: error.message }, { status });
  }
}
