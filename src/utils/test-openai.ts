export async function testOpenAI() {
  const payload = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: "Say Hello!" }],
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
    console.log("✅ OpenAI connected:", data.choices?.[0]?.message?.content);
  } catch (err) {
    console.error("💥 Connection failed:", err);
  }
}
