const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Simple filter for common non-agriculture questions
    const blockedTopics = [
      "cricket",
      "ipl",
      "football",
      "movie",
      "movies",
      "actor",
      "actress",
      "music",
      "song",
      "virat",
      "kohli",
      "dhoni",
      "youtube",
      "instagram",
      "facebook",
      "whatsapp",
      "politics",
      "election",
      "president",
      "prime minister"
    ];

    const lowerMessage = message.toLowerCase();

    if (blockedTopics.some(topic => lowerMessage.includes(topic))) {
      return res.json({
        success: true,
        answer: "I can only answer agriculture-related questions."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are AgriSense AI, an expert agriculture assistant helping farmers across India.

Follow these rules strictly:

1. Answer ONLY agriculture-related questions.
2. Reply in the SAME language as the user's question.
3. If the question is in Telugu, answer in Telugu.
4. If the question is in Hindi, answer in Hindi.
5. If the question is in Tamil, answer in Tamil.
6. If the question is in Kannada, answer in Kannada.
7. If the question is in English, answer in English.
8. Use simple language that farmers can easily understand.
9. Avoid complicated scientific terms unless necessary.
10. Give practical and actionable advice.
11. If fertilizer or pesticide is suggested, remind the user to follow the product label and local agricultural recommendations.
12. If the question is not related to agriculture, reply exactly:
"I can only answer agriculture-related questions."

Always format your response like this:

🌾 Problem:
...

🔍 Possible Cause:
...

✅ Solution:
...

🛡 Prevention:
...

Farmer Question:
${message}
`;

    const result = await model.generateContent(prompt);

    const answer = result.response.text();

    res.json({
      success: true,
      question: message,
      answer,
    });

  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatWithAI,
};