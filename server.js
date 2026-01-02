import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req,res)=>{
  try{
    const userMessage = req.body.message;
    const response = await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
      },
      body:JSON.stringify({
        model:"gpt-4o-mini",
        messages:[
          { role:"system", content:"You are a health AI assistant. Always answer with bullet points and emojis for clarity." },
          { role:"user", content:userMessage }
        ]
      })
    });
    const data = await response.json();
    let reply = data.choices[0].message.content || "";
    if(!reply.includes("•")){ reply = reply.split(". ").map(s=>"• "+s).join("\n"); }
    res.json({ reply });
  }catch(e){
    console.error(e); res.status(500).json({ reply:"⚠️ AI unavailable" });
  }
});

app.listen(3000,()=>console.log("✅ Server running at http://localhost:3000"));
