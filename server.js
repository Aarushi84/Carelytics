import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route (IMPORTANT for hosting)
app.get("/", (req, res) => {
  res.send("✅ Carelytics backend is running");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "⚠️ Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a health AI assistant. Always answer with bullet points and emojis for clarity."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    let reply =
      data?.choices?.[0]?.message?.content || "⚠️ No response from AI";

    // Force bullet formatting if missing
    if (!reply.includes("•")) {
      reply = reply
        .split(". ")
        .filter(Boolean)
        .map(line => "• " + line)
        .join("\n");
    }

    res.json({ reply });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ reply: "⚠️ AI unavailable" });
  }
});

// IMPORTANT: dynamic port for hosting
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});


         
 
