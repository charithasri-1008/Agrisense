const Groq = require("groq-sdk");

/*
  Supported languages
*/
const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

/*
  Extract JSON safely from Groq response
*/
const extractJson = (responseText) => {
  const cleanedText = String(responseText || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace = cleanedText.indexOf("{");
  const lastBrace = cleanedText.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      `Groq did not return valid JSON. Raw response: ${cleanedText}`
    );
  }

  const jsonText = cleanedText.slice(
    firstBrace,
    lastBrace + 1
  );

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(
      `Groq JSON parsing failed. Raw response: ${cleanedText}`
    );
  }
};

/*
  Validate string values
*/
const getString = (
  value,
  fallback = "Not available"
) => {
  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return value.trim();
  }

  return fallback;
};

/*
  Validate symptoms array
*/
const getSymptoms = (value) => {
  if (Array.isArray(value)) {
    const symptoms = value
      .filter(
        (item) =>
          typeof item === "string" &&
          item.trim()
      )
      .map((item) => item.trim())
      .slice(0, 3);

    if (symptoms.length > 0) {
      return symptoms;
    }
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return [value.trim()];
  }

  return [];
};

/*
  Detect suitable HTTP status code
*/
const getErrorStatus = (error) => {
  const errorMessage = String(
    error?.message || ""
  ).toLowerCase();

  const directStatus = Number(
    error?.status
  );

  if (
    Number.isInteger(directStatus) &&
    directStatus >= 400 &&
    directStatus <= 599
  ) {
    return directStatus;
  }

  if (
    errorMessage.includes("429") ||
    errorMessage.includes("rate limit") ||
    errorMessage.includes("quota")
  ) {
    return 429;
  }

  if (
    errorMessage.includes("403") ||
    errorMessage.includes("permission")
  ) {
    return 403;
  }

  if (
    errorMessage.includes("401") ||
    errorMessage.includes("api key") ||
    errorMessage.includes("unauthorized")
  ) {
    return 401;
  }

  if (
    errorMessage.includes("413") ||
    errorMessage.includes("too large")
  ) {
    return 413;
  }

  return 500;
};

/*
  Disease detection controller
*/
const detectDisease = async (req, res) => {
  console.log(
    "========== GROQ DISEASE CONTROLLER RUNNING =========="
  );

  try {
    /*
      Step 1: Validate uploaded file
    */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Please upload a crop image.",
      });
    }

    if (
      !req.file.mimetype ||
      !req.file.mimetype.startsWith("image/")
    ) {
      return res.status(400).json({
        success: false,
        error:
          "The uploaded file must be an image.",
      });
    }

    if (
      !req.file.buffer ||
      req.file.buffer.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error:
          "The uploaded image file is empty.",
      });
    }

    /*
      Optional safety limit: 8 MB
    */
    const maximumImageSize =
      8 * 1024 * 1024;

    if (
      req.file.buffer.length >
      maximumImageSize
    ) {
      return res.status(413).json({
        success: false,
        error:
          "Image is too large. Please upload an image smaller than 8 MB.",
      });
    }

    /*
      Step 2: Validate Groq API key
    */
    const apiKey =
      process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error:
          "GROQ_API_KEY is missing in the backend environment variables.",
      });
    }

    /*
      The selected Groq model must support image input.
      Set this value in Railway variables.
    */
    const modelName =
      process.env.GROQ_VISION_MODEL?.trim();

    if (!modelName) {
      return res.status(500).json({
        success: false,
        error:
          "GROQ_VISION_MODEL is missing. Add a Groq model that supports image input.",
      });
    }

    console.log(
      "Groq API key loaded:",
      true
    );

    console.log(
      "Groq vision model:",
      modelName
    );

    /*
      Step 3: Select language
    */
    const requestedLanguage =
      req.body?.language || "en-IN";

    const selectedLanguage =
      LANGUAGE_NAMES[requestedLanguage]
        ? requestedLanguage
        : "en-IN";

    const languageName =
      LANGUAGE_NAMES[selectedLanguage];

    /*
      Step 4: Prepare image as a data URL
    */
    const base64Image =
      req.file.buffer.toString("base64");

    const imageDataUrl =
      `data:${req.file.mimetype};base64,${base64Image}`;

    console.log(
      "Uploaded image details:",
      {
        originalName:
          req.file.originalname,
        mimeType:
          req.file.mimetype,
        size:
          req.file.size,
      }
    );

    /*
      Step 5: Create Groq client
    */
    const groq = new Groq({
      apiKey,
    });

    /*
      Step 6: Disease analysis prompt
    */
    const prompt = `
You are AgriSense AI, an Indian crop disease analysis assistant.

Carefully inspect the uploaded crop, plant, leaf, fruit, stem, or field image.

Required response language:
${languageName}

Return only one valid JSON object.

Do not use markdown.
Do not use code blocks.
Do not add text before or after the JSON.

Use exactly this JSON structure:

{
  "disease": "Detected disease name or visible crop problem",
  "confidence": "Realistic confidence percentage",
  "cause": "Likely cause of the visible problem",
  "symptoms": [
    "Visible symptom 1",
    "Visible symptom 2",
    "Visible symptom 3"
  ],
  "treatment": "Safe and practical treatment guidance",
  "prevention": "Practical prevention guidance",
  "narration": "Short farmer-friendly spoken summary"
}

Strict rules:

1. Write all JSON values in ${languageName}.
2. Keep all JSON property names in English.
3. Analyze only what is visible in the uploaded image.
4. Do not invent a disease when the evidence is unclear.
5. When uncertain, mention uncertainty clearly.
6. If the image is not related to a crop or plant, state that crop disease identification is not possible.
7. Confidence must be realistic and must not automatically be 100%.
8. Include up to three short visible symptoms.
9. Give safe and farmer-friendly guidance.
10. Do not recommend banned, restricted, or highly hazardous pesticides.
11. Do not provide exact pesticide dosage.
12. State that products must be used according to their label and local agriculture officer guidance.
13. Recommend agriculture officer or laboratory confirmation when identification is uncertain.
14. Do not stop sentences halfway.
15. Return valid JSON only.
`;

    /*
      Step 7: Send prompt and image to Groq
    */
    const completion =
      await groq.chat.completions.create({
        model: modelName,

        temperature: 0.2,

        max_completion_tokens: 1800,

        messages: [
          {
            role: "system",
            content:
              "You analyze agricultural images carefully and return strict JSON only.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl,
                },
              },
            ],
          },
        ],
      });

    /*
      Step 8: Read Groq response
    */
    const responseText =
      completion?.choices?.[0]
        ?.message?.content || "";

    const finishReason =
      completion?.choices?.[0]
        ?.finish_reason || "unknown";

    console.log(
      "Groq finish reason:",
      finishReason
    );

    console.log(
      "Groq raw response:",
      responseText
    );

    if (!responseText.trim()) {
      throw new Error(
        `Groq returned an empty response. Finish reason: ${finishReason}`
      );
    }

    /*
      Step 9: Parse JSON
    */
    const aiData =
      extractJson(responseText);

    /*
      Step 10: Validate output
    */
    const finalResult = {
      disease: getString(
        aiData.disease,
        "Unable to identify accurately"
      ),

      confidence: getString(
        aiData.confidence,
        "Low confidence"
      ),

      cause: getString(
        aiData.cause,
        "The exact cause could not be determined."
      ),

      symptoms: getSymptoms(
        aiData.symptoms
      ),

      treatment: getString(
        aiData.treatment,
        "Consult a local agriculture officer before applying treatment."
      ),

      prevention: getString(
        aiData.prevention,
        "Inspect crops regularly and maintain field hygiene."
      ),

      narration: getString(
        aiData.narration,
        "The crop image analysis has been completed."
      ),

      fallback: false,
    };

    /*
      Step 11: Send response
    */
    return res.status(200).json({
      success: true,
      language: selectedLanguage,
      result: finalResult,

      debug: {
        model: modelName,
        finishReason,
      },
    });
  } catch (error) {
    console.error(
      "========== FULL GROQ DISEASE ERROR =========="
    );

    console.error(error);

    console.error(
      "Error name:",
      error?.name
    );

    console.error(
      "Error status:",
      error?.status
    );

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Error cause:",
      error?.cause
    );

    console.error(
      "============================================="
    );

    const errorMessage =
      error?.message ||
      String(error) ||
      "Disease detection failed.";

    const statusCode =
      getErrorStatus(error);

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      status: statusCode,
    });
  }
};

module.exports = {
  detectDisease,
};