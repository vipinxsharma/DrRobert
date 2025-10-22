import intents from "../knowledge/intents_map.json";
import fallback from "../knowledge/fallback.json";
import { fetchAIResponse } from "./fetchAIResponse";

export async function fetchResponse(
  query: string,
  lang: string,
  setMessages?: Function,
  history: any[] = [] // 👈 Added conversation history
): Promise<string> {
  const lowerQ = query.toLowerCase();

  // 🔍 1️⃣ Find KB intent
  const matched = intents.find((i) =>
    i.keywords.some((kw: string) => lowerQ.includes(kw.toLowerCase()))
  );

  // 📘 2️⃣ Try KB match
  if (matched) {
    try {
      // @vite-ignore fixes Vite’s dynamic import warnings
      const kb = await import(
        /* @vite-ignore */ `../knowledge/${matched.file}`
      );
      const entry = kb.default.find((item: any) => item.id === matched.intent);

      if (entry) {
        console.log(`✅ KB match: ${matched.intent}`);
        return entry[lang] || entry.en;
      }
    } catch (err) {
      console.error("💥 KB load error:", err);
    }
  }

  // 🧠 3️⃣ Fallback to OpenAI (with conversation history)
  try {
    console.log("🤖 No KB match → Using OpenAI fallback...");
    const aiReply = await fetchAIResponse(query, lang, setMessages, history);
    if (aiReply && typeof aiReply === "string") return aiReply;
    if (aiReply && typeof aiReply === "object") return aiReply.text;
  } catch (err) {
    console.error("⚠️ AI fallback error:", err);
  }

  // ⚠️ 4️⃣ Static fallback message
  return fallback[lang] || fallback.en;
}
