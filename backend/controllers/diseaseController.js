const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");

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
  Extract JSON safely from Gemini response
*/
const extractJson = (responseText) => {
  const cleanedText = String(
    responseText || ""
  )
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const firstBrace =
    cleanedText.indexOf("{");

  const lastBrace =
    cleanedText.lastIndexOf("}");

  if (
    firstBrace === -1 ||
    lastBrace === -1 ||
    lastBrace <= firstBrace
  ) {
    throw new Error(
      `Gemini did not return valid JSON. Raw response: ${cleanedText}`
    );
  }

  const jsonText =
    cleanedText.slice(
      firstBrace,
      lastBrace + 1
    );

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(
      `Gemini JSON parsing failed. Raw response: ${cleanedText}`
    );
  }
};

/*
  Validate normal string values
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
      .map((item) =>
        item.trim()
      )
      .slice(0, 3);

    if (symptoms.length > 0) {
      return symptoms;
    }
  }

  if (
    typeof value === "string" &&
    value.trim()
  ) {
    return [
      value.trim(),
    ];
  }

  return [];
};

/*
  Detect Gemini/API error status
*/
const getErrorStatus = (error) => {
  const directStatus =
    Number(
      error?.status ||
      error?.response?.status
    );

  if (
    Number.isInteger(
      directStatus
    ) &&
    directStatus >= 400 &&
    directStatus <= 599
  ) {
    return directStatus;
  }

  const message =
    String(
      error?.message || ""
    ).toLowerCase();

  if (
    message.includes("429") ||
    message.includes("quota") ||
    message.includes(
      "resource_exhausted"
    ) ||
    message.includes(
      "too many requests"
    )
  ) {
    return 429;
  }

  if (
    message.includes("404") ||
    message.includes(
      "not found"
    ) ||
    message.includes(
      "model is no longer available"
    )
  ) {
    return 404;
  }

  if (
    message.includes("403") ||
    message.includes(
      "permission_denied"
    ) ||
    message.includes(
      "permission denied"
    )
  ) {
    return 403;
  }

  if (
    message.includes("401") ||
    message.includes(
      "api key not valid"
    ) ||
    message.includes(
      "unauthorized"
    )
  ) {
    return 401;
  }

  return 500;
};

/*
  User-friendly error message
*/
const getFriendlyError = (
  statusCode,
  originalMessage
) => {
  if (statusCode === 429) {
    return (
      "Gemini request limit has been reached. " +
      "Please wait and try again later, or use another Gemini API key/project."
    );
  }

  if (statusCode === 404) {
    return (
      "The configured Gemini model is unavailable. " +
      "Set GEMINI_MODEL to an image-capable model available for your Gemini API project."
    );
  }

  if (statusCode === 401) {
    return (
      "The Gemini API key is invalid. " +
      "Check GEMINI_API_KEY in the backend environment variables."
    );
  }

  if (statusCode === 403) {
    return (
      "The Gemini API request was denied. " +
      "Check API permissions, billing, and model access."
    );
  }

  return (
    originalMessage ||
    "Disease detection failed."
  );
};

/*
  Disease detection controller
*/
const detectDisease = async (
  req,
  res
) => {
  console.log(
    "========== DISEASE CONTROLLER RUNNING =========="
  );

  try {
    /*
      Step 1: Validate uploaded file
    */
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error:
          "Please upload a crop image.",
      });
    }

    if (
      !req.file.mimetype ||
      !req.file.mimetype.startsWith(
        "image/"
      )
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
      Step 2: Validate Gemini API key
    */
    const apiKey =
      process.env
        .GEMINI_API_KEY
        ?.trim();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error:
          "GEMINI_API_KEY is missing in the backend environment variables.",
      });
    }

    /*
      Step 3: Validate Gemini model
    */
    const modelName =
      process.env
        .GEMINI_MODEL
        ?.trim();

    if (!modelName) {
      return res.status(500).json({
        success: false,
        error:
          "GEMINI_MODEL is missing. Set an image-capable Gemini model available for your API project.",
      });
    }

    console.log(
      "Gemini API key loaded:",
      true
    );

    console.log(
      "Gemini model:",
      modelName
    );

    /*
      Step 4: Select language
    */
    const requestedLanguage =
      req.body?.language ||
      "en-IN";

    const selectedLanguage =
      LANGUAGE_NAMES[
        requestedLanguage
      ]
        ? requestedLanguage
        : "en-IN";

    const languageName =
      LANGUAGE_NAMES[
        selectedLanguage
      ];

    /*
      Step 5: Create Gemini client
    */
    const genAI =
      new GoogleGenerativeAI(
        apiKey
      );

    const model =
      genAI.getGenerativeModel({
        model:
          modelName,

        generationConfig: {
          temperature:
            0.2,

          maxOutputTokens:
            1800,

          responseMimeType:
            "application/json",
        },
      });

    /*
      Step 6: Prepare image
    */
    const imagePart = {
      inlineData: {
        data:
          req.file.buffer.toString(
            "base64"
          ),

        mimeType:
          req.file.mimetype,
      },
    };

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
      Step 7: Disease analysis prompt
    */
    const prompt = `
You are AgriSense AI, an Indian crop disease analysis assistant.

Carefully analyze the actual uploaded crop, plant, leaf, fruit, stem, or field image.

Required response language:
${languageName}

Return ONLY one valid JSON object.

Do not write markdown.
Do not use code blocks.
Do not write any explanation before or after the JSON.

Use exactly this JSON structure:

{
  "disease": "Detected disease name or visible crop problem",
  "confidence": "Realistic confidence percentage",
  "cause": "Likely cause of the problem",
  "symptoms": [
    "Visible symptom 1",
    "Visible symptom 2",
    "Visible symptom 3"
  ],
  "treatment": "Safe and practical treatment guidance",
  "prevention": "Prevention guidance",
  "narration": "Short farmer-friendly spoken summary"
}

Strict rules:

1. Write all user-facing JSON values in ${languageName}.
2. Keep JSON property names in English.
3. Analyze only what is visible in the uploaded image.
4. Do not invent a disease when image evidence is unclear.
5. If identification is uncertain, clearly mention uncertainty.
6. If the uploaded image is not related to a plant or crop, state that crop disease identification is not possible.
7. Confidence must be realistic and must not automatically be 100%.
8. Include exactly three short visible symptoms whenever possible.
9. Give safe, practical, farmer-friendly guidance.
10. Do not recommend banned, restricted, or highly hazardous pesticides.
11. Do not provide exact pesticide dosage.
12. State that pesticide products must be used according to their label and local agriculture officer guidance.
13. Mention agriculture officer or laboratory confirmation when the disease is uncertain.
14. Do not stop sentences halfway.
15. Return valid JSON only.
`;

    /*
      Step 8: Send prompt and image
    */
    const result =
      await model.generateContent([
        {
          text: prompt,
        },
        imagePart,
      ]);

    /*
      Step 9: Inspect Gemini response
    */
    const candidate =
      result
        ?.response
        ?.candidates?.[0];

    const finishReason =
      candidate
        ?.finishReason ||
      "UNKNOWN";

    console.log(
      "Gemini finish reason:",
      finishReason
    );

    console.log(
      "Gemini safety ratings:",
      candidate
        ?.safetyRatings ||
        []
    );

    const responseText =
      result
        ?.response
        ?.text?.() ||
      "";

    console.log(
      "Gemini raw response:",
      responseText
    );

    if (
      !responseText.trim()
    ) {
      throw new Error(
        `Gemini returned an empty response. Finish reason: ${finishReason}`
      );
    }

    /*
      Step 10: Convert Gemini response to JSON
    */
    const aiData =
      extractJson(
        responseText
      );

    /*
      Step 11: Validate final output
    */
    const finalResult = {
      disease:
        getString(
          aiData.disease,
          "Unable to identify accurately"
        ),

      confidence:
        getString(
          aiData.confidence,
          "Low"
        ),

      cause:
        getString(
          aiData.cause,
          "The exact cause could not be determined."
        ),

      symptoms:
        getSymptoms(
          aiData.symptoms
        ),

      treatment:
        getString(
          aiData.treatment,
          "Consult a local agriculture officer before applying treatment."
        ),

      prevention:
        getString(
          aiData.prevention,
          "Inspect crops regularly and maintain field hygiene."
        ),

      narration:
        getString(
          aiData.narration,
          "The image analysis has been completed."
        ),

      fallback:
        false,
    };

    /*
      Step 12: Send success response
    */
    return res
      .status(200)
      .json({
        success:
          true,

        language:
          selectedLanguage,

        result:
          finalResult,

        debug: {
          model:
            modelName,

          finishReason,
        },
      });
  } catch (error) {
    console.error(
      "========== FULL DISEASE ERROR =========="
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
      "========================================"
    );

    const originalMessage =
      error?.message ||
      String(error) ||
      "Disease detection failed.";

    const statusCode =
      getErrorStatus(
        error
      );

    const friendlyError =
      getFriendlyError(
        statusCode,
        originalMessage
      );

    return res
      .status(statusCode)
      .json({
        success:
          false,

        error:
          friendlyError,

        details:
          originalMessage,

        status:
          statusCode,
      });
  }
};

module.exports = {
  detectDisease,
};