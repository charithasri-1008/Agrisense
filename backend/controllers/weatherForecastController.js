const axios =
  require("axios");

const SUPPORTED_LANGUAGES = {
  "en-IN": "en",
  "te-IN": "te",
  "hi-IN": "hi",
  "ta-IN": "ta",
  "kn-IN": "kn",
  "ml-IN": "ml",
};

const getApiLanguage = (
  language
) => {
  return (
    SUPPORTED_LANGUAGES[
      language
    ] || "en"
  );
};

const getWeatherIcon = (
  condition
) => {
  const normalized =
    String(
      condition || ""
    ).toLowerCase();

  if (
    normalized.includes(
      "thunder"
    )
  ) {
    return "⛈️";
  }

  if (
    normalized.includes("rain")
  ) {
    return "🌧️";
  }

  if (
    normalized.includes(
      "drizzle"
    )
  ) {
    return "🌦️";
  }

  if (
    normalized.includes(
      "cloud"
    )
  ) {
    return "☁️";
  }

  if (
    normalized.includes(
      "clear"
    )
  ) {
    return "☀️";
  }

  if (
    normalized.includes("snow")
  ) {
    return "❄️";
  }

  if (
    normalized.includes("mist") ||
    normalized.includes("fog") ||
    normalized.includes("haze")
  ) {
    return "🌫️";
  }

  return "🌤️";
};

const groupForecastByDay = (
  forecastList
) => {
  const groupedDays = {};

  forecastList.forEach(
    (forecastItem) => {
      const date =
        forecastItem.dt_txt
          ?.split(" ")[0];

      if (!date) {
        return;
      }

      if (!groupedDays[date]) {
        groupedDays[date] = [];
      }

      groupedDays[date].push(
        forecastItem
      );
    }
  );

  return groupedDays;
};

const createDailyForecast = (
  date,
  dailyItems
) => {
  const temperatures =
    dailyItems
      .map(
        (item) =>
          item.main?.temp
      )
      .filter(
        Number.isFinite
      );

  const minimumTemperatures =
    dailyItems
      .map(
        (item) =>
          item.main?.temp_min
      )
      .filter(
        Number.isFinite
      );

  const maximumTemperatures =
    dailyItems
      .map(
        (item) =>
          item.main?.temp_max
      )
      .filter(
        Number.isFinite
      );

  const humidities =
    dailyItems
      .map(
        (item) =>
          item.main?.humidity
      )
      .filter(
        Number.isFinite
      );

  const rainProbabilities =
    dailyItems
      .map((item) =>
        Number(item.pop || 0)
      )
      .filter(
        Number.isFinite
      );

  /*
   * Afternoon forecast generally
   * represents the day better.
   */
  const representativeItem =
    dailyItems.find((item) =>
      item.dt_txt?.includes(
        "12:00:00"
      )
    ) ||
    dailyItems.find((item) =>
      item.dt_txt?.includes(
        "15:00:00"
      )
    ) ||
    dailyItems[
      Math.floor(
        dailyItems.length / 2
      )
    ];

  const condition =
    representativeItem
      ?.weather?.[0]?.main ||
    "Weather";

  const description =
    representativeItem
      ?.weather?.[0]
      ?.description ||
    "";

  const averageTemperature =
    temperatures.length
      ? temperatures.reduce(
          (total, value) =>
            total + value,
          0
        ) /
        temperatures.length
      : null;

  const averageHumidity =
    humidities.length
      ? humidities.reduce(
          (total, value) =>
            total + value,
          0
        ) /
        humidities.length
      : null;

  const maximumRainProbability =
    rainProbabilities.length
      ? Math.max(
          ...rainProbabilities
        )
      : 0;

  return {
    date,

    timestamp:
      representativeItem?.dt ||
      null,

    temperature:
      averageTemperature !==
      null
        ? Number(
            averageTemperature.toFixed(
              1
            )
          )
        : null,

    minimumTemperature:
      minimumTemperatures.length
        ? Number(
            Math.min(
              ...minimumTemperatures
            ).toFixed(1)
          )
        : null,

    maximumTemperature:
      maximumTemperatures.length
        ? Number(
            Math.max(
              ...maximumTemperatures
            ).toFixed(1)
          )
        : null,

    humidity:
      averageHumidity !== null
        ? Math.round(
            averageHumidity
          )
        : null,

    rainProbability:
      Math.round(
        maximumRainProbability *
          100
      ),

    condition,

    description,

    icon:
      getWeatherIcon(
        condition
      ),
  };
};

const getFiveDayForecast =
  async (req, res) => {
    try {
      const latitude =
        Number(
          req.query.latitude
        );

      const longitude =
        Number(
          req.query.longitude
        );

      const language =
        String(
          req.query.language ||
            "en-IN"
        ).trim();

      if (
        !Number.isFinite(
          latitude
        ) ||
        !Number.isFinite(
          longitude
        ) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              "Valid latitude and longitude are required.",
          });
      }

      if (
        !process.env
          .WEATHER_API_KEY
      ) {
        return res
          .status(500)
          .json({
            success: false,

            message:
              "Weather API is not configured.",
          });
      }

      const response =
        await axios.get(
          "https://api.openweathermap.org/data/2.5/forecast",
          {
            params: {
              lat: latitude,

              lon: longitude,

              appid:
                process.env
                  .WEATHER_API_KEY,

              units: "metric",

              lang:
                getApiLanguage(
                  language
                ),
            },

            timeout: 10000,
          }
        );

      const forecastList =
        Array.isArray(
          response.data?.list
        )
          ? response.data.list
          : [];

      const groupedDays =
        groupForecastByDay(
          forecastList
        );

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      let forecast =
        Object.entries(
          groupedDays
        )
          .filter(
            ([date]) =>
              date !== today
          )
          .slice(0, 5)
          .map(
            ([
              date,
              dailyItems,
            ]) =>
              createDailyForecast(
                date,
                dailyItems
              )
          );

      /*
       * Depending on timezone, excluding
       * today may sometimes return only
       * four days. Include today in that
       * case so UI always gets five cards.
       */
      if (
        forecast.length < 5
      ) {
        forecast =
          Object.entries(
            groupedDays
          )
            .slice(0, 5)
            .map(
              ([
                date,
                dailyItems,
              ]) =>
                createDailyForecast(
                  date,
                  dailyItems
                )
            );
      }

      return res
        .status(200)
        .json({
          success: true,

          city:
            response.data?.city
              ?.name || null,

          country:
            response.data?.city
              ?.country || null,

          timezone:
            response.data?.city
              ?.timezone || 0,

          forecast,
        });
    } catch (error) {
      console.error(
        "Forecast controller error:",
        error.response?.data ||
          error.message
      );

      if (
        error.response?.status ===
        401
      ) {
        return res
          .status(500)
          .json({
            success: false,

            message:
              "Weather API key is invalid.",
          });
      }

      if (
        error.code ===
        "ECONNABORTED"
      ) {
        return res
          .status(504)
          .json({
            success: false,

            message:
              "Forecast service took too long to respond.",
          });
      }

      return res
        .status(500)
        .json({
          success: false,

          message:
            "Unable to fetch the five-day forecast.",
        });
    }
  };

module.exports = {
  getFiveDayForecast,
};