var searchInput = $('#search-text');
var city = searchInput.val();

var searchBtn = $('#search-btn');
var modalBtn = $('#modal-btn')
var historyBtn = $('#history-btn');

var modalBody = $('.modal-body')
var historyModal = $('.modal-content')
var historyModal = new bootstrap.Modal('#history-modal', {});

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
                    $('#sunrise').text(`${sunriseTime}`)
                    $('#golden-hour').text(`${goldenHourTime}`)
                    $('#sunset').text(`${sunsetTime}`)


                })
        })
}

// Store coordinates to local storage
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

// Ask user for current location
function getUserLocation() {
    navigator.geolocation.getCurrentPosition(function (data) {
        getCurrentForecast(data.coords)
    })
}

// Getting search history from local storage
function getSearchHistory() {
    var rawDataHistory = localStorage.getItem('search-history');
    var history = JSON.parse(rawDataHistory) || [];
    return history;
}

// Saving search history to local storage and avoiding duplicates
function saveSearchHistory() {
    var history = getSearchHistory();
    var lowerCased = history.map(function (city) {
        return city.toLowerCase();
    });
    if (!lowerCased.includes(city.toLowerCase())) {
        history.push(city);
        localStorage.setItem('search-history', JSON.stringify(history));
    }
}

// Outputting saved searches to modal
function searchHistoryOutput() {
    var citySearched = localStorage.getItem('search-history')
    var savedCitySearched = JSON.parse(citySearched) || [];

    if (savedCitySearched.length) {
        modalBody.empty();

        for (i = 0; i < savedCitySearched.length; i++) {
            modalBody.append(`
            <button>${savedCitySearched[i]}</button>
                  `)
            if (i === 8) {
                break;
            }

        }

        historyModal.show();
    }

}

// Frunction for buttons inside hisory modal to get weather/ sun information 
$('#history-output').on('click', 'button', function () {
    city = $(this).text();
    getCurrentForecast();

});

// Click events
historyBtn.click(searchHistoryOutput);
searchBtn.click(function () {
    city = searchInput.val();
    saveSearchHistory();
    getCurrentForecast();
});

getUserLocation();


document.addEventListener('DOMContentLoaded', function () {

});