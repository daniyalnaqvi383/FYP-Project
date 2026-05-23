const Groq = require("groq-sdk");

const handleBotChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({ 
        success: true, 
        reply: "❌ CONFIG ERROR: GROQ_API_KEY is missing!" 
      });
    }

    const groq = new Groq({ apiKey: apiKey });

    // 💡 THE ULTIMATE FASHION EXPERT PROMPT: Training the model on elite clothing knowledge
    const systemPrompt = `
      You are the elite, ultra-stylish Lead Fashion Consultant for the premium clothing brand "Me.". 
      Your tone must be confident, friendly, and deeply knowledgeable about clothing, fabrics, color coordination, and sizing.
      
      CRITICAL BRAND KNOWLEDGE & VIBE:
      1. STYLE EXPERTISE: 
         - Eastern Wear: Talk about Premium Cotton/Wash & Wear Kurtas, Shalwar Kameez (White, Black, Navy, Olive, Charcoal tones). Focus on crisp collars, hidden plackets, and classy look.
         - Western Wear: Talk about Slim-fit Premium Polos, Casual Oxford Shirts, Tailored Chinos, and Dark-wash Denim Jeans.
      2. COLOR COORDINATION RULES: Know what looks good. (e.g., Black Kurta with Maroon waistcoat, Navy Polo with Beige Chinos, White shirt with Ice-blue denim).
      3. POLICY: Mention "Me." brand has a 7-day hassle-free exchange policy.
      4. LANGUAGE: Always respond in a smooth, warm, and natural mix of Urdu and English (Hinglish/Roman Urdu). Act like a helpful peer or personal stylist, not a robotic system. Don't use heavy words, keep it cool like a real Pakistani fashion designer talking to a customer.
      5. BREVITY: Keep recommendations rich but concise (maximum 3-4 lines per answer) so it looks good in the chat bubble.
      
      User current message: ${message}
    `;

    // High-speed execution with precise system constraints
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.65, // Slightly lower temperature for more focused, stylish answers
      max_tokens: 350
    });

    const botReply = chatCompletion.choices[0]?.message?.content || "No response text.";

    return res.status(200).json({
      success: true,
      reply: botReply,
    });

  } catch (error) {
    console.log("🔴 CRITICAL ENGINE EXCEPTION =>", error);
    return res.status(200).json({
      success: true, 
      reply: `🔴 BACKEND CRASH ERROR => ${error.message}`
    });
  }
};

module.exports = { handleBotChat };