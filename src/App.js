import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "6495bc77ae3a4af1832a104ffb718915";

const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CITIES = [
  { lat: "-33.8688", lon: "151.2093" },
  { lat: "-27.4698", lon: "153.0251" },
  { lat: "-37.8136", lon: "144.9631" },
  { lat: "-36.5000", lon: "148.3333" }
];

const ASSETS = {
  // background
  background: "https://bit.ly/webApp_Assets_background",

  // arrows
  leftArrow: "https://bit.ly/webApp_Assets_leftArrow",
  rightArrow: "https://bit.ly/webApp_Assets_rightArrow",

  // weather icons
  cloudy: "https://bit.ly/webApp_Assets_cloudy",
  rain: "https://bit.ly/webApp_Assets_rain",
  snow: "https://bit.ly/webApp_Assets_snow",
  sunny: "https://bit.ly/webApp_Assets_sunny",
  thunderStorm: "https://bit.ly/webApp_Assets_thunderStorm"
};

const weatherIcon = code => {
  if (code >= 200 && code <= 233) {
    return "thunderStorm";
  } else if (code >= 300 && code <= 522) {
    return "rain";
  } else if (code >= 600 && code <= 623) {
    return "snow";
  } else if (code === 800) {
    return "sunny";
  } else if (code >= 801 && code <= 804) {
    return "cloudy";
  }
};

const App = () => {
  const [city, setCity] = useState(0);
  const [data, setData] = useState({});
  const [forecast, setForecast] = useState([]);

  const rightClick = () => {
    if (city === CITIES.length - 1) {
      setCity(0);
    } else {
      setCity(city + 1);
    }
  };

  const leftClick = () => {
    if (city === 0) {
      setCity(CITIES.length - 1);
    } else {
      setCity(city - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axios.get(
          `https://api.weatherbit.io/v2.0/forecast/daily?lat=${
            CITIES[city].lat
          }&lon=${CITIES[city].lon}&days=6&key=${API_KEY}`
        );
        if (res.status === 200) {
          setData(res.data);
          setForecast(res.data.data.slice(1, 6));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchData();
  }, [city]);

  const content = (
    <div id="weather-app">
      <div className="left-arrow-container">
        <img
          className="arrow"
          src={ASSETS.leftArrow}
          alt="left-arrow"
          onClick={leftClick}
        />
      </div>
      <div className="right-arrow-container">
        <img
          className="arrow"
          src={ASSETS.rightArrow}
          alt="right-arrow"
          onClick={rightClick}
        />
      </div>
      {Array.isArray(data.data) && (
        <div className="today-weather-container">
          <div className="city-name">
            <p>{data.city_name}</p>
          </div>
          <div>
            <img
              src={ASSETS[weatherIcon(data.data[0].weather.code)]}
              alt={weatherIcon(data.data[0].weather.description)}
            />
          </div>
          <div className="current-temp">
            <p>{parseInt(data.data[0].temp) + "\xB0"}</p>
          </div>
          <div className="today-temp">
            <p>
              {parseInt(data.data[0].min_temp) +
                "\xB0" +
                "       " +
                parseInt(data.data[0].max_temp) +
                "\xB0"}
            </p>
          </div>
          <div className="current-weather-description">
            <p>{data.data[0].weather.description}</p>
          </div>
        </div>
      )}
      <div>
        <hr />
      </div>
      {Array.isArray(forecast) && (
        <div className="forecast-container">
          {forecast.map(v => {
            return (
              <div className="forecast-day-container" key={v.datetime}>
                <div>
                  <p>{WEEK[new Date(v.datetime).getDay()]}</p>
                </div>
                <div>
                  <img
                    src={ASSETS[weatherIcon(v.weather.code)]}
                    alt={v.weather.description}
                  />
                </div>
                <div>
                  <p>{parseInt(v.max_temp) + "/" + parseInt(v.min_temp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  return content;
};

export default App;
