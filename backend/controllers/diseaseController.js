const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const detectDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `
You are an expert agriculture assistant.

Analyze the uploaded crop leaf image.

Return ONLY valid JSON.

{
  "disease":"...",
  "confidence":"...",
  "cause":"...",
  "treatment":"...",
  "prevention":"..."
}
`;

    const result = await model.generateContent([
      prompt,
      imagePart,
    ]);

    let text = result.response.text();

    // Remove markdown if Gemini returns it
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResult;

    try {
      parsedResult = JSON.parse(text);
    } catch {
      parsedResult = {
        rawResponse: text,
      };
    }

    res.json({
      success: true,
      result: parsedResult,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Disease Detection Failed",
    });
  }
};

module.exports = {
  detectDisease,
};