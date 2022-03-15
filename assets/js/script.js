// personal API key for OpenWeather APIs
var apiKey = "83bebf1283c4aa8fc9f9e297ba8c74e3";

// luxon DateTime call
var DateTime = luxon.DateTime;

var cityNameEl = document.querySelector("#cityName");
var currDateEl = document.querySelector("#currDate");
var weatherIconEl = document.querySelector("#weatherIcon");
var currTempEl = document.querySelector("#currTemp");
var currWindEl = document.querySelector("#currWind");
var currHumEl = document.querySelector("#currHum");
var currUVEl = document.querySelector("#currUV");
var weatherForecastEl = document.querySelector("#weatherForecast");

var cityName;

// geolocation api to provide lat and lon values given a city name, only for US locations
var getGeoLocation = function(city) {
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + city + ",us&APPID=" + apiKey;

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    if (data.length === 0) {
                        alert("Error: City not found");
                        return false;
                    }
                    // gives weather one call api lat & lon data
                    getWeatherData(data[0].lat,data[0].lon);
                    // stores city name
                    cityName = data[0].name;
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

// uses one Call api to provide current and forecast weather data given lat & lon values
var getWeatherData = function(lat,lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&APPID=" + apiKey + "&units=imperial";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    updateWeather(data);
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

// updates weather display for current and forecast
var updateWeather = function(data) {
    var currDate = DateTime.now();

    cityNameEl.innerHTML = cityName;
    currDateEl.innerHTML = currDate.toLocaleString();
    weatherIconEl.innerHTML = "<img src='http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png' width='60' height='60'>";
    currTempEl.innerHTML = data.current.temp;
    currWindEl.innerHTML = data.current.wind_speed;
    currHumEl.innerHTML = data.current.humidity;
    currUVEl.innerHTML = data.current.uvi;

    $("#currUV").removeClass("bg-success bg-warning")
    if (data.current.uvi < 4) {
        $("#currUV").addClass("bg-success");
    }
    else if (data.current.uvi > 3 && data.current.uvi < 8) {
        $("#currUV").addClass("bg-warning");
    }
    else if (data.current.uvi > 7) {
        $("#currUV").addClass("bg-danger");
    }

    // flush forecast
    weatherForecastEl.innerHTML = "";

    // daily data starts at 0 for today, hence forecast starts at 1
    for (var i = 1; i < 6; i++) {
        var forecastDayEl = document.createElement("div");
        forecastDayEl.className = "card col-12 col-lg-6 col-xl-2 bg-secondary text-white fw-bold forecastCard px-1";
        forecastDayEl.innerHTML =
            "<p class='fs-4'>" + currDate.plus({days: i}).toLocaleString() + "</p>" +
            "<img src='http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png' width='60' height=60'" +
            "<p>Temp: " + data.daily[i].temp.day + "&deg;F</p>" +
            "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>" +
            "<p>Humidity: " + data.daily[i].humidity + "%</p>";
        weatherForecastEl.appendChild(forecastDayEl);
    }
};

$("button").on("click", function(event) {
    event.preventDefault();

    var citySearch = $("#citySearch").val().trim();
    
    if (!citySearch) {
        alert("Search field empty!");
        return false;
    }

    getGeoLocation(citySearch);
});

getGeoLocation("Austin");