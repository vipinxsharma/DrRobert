// =============================================================
// 🧠 Sophia Laboratories – OpenAI Fallback with Context Memory
// =============================================================
export async function fetchAIResponse(
  query: string,
  lang: string,
  setMessages?: Function,
  history: any[] = [] // 👈 Receives chat history
) {
  const systemPrompt = `You are Sophia Laboratories' Ophthalmology Virtual Assistant.
Answer in ${lang === "es" ? "Spanish" : "English"}.
Be educational, empathetic, and medically compliant.
Never give prescriptions or personal advice.
If unsure, say “I'm not sure” or “I’ll check verified sources.”`;

  // 🧩 Build chat history context (limit to last 6 turns)
  const context = history.slice(-6).map((m) => ({
    role: m.type === "user" ? "user" : "assistant",
    content: m.text,
  }));

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      ...context,
      { role: "user", content: query },
    ],
  };

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const answer =
      data.choices?.[0]?.message?.content ||
      "I’m sorry, I don’t have verified data on that topic right now.";

    console.log("🧩 AI reply:", answer);
    return answer;
  } catch (err) {
    console.error("💥 OpenAI error:", err);
    return "There was a problem connecting to the AI service.";
  }
}
