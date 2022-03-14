// personal API key for OpenWeather APIs
var apiKey = "f2d15a6e422f4a15fa49aa2a30e4bec0";

var getGeoLocation = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&APPID=" + apiKey;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data[0].name);
                    console.log(data[0].lat);
                    console.log(data[0].lon);
                    getWeatherData(data[0].lat,data[0].lon);
                });
            }
            else {
                alert("Error: City not found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

var getWeatherData = function(lat,lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&APPID=" + apiKey + "&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                    console.log("Weather Icon: " + data.current.weather[0].icon);
                    console.log("Temp: " + data.current.temp + "F");
                    console.log("Wind: " + data.current.wind_speed + "MPH");
                    console.log("Humidity: " + data.current.humidity + "%");
                    console.log("UV Index: " + data.current.uvi);

                    console.log("Daily Forecast (1-5), 0 is today");
                    console.log(data.daily[1].weather[0].icon);
                    console.log(data.daily[1].temp.day);
                    console.log(data.daily[1].wind_speed);
                    console.log(data.daily[1].humidity);
                });
            }
            else {
                alert("Error: Weather data not found");
            }
        })
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        });
};

getGeoLocation("Austin");

// Weather Icon:
// http://openweathermap.org/img/wn/[icon]@2x.png