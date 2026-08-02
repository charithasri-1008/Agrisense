const translations = {
  "en-IN": {
    title:
      "5-Day Weather Forecast",

    min: "Min",
    max: "Max",
    humidity: "Humidity",
    rain: "Rain",
    noForecast:
      "Forecast is not available.",
  },

  "te-IN": {
    title:
      "5 రోజుల వాతావరణ సూచన",

    min: "కనిష్ఠం",
    max: "గరిష్ఠం",
    humidity: "తేమ",
    rain: "వర్షం",
    noForecast:
      "వాతావరణ సూచన అందుబాటులో లేదు.",
  },

  "hi-IN": {
    title:
      "5 दिनों का मौसम पूर्वानुमान",

    min: "न्यूनतम",
    max: "अधिकतम",
    humidity: "नमी",
    rain: "बारिश",
    noForecast:
      "मौसम पूर्वानुमान उपलब्ध नहीं है।",
  },

  "ta-IN": {
    title:
      "5 நாள் வானிலை முன்னறிவிப்பு",

    min: "குறைந்த",
    max: "அதிக",
    humidity: "ஈரப்பதம்",
    rain: "மழை",
    noForecast:
      "வானிலை முன்னறிவிப்பு கிடைக்கவில்லை.",
  },

  "kn-IN": {
    title:
      "5 ದಿನಗಳ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",

    min: "ಕನಿಷ್ಠ",
    max: "ಗರಿಷ್ಠ",
    humidity: "ಆರ್ದ್ರತೆ",
    rain: "ಮಳೆ",
    noForecast:
      "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಲಭ್ಯವಿಲ್ಲ.",
  },

  "ml-IN": {
    title:
      "5 ദിവസത്തെ കാലാവസ്ഥാ പ്രവചനം",

    min: "കുറഞ്ഞ",
    max: "കൂടിയ",
    humidity: "ഈർപ്പം",
    rain: "മഴ",
    noForecast:
      "കാലാവസ്ഥാ പ്രവചനം ലഭ്യമല്ല.",
  },
};

const localeMap = {
  "en-IN": "en-IN",
  "te-IN": "te-IN",
  "hi-IN": "hi-IN",
  "ta-IN": "ta-IN",
  "kn-IN": "kn-IN",
  "ml-IN": "ml-IN",
};

function formatForecastDate(
  date,
  language
) {
  const parsedDate =
    new Date(`${date}T12:00:00`);

  if (
    Number.isNaN(
      parsedDate.getTime()
    )
  ) {
    return date;
  }

  return new Intl.DateTimeFormat(
    localeMap[language] ||
      "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  ).format(parsedDate);
}

function FiveDayForecast({
  forecast = [],
  language = "en-IN",
}) {
  const text =
    translations[language] ||
    translations["en-IN"];

  if (
    !Array.isArray(forecast) ||
    forecast.length === 0
  ) {
    return null;
  }

  return (
    <section className="mx-auto mt-8 max-w-6xl rounded-3xl bg-white p-5 shadow-2xl sm:p-8">
      <h2 className="mb-8 text-center text-3xl font-bold text-green-700 sm:text-4xl">
        📅 {text.title}
      </h2>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {forecast.map(
          (day) => (
            <article
              key={day.date}
              className="rounded-2xl border border-green-100 bg-gradient-to-b from-blue-50 to-green-50 p-5 text-center shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="font-bold text-green-800">
                {formatForecastDate(
                  day.date,
                  language
                )}
              </p>

              <div className="my-4 text-5xl">
                {day.icon ||
                  "🌤️"}
              </div>

              <p className="min-h-12 font-semibold capitalize text-gray-700">
                {day.description ||
                  day.condition}
              </p>

              <p className="mt-3 text-3xl font-bold text-gray-900">
                {day.temperature}
                °C
              </p>

              <div className="mt-4 space-y-2 text-sm text-gray-700">
                <div className="flex justify-between gap-2">
                  <span>
                    🔻 {text.min}
                  </span>

                  <strong>
                    {
                      day.minimumTemperature
                    }
                    °C
                  </strong>
                </div>

                <div className="flex justify-between gap-2">
                  <span>
                    🔺 {text.max}
                  </span>

                  <strong>
                    {
                      day.maximumTemperature
                    }
                    °C
                  </strong>
                </div>

                <div className="flex justify-between gap-2">
                  <span>
                    💧{" "}
                    {text.humidity}
                  </span>

                  <strong>
                    {day.humidity}%
                  </strong>
                </div>

                <div className="flex justify-between gap-2">
                  <span>
                    🌧️ {text.rain}
                  </span>

                  <strong>
                    {
                      day.rainProbability
                    }
                    %
                  </strong>
                </div>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

export default FiveDayForecast;