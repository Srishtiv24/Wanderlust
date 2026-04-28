const express = require("express");
const router  = express.Router();

router.get("/ai-assistant", (req, res) => {
  const autoPrompt = req.query.prompt ? req.query.prompt.trim() : "";
  res.render("ai.ejs", { autoPrompt });
});

router.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: "No messages" });
    }

    const response = await fetch("https://api.kilo.ai/api/gateway/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KILO_API_KEY}`,
      },
      body: JSON.stringify({
        model: "kilo-auto/free",
        stream: false, // 🔥 disable streaming for now (stable UI)
        messages: [
          {
            role: "system",
            content: `You are a travel assistant for India.
- Answer only travel related queries
- Keep answers short (80–120 words max)
- Use INR and Indian locations
- Always use bullet points
- Avoid long paragraphs`
          },
          ...messages
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      "Something went wrong.";
    console.log(reply);
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

module.exports = router;