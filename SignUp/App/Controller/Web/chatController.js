// 💡 THE ULTRA STABLE FIX: Import the direct generation method wrapper
const { GoogleGenAI } = require("@google/generative-ai");

const handleBotChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("❌ CRITICAL: GEMINI_API_KEY is missing inside your .env file!");
      return res.status(500).json({ success: false, message: "API key environment configuration missing" });
    }

    // 💡 NEW INDUSTRY STANDARD: Instantiate the client with correct option block formatting
    const ai = new GoogleGenAI({ apiKey: apiKey });
    
    // Stable production model allocation mapping channel
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Chatbot configuration behavior engine prompt
    const systemPrompt = `
      You are a smart, professional, and friendly AI fashion assistant for an e-commerce clothing brand named "Me.".
      Your goals are:
      1. Help users choose the right clothing (Eastern wear like Kurtas/Suits, Western wear like Polos/Shirts/Jeans).
      2. Provide sizing tips, color recommendations, and style coordination ideas.
      3. Keep your answers brief, engaging, and directly related to clothing, fashion trends, or store policies (like 7-day easy exchange/returns).
      4. Always match the helpful peer vibe. If the user greets you in Hinglish/Urdu, reply warmly in a mix of Urdu/English (Hinglish), otherwise use professional English.
      
      User message: ${message}
    `;

    // Dispatching content streaming promise context execution payload
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const botReply = response.text; // 👈 Fixed text lookup interface formatting parsing method

    return res.status(200).json({
      success: true,
      reply: botReply,
    });

  } catch (error) {
    console.error("🔥 GEMINI CHATBOT CRASH LOG =>", error);
    return res.status(500).json({
      success: false,
      message: "AI engine side error",
      error: error.message,
    });
  }
};

module.exports = { handleBotChat };