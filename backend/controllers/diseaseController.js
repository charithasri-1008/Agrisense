const axios = require("axios");
const Groq = require("groq-sdk");

const LANGUAGE_NAMES = {
  "en-IN": "English",
  "te-IN": "Telugu",
  "hi-IN": "Hindi",
  "ta-IN": "Tamil",
  "kn-IN": "Kannada",
  "ml-IN": "Malayalam",
};

const getGroqClient = () => {
  const apiKey =
    process.env.GROQ_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  return new Groq({
    apiKey,
  });
};

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

const extractJson = (text) => {
  const cleanedText = String(
    text || ""
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
      `AI did not return valid JSON. Raw response: ${cleanedText}`
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
      `AI JSON parsing failed. Raw response: ${cleanedText}`
    );
  }
};

const normalizeConfidence = (
  score
) => {
  const numericScore =
    Number(score);

  if (
    !Number.isFinite(
      numericScore
    )
  ) {
    return "Low";
  }

  const percentage =
    numericScore <= 1
      ? numericScore * 100
      : numericScore;

  const safePercentage =
    Math.max(
      0,
      Math.min(
        100,
        percentage
      )
    );

  return `${safePercentage.toFixed(
    1
  )}%`;
};

const cleanDiseaseLabel = (
  label
) => {
  return String(label || "")
    .replace(/___/g, " - ")
    .replace(/__/g, " ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const getTopPrediction = (
  responseData
) => {
  let predictions =
    responseData;

  if (
    responseData &&
    Array.isArray(
      responseData.predictions
    )
  ) {
    predictions =
      responseData.predictions;
  }

  if (
    Array.isArray(
      predictions
    ) &&
    Array.isArray(
      predictions[0]
    )
  ) {
    predictions =
      predictions[0];
  }

  if (
    !Array.isArray(
      predictions
    ) ||
    predictions.length === 0
  ) {
    throw new Error(
      "Hugging Face did not return any disease prediction."
    );
  }

  const sortedPredictions =
    [...predictions].sort(
      (a, b) =>
        Number(b?.score || 0) -
        Number(a?.score || 0)
    );

  const topPrediction =
    sortedPredictions[0];

  if (
    !topPrediction ||
    !topPrediction.label
  ) {
    throw new Error(
      "Hugging Face returned an invalid disease prediction."
    );
  }

  return {
    label:
      cleanDiseaseLabel(
        topPrediction.label
      ),

    score:
      Number(
        topPrediction.score
      ),

    alternatives:
      sortedPredictions
        .slice(1, 3)
        .map((item) => ({
          label:
            cleanDiseaseLabel(
              item.label
            ),

          score:
            Number(
              item.score
            ),
        })),
  };
};

const classifyImageWithHuggingFace =
  async (file) => {
    const apiKey =
      process.env
        .HUGGINGFACE_API_KEY
        ?.trim();

    const modelName =
      process.env
        .HUGGINGFACE_MODEL
        ?.trim();

    if (!apiKey) {
      throw new Error(
        "HUGGINGFACE_API_KEY is missing in backend environment variables."
      );
    }

    if (!modelName) {
      throw new Error(
        "HUGGINGFACE_MODEL is missing in backend environment variables."
      );
    }

    const endpoint =
      process.env
        .HUGGINGFACE_INFERENCE_URL
        ?.trim() ||
      `https://router.huggingface.co/hf-inference/models/${modelName}`;

    console.log(
      "Hugging Face model:",
      modelName
    );

    console.log(
      "Hugging Face endpoint:",
      endpoint
    );

    const response =
      await axios.post(
        endpoint,
        file.buffer,
        {
          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              file.mimetype,

            Accept:
              "application/json",
          },

          timeout:
            90000,

          maxBodyLength:
            Infinity,

          maxContentLength:
            Infinity,

          validateStatus:
            () => true,
        }
      );

    console.log(
      "Hugging Face status:",
      response.status
    );

    console.log(
      "Hugging Face response body:",
      response.data
    );

    if (
      response.status < 200 ||
      response.status >= 300
    ) {
      const responseMessage =
        typeof response.data ===
          "string"
          ? response.data
          : response.data?.error ||
            response.data?.message ||
            JSON.stringify(
              response.data
            );

      const requestError =
        new Error(
          responseMessage ||
            "Hugging Face request failed."
        );

      requestError.status =
        response.status;

      requestError.response = {
        status:
          response.status,

        data:
          response.data,
      };

      throw requestError;
    }

    if (
      response?.data?.error
    ) {
      throw new Error(
        typeof response.data.error ===
          "string"
          ? response.data.error
          : JSON.stringify(
              response.data.error
            )
      );
    }

    return getTopPrediction(
      response.data
    );
  };

const generateDiseaseGuidance =
  async ({
    prediction,
    selectedLanguage,
  }) => {
    const groq =
      getGroqClient();

    const modelName =
      process.env
        .GROQ_MODEL
        ?.trim();

    if (
      !groq ||
      !modelName
    ) {
      throw new Error(
        "GROQ_API_KEY or GROQ_MODEL is missing."
      );
    }

    const languageName =
      LANGUAGE_NAMES[
        selectedLanguage
      ] || "English";

    const prompt = `
You are AgriSense AI, an Indian crop disease guidance assistant.

A plant disease image-classification model analyzed an uploaded crop image.

Top prediction:
${prediction.label}

Model confidence:
${normalizeConfidence(
  prediction.score
)}

Other possible predictions:
${JSON.stringify(
  prediction.alternatives
)}

Required response language:
${languageName}

Return exactly one valid JSON object:

{
  "disease": "Disease or visible crop problem",
  "confidence": "Confidence percentage",
  "cause": "Likely cause",
  "symptoms": [
    "Symptom 1",
    "Symptom 2",
    "Symptom 3"
  ],
  "treatment": "Safe practical treatment guidance",
  "prevention": "Prevention guidance",
  "narration": "Short farmer-friendly spoken summary"
}

Strict rules:

1. Write every user-facing value in ${languageName}.
2. Keep JSON property names in English.
3. Use the classifier prediction as the primary disease result.
4. Do not claim certainty when confidence is low.
5. Include exactly three concise symptoms.
6. Give safe farmer-friendly guidance.
7. Do not recommend banned, restricted, or highly hazardous pesticides.
8. Do not provide exact pesticide dosage.
9. Mention that pesticide products must be used according to their label and local agriculture officer guidance.
10. Mention agriculture officer or laboratory confirmation when confidence is low.
11. Do not use markdown.
12. Do not use code blocks.
13. Return valid JSON only.
`;

    const completion =
      await groq.chat
        .completions
        .create({
          model:
            modelName,

          temperature:
            0.2,

          max_completion_tokens:
            1500,

          messages: [
            {
              role:
                "system",

              content:
                "Return strict JSON only. Give safe Indian agriculture guidance.",
            },

            {
              role:
                "user",

              content:
                prompt,
            },
          ],
        });

    const responseText =
      completion
        ?.choices?.[0]
        ?.message?.content ||
      "";

    console.log(
      "Groq disease guidance response:",
      responseText
    );

    if (
      !responseText.trim()
    ) {
      throw new Error(
        "Groq returned an empty disease guidance response."
      );
    }

    return extractJson(
      responseText
    );
  };

const detectDisease = async (
  req,
  res
) => {
  console.log(
    "========== HUGGING FACE DISEASE CONTROLLER RUNNING =========="
  );

  try {
    if (!req.file) {
      return res
        .status(400)
        .json({
          success: false,

          error:
            "Please upload a crop image.",

          message:
            "Please upload a crop image.",
        });
    }

    if (
      !req.file.mimetype ||
      !req.file.mimetype.startsWith(
        "image/"
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,

          error:
            "The uploaded file must be an image.",

          message:
            "The uploaded file must be an image.",
        });
    }

    if (
      !req.file.buffer ||
      req.file.buffer.length === 0
    ) {
      return res
        .status(400)
        .json({
          success: false,

          error:
            "The uploaded image file is empty.",

          message:
            "The uploaded image file is empty.",
        });
    }

    const requestedLanguage =
      req.body?.language ||
      "en-IN";

    const selectedLanguage =
      LANGUAGE_NAMES[
        requestedLanguage
      ]
        ? requestedLanguage
        : "en-IN";

    console.log(
      "Uploaded image:",
      {
        originalName:
          req.file.originalname,

        mimeType:
          req.file.mimetype,

        size:
          req.file.size,

        language:
          selectedLanguage,
      }
    );

    const prediction =
      await classifyImageWithHuggingFace(
        req.file
      );

    console.log(
      "Hugging Face prediction:",
      prediction
    );

    const aiData =
      await generateDiseaseGuidance({
        prediction,
        selectedLanguage,
      });

    const finalResult = {
      disease:
        getString(
          aiData.disease,
          prediction.label
        ),

      confidence:
        getString(
          aiData.confidence,
          normalizeConfidence(
            prediction.score
          )
        ),

      cause:
        getString(
          aiData.cause,
          "The exact cause requires field inspection."
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
          `${prediction.label} was identified as the most likely crop problem.`
        ),

      fallback:
        false,

      source:
        "Hugging Face image classification and Groq guidance",
    };

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
          imageModel:
            process.env
              .HUGGINGFACE_MODEL,

          textModel:
            process.env
              .GROQ_MODEL,

          rawPrediction:
            prediction,
        },
      });
  } catch (error) {
    console.error(
      "========== DISEASE DETECTION ERROR =========="
    );

    console.error(
      "Hugging Face response body:",
      error?.response?.data
    );

    console.error(
      "Status:",
      error?.response?.status ||
        error?.status
    );

    console.error(
      "Message:",
      error?.message
    );

    console.error(error);

    const status =
      Number(
        error?.response?.status ||
        error?.status
      );

    const responseData =
      error?.response?.data;

    const originalMessage =
      typeof responseData ===
        "string"
        ? responseData
        : responseData?.error ||
          responseData?.message ||
          error?.message ||
          String(error);

    let statusCode =
      Number.isInteger(status) &&
      status >= 400 &&
      status <= 599
        ? status
        : 500;

    let friendlyMessage =
      originalMessage;

    if (
      statusCode === 400
    ) {
      friendlyMessage =
        `Hugging Face rejected the image request: ${originalMessage}`;
    } else if (
      statusCode === 401
    ) {
      friendlyMessage =
        "Hugging Face token is invalid. Create a new inference token and update HUGGINGFACE_API_KEY.";
    } else if (
      statusCode === 403
    ) {
      friendlyMessage =
        `Hugging Face denied inference access: ${originalMessage}`;
    } else if (
      statusCode === 404
    ) {
      friendlyMessage =
        "The configured Hugging Face model or inference endpoint was not found.";
    } else if (
      statusCode === 429
    ) {
      friendlyMessage =
        "Hugging Face request limit was reached. Please try again later.";
    } else if (
      statusCode === 503
    ) {
      friendlyMessage =
        "The Hugging Face model is loading or temporarily unavailable. Please try again.";
    }

    return res
      .status(statusCode)
      .json({
        success:
          false,

        error:
          friendlyMessage,

        message:
          friendlyMessage,

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