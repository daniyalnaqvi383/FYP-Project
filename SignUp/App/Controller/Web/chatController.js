const { GoogleGenAI } = require("@google/generative-ai");

// Gemini client initialize karein env key se
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const handleBotChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // 💡 SYSTEM PROMPT ENGINEERING: AI ka role fix karne ke liye
    const systemInstruction = `
      You are a smart, professional, and friendly AI fashion assistant for an e-commerce clothing brand named "Me.".
      Your goals are:
      1. Help users choose the right clothing (Eastern wear like Kurtas/Suits, Western wear like Polos/Shirts/Jeans).
      2. Provide sizing tips, color recommendations, and style coordination ideas.
      3. Keep your answers brief, engaging, and directly related to clothing, fashion trends, or store policies (like 7-day easy exchange/returns).
      4. Always match the helpful peer vibe. If the user greets you in Hinglish/Urdu, reply warmly in a mix of Urdu/English (Hinglish), otherwise use professional English.
    `;

    // Gemini 2.5 Flash model use karein (Fastest and free tier optimized)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Creative yet controlled responses
      }
    });

    const botReply = response.text;

    return res.status(200).json({
      success: true,
      reply: botReply,
    });

  } catch (error) {
    console.error("🔥 GEMINI CHATBOT CRASH =>", error);
    return res.status(500).json({
      success: false,
      message: "AI engine side error",
      error: error.message,
    });
  }
};

module.exports = { handleBotChat };