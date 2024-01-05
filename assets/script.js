var searchInput = $('#search-text');
var searchBtn = $('#search-btn');

var city = searchInput.val();


var apiKey = '0ea7d7cb0bccf9d8193db521824c2fad';


// This function brings the current weather from the weather API
function getCurrentForecast(coords) {
    var currentForecast = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    if (coords) {
        currentForecast = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=imperial`;
    }

    $.get(currentForecast)
        .then(function (data) {
            var currentHumidity = data.main.humidity;
            var currentTemperature = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            $('#current-humidity').text("Humidity: " + currentHumidity + " %");
            $('#current-temperature').text("Temperature: " + currentTemperature + `°F`);
            $('#current-windspeed').text("Wind Speed: " + currentWindSpeed + " mph")
            var sunsetURL = `https://api.sunrisesunset.io/json?lat=${data.coord.lat}&lng=${data.coord.lon}`
            storeCityInLocalStorage(data.coord);
            $.get(sunsetURL)
                .then(function (sunData) {
                    var sunriseTime = sunData.results.sunrise;
                    var goldenHourTime = sunData.results.golden_hour;
                    var sunsetTime = sunData.results.sunset;
                    $('#sunrise').text(`Sunrise:  ${sunriseTime}`)
                    $('#golden-hour').text(`Golden Hour: ${goldenHourTime}`)
                    $('#sunset').text(`Sunset: ${sunsetTime}`)

                    console.log(sunData)
                    console.log(sunData.results.sunrise)
                })
            console.log(data)
        })
}


function storeCityInLocalStorage(coord) {

    if (typeof (Storage) !== 'undefined') {

        localStorage.setItem('lon', coord.lon);
        localStorage.setItem('lat', coord.lat);
        +localStorage.getItem('lon')
            + localStorage.getItem('lat')
    } else {
        console.error('Local storage is not supported.');
    }
}

function getUserLocation() {
    navigator.geolocation.getCurrentPosition(function (data) {
        getCurrentForecast(data.coords)
    })
}
searchBtn.click(function () {
    city = searchInput.val();
    getCurrentForecast();

});
getUserLocation();