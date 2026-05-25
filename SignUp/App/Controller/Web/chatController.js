const Groq = require("groq-sdk");

// 💡 INTERNAL MEMORY CACHE: Short-term session chat history save rakhne ke liye
let chatSessions = {};

const handleBotChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ success: true, reply: "❌ CONFIG ERROR: GROQ_API_KEY is missing!" });
    }

    const groq = new Groq({ apiKey: apiKey });

    // Dummy user session allocation (In real production, you can use userId/session token)
    const sessionId = "default_user";
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = [];
    }

    // 💡 SYSTEM PROMPT: Elite Stylist Framework
    const systemPrompt = `
      You are "Me. Assistant", the elite luxury virtual stylist and fashion consultant for the premium clothing brand "Me.".
      You format your output beautifully using markdown (bolding key words, using clean bullet points for lists).

      LANGUAGE DUALITY:
      - If user types in Roman Urdu/Hinglish (e.g., "mujhe combo batao", "kya haal hai"), reply in highly fluent, modern, trendy Roman Urdu/Hinglish. Sound like a supportive, cool fashion peer.
      - If user types in English, reply in flawless, high-end professional English.

      SMART INSTRUCTIONS:
      1. SHORT GREETINGS: If user says just "Hi", "Salam", etc., give a 1-line sweet energetic greeting.
      2. WARDROBE RECOMMENDATIONS: Use bold text and short bullet points. Eastern (Kurtas, Waistcoats in Black, White, Navy) and Western (Premium Polos, Oxford shirts, Chinos, Dark Denim).
      3. CONTEXT AWARENESS: You have access to previous conversation history. Use it to answer follow-up questions intelligently.
      4. BRAND POLICY: 7-day hassle-free exchange policy.
    `;

    // 💡 COMPILE MESSAGES WITH HISTORY
    let apiMessages = [{ role: "system", content: systemPrompt }];
    
    // Add last 4 messages from history for context awareness without hitting token limits
    const history = chatSessions[sessionId].slice(-4);
    history.forEach(msg => apiMessages.push(msg));
    
    // Add current user message
    apiMessages.push({ role: "user", content: message });

    const chatCompletion = await groq.chat.completions.create({
      messages: apiMessages,
      model: "llama-3.1-8b-instant",
      temperature: 0.55,
      max_tokens: 350
    });

    const botReply = chatCompletion.choices[0]?.message?.content || "No response text.";

    // Save current turn to history
    chatSessions[sessionId].push({ role: "user", content: message });
    chatSessions[sessionId].push({ role: "assistant", content: botReply });

    return res.status(200).json({
      success: true,
      reply: botReply,
    });

  } catch (error) {
    console.log("🔴 CRITICAL ENGINE EXCEPTION =>", error);
    return res.status(200).json({ success: true, reply: `🔴 BACKEND CRASH ERROR => ${error.message}` });
  }
};

module.exports = { handleBotChat };