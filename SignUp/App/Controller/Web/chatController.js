// 💡 THE ULTIMATE FIX: Constructor ke jhanjhat se nikalne ke liye direct package core require karein
const GoogleGenAIModule = require("@google/generative-ai");

const handleBotChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Safely check if the module loader initialized correctly
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "GEMINI_API_KEY is missing in .env file" });
    }

    // 💡 WAY OUT: Aggr constructor error de raha hai, to direct function call standard use karein
    // Yeh library ka built-in method hai jo bina 'new' keyword ke client initialize karta hai
    const ai = GoogleGenAIModule.GoogleGenAI ? new GoogleGenAIModule.GoogleGenAI({ apiKey }) : null;
    
    // Fallback approach agar aapka version functions format support karta hai
    const model = ai 
      ? ai.getGenerativeModel({ model: "gemini-1.5-flash" })
      : GoogleGenAIModule.getGenerativeModel 
        ? GoogleGenAIModule.getGenerativeModel({ apiKey, model: "gemini-1.5-flash" })
        : null;

    if (!model) {
      // Third approach for older versions package layouts fallback
      return res.status(500).json({ success: false, message: "Google SDK mapping mismatch. Please verify package version." });
    }

    // Chatbot context behavior system layout rules
    const systemPrompt = `
      You are a smart, professional, and friendly AI fashion assistant for an e-commerce clothing brand named "Me.".
      Your goals are:
      1. Help users choose the right clothing (Eastern wear like Kurtas/Suits, Western wear like Polos/Shirts/Jeans).
      2. Provide sizing tips, color recommendations, and style coordination ideas.
      3. Keep your answers brief, engaging, and directly related to clothing, fashion trends, or store policies (like 7-day easy exchange/returns).
      4. Always match the helpful peer vibe. If the user greets you in Hinglish/Urdu, reply warmly in a mix of Urdu/English (Hinglish), otherwise use professional English.
      
      User message: ${message}
    `;

    // Dispatch request payload execution stream
    const result = await model.generateContent(systemPrompt);
    const botReply = result.response.text || result.response.text();

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