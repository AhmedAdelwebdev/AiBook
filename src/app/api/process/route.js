import { sendTelegram } from '@/lib/telegram';
import { processWithGroq, parseAIResponse } from '@/lib/groq';
import { appendToSheet } from '@/lib/sheets';

export const runtime = 'nodejs';

export async function POST(req) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendStatus = (msg, progress = null, recipeData = null) => {
        controller.enqueue(encoder.encode(JSON.stringify({ status: msg, progress, recipe: recipeData }) + '\n'));
      };

      let settingsGlobal;
      try {
        const { text, settings, googleAuth } = await req.json();
        settingsGlobal = settings;

        const { TG_BOT_TOKEN, TG_CHAT_ID, GROQ_API_KEY, SYSTEM_PROMPT, SPLIT_KEYWORD, SPLIT_REGEX } = settings;

        // 1. Split Logic: Advanced Dynamic Engine
        const splitRecipes = (inputText, kw, regexStr, customCode) => {
          const tContent = inputText.trim();
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

        const recipes = splitRecipes(text, SPLIT_KEYWORD, SPLIT_REGEX, settings.SPLIT_CODE);
        const total = recipes.length;
        
        sendStatus(`Queue built: ${total} items.`, 0);

        // 2. Process items silently
        for (let i = 0; i < total; i++) {
          let retryCount = 0;
          const maxRetries = 3;
          let success = false;

          while (!success && retryCount < maxRetries) {
            try {
              const currentPercent = Math.round((i / total) * 100);
              sendStatus(`Processing ${i + 1}/${total}...`, currentPercent);
              
              const aiRaw = await processWithGroq(recipes[i], GROQ_API_KEY, SYSTEM_PROMPT);
              const parsed = parseAIResponse(aiRaw);
              await appendToSheet(googleAuth, parsed);
              
              // Send the name back to UI so user sees it in the list immediately
              sendStatus(`تم حفظ: ${parsed.name || 'وصفة'}`, currentPercent, parsed.name || 'وصفة');
              
              success = true;
              
              // Only notify periodic progress for LARGE batches (> 10 items)
              if (total > 10 && (i + 1) % 10 === 0 && i < total - 1) {
                const percent = Math.round(((i + 1) / total) * 100);
                await sendTelegram(TG_BOT_TOKEN, TG_CHAT_ID, `📊 <b>Progress:</b> ${i + 1}/${total} (${percent}%)`);
              }
              
              // Delay to prevent rate limits
              if (i < total - 1) await new Promise(r => setTimeout(r, 5000));

            } catch (err) {
              retryCount++;
              const isAuthError = err.message.toLowerCase().includes('authentication') || err.message.toLowerCase().includes('credential') || err.message.includes('401');
              
              if (isAuthError) {
                await sendTelegram(TG_BOT_TOKEN, TG_CHAT_ID, `🚨 <b>AUTH EXPIRED</b>\nPlease re-authenticate on the website.`);
                throw new Error("Auth Failure");
              }

              const isRateLimit = err.message.toLowerCase().includes('rate limit');
              const waitMinutes = isRateLimit ? 5 : 2;

              await sendTelegram(TG_BOT_TOKEN, TG_CHAT_ID, `⚠️ <b>Error at ${i + 1}/${total}</b>\n${err.message}\nRetrying in ${waitMinutes}m...`);
              await new Promise(r => setTimeout(r, waitMinutes * 60 * 1000));
            }
          }
          if (!success) {
            await sendTelegram(TG_BOT_TOKEN, TG_CHAT_ID, `❌ <b>Failed item ${i+1}</b> after 3 retries. Skipping.`);
          }
        }

        // 3. Final Summary (The main message)
        const summary = total === 1 
          ? `✅ <b>Success:</b> 1 recipe saved.`
          : `🏁 <b>Batch Complete:</b> ${total} recipes saved successfully.`;
        
        await sendTelegram(TG_BOT_TOKEN, TG_CHAT_ID, summary);
        controller.enqueue(encoder.encode(JSON.stringify({ done: true, count: total }) + '\n'));
        controller.close();

      } catch (fatal) {
        if (settingsGlobal) {
          await sendTelegram(settingsGlobal.TG_BOT_TOKEN, settingsGlobal.TG_CHAT_ID, `💥 <b>Fatal:</b> ${fatal.message}`);
        }
        controller.enqueue(encoder.encode(JSON.stringify({ error: fatal.message }) + '\n'));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'application/x-ndjson' }
  });
}
