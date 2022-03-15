// personal API key for OpenWeather APIs
var apiKey = "83bebf1283c4aa8fc9f9e297ba8c74e3";

// luxon DateTime call
var DateTime = luxon.DateTime;

// init search history
var cityHistory = [];

// DOM variables
var cityNameEl = document.querySelector("#cityName");
var currDateEl = document.querySelector("#currDate");
var weatherIconEl = document.querySelector("#weatherIcon");
var currTempEl = document.querySelector("#currTemp");
var currWindEl = document.querySelector("#currWind");
var currHumEl = document.querySelector("#currHum");
var currUVEl = document.querySelector("#currUV");
var weatherForecastEl = document.querySelector("#weatherForecast");

// init city name variable
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

                    // saves to local storage and reloads city history
                    saveSearchHistory();
                    loadSearchHistory();
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
                    // updates weather display
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
    // uses luxon for date
    var currDate = DateTime.now();

    cityNameEl.innerHTML = cityName;
    currDateEl.innerHTML = currDate.toLocaleString();
    weatherIconEl.innerHTML = "<img src='https://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png' width='60' height='60'>";
    currTempEl.innerHTML = data.current.temp;
    currWindEl.innerHTML = data.current.wind_speed;
    currHumEl.innerHTML = data.current.humidity;
    currUVEl.innerHTML = data.current.uvi;

    // logic for UV index
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
            "<img src='https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png' width='60' height=60'" +
            "<p>Temp: " + data.daily[i].temp.day + "&deg;F</p>" +
            "<p>Wind: " + data.daily[i].wind_speed + " MPH</p>" +
            "<p>Humidity: " + data.daily[i].humidity + "%</p>";
        weatherForecastEl.appendChild(forecastDayEl);
    }
};

// logic for history, display when history is present, hide when no history available
var dispClearHistory = function() {
    if (cityHistory.length > 0) {
        $("#clearHistory").removeClass("d-none");
    }
    if (cityHistory.length === 0) {
        $("#clearHistory").addClass("d-none");
    }
};

// loads search history from local storage and generates buttons
var loadSearchHistory = function() {
    cityHistory = JSON.parse(localStorage.getItem("search"));

    // flushes city history DOM
    $("#cityHistory").html("");

    if (!cityHistory) {
        cityHistory = [];
        dispClearHistory();
        return false;
    }

    // generates buttons based on history
    for (var i = 0; i < cityHistory.length; i++) {
        var btn = document.createElement("button");
        btn.className = "btnHistory col-12 btn btn-secondary my-1 text-dark fw-bold";
        btn.textContent = cityHistory[i];
        $("#cityHistory").append(btn);
    }

    // runs logic for clear history button
    dispClearHistory();
};

// organizes city history array and saves to local storage
var saveSearchHistory = function() {
    // removes search if it already exists in history
    for (var i = 0; i < cityHistory.length; i++) {
        if (cityName === cityHistory[i]) {
            cityHistory.splice(i, 1);
        }
    }

    // saves most recent search to top of array
    cityHistory.unshift(cityName);
    while (cityHistory.length > 8) {
        cityHistory.pop();
    }

    localStorage.setItem("search", JSON.stringify(cityHistory));
};

// event listener for form button
$("#btnSearch").on("click", function(event) {
    event.preventDefault();

    var citySearch = $("#citySearch").val().trim();
    
    if (!citySearch) {
        alert("Search field empty!");
        return false;
    }

    // starts code for weather display
    getGeoLocation(citySearch);

    // resets form after submission
    $("form").trigger("reset");
});

// event listener for city history searches
$("#cityHistory").on("click", ".btnHistory", function(event) {
    var citySearch = $(this).text();
    // starts code for weather display
    getGeoLocation(citySearch);
});

// event listener for clear history button
$("#btnClearHistory").on("click", function(event) {
    // resets city history array and saves to local storage
    cityHistory = [];
    localStorage.setItem("search", JSON.stringify(cityHistory));
    // regenerates loaded history display
    loadSearchHistory();
});

// loads history from local storage on page init
loadSearchHistory();