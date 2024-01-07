var currentDate = dayjs();

var searchInput = $('#search-text');
var city = searchInput.val();

var searchBtn = $('#search-btn');
var modalBtn = $('#modal-btn')
var historyBtn = $('#history-btn');
var cityDate = $('#city-date-title')
var launchModal = $('#launchModal')


var modalBody = $('.modal-body')
var historyModal = $('.modal-content')
var historyModal = new bootstrap.Modal('#history-modal', {});

var apiKey = '0ea7d7cb0bccf9d8193db521824c2fad';
var localStorageData = JSON.parse(localStorage.getItem('search-history')) || []

var searchHistory = getSearchHistory();


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

            cityDate.text(`${city}, ${currentDate.format('MMMM, D, YYYY')}`)
            $('#current-humidity').text(`${currentHumidity} %`);
            $('#current-temperature').text(`${currentTemperature} °F`);
            $('#current-windspeed').text(`${currentWindSpeed} MPH`)
            var sunsetURL = `https://api.sunrisesunset.io/json?lat=${data.coord.lat}&lng=${data.coord.lon}`
            storeCityInLocalStorage(data.coord);

            historyBtn.prop('disabled', false)

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

// Click events
historyBtn.click(searchHistoryOutput);
searchBtn.click(function () {
    city = searchInput.val();

    if (city) {
        saveSearchHistory();
        getCurrentForecast();
    }
});

// This function allows us to get the weather and the sun information for all the elements in the history element by clicking on them in the history modal.

$('#history-output').on('click', 'button', function () {
    city = $(this).text();
    getCurrentForecast();

});

// This enable the history modal to hide once an element within the modal is clicked

$("#history-output").click(function () {

    historyModal.hide();
});

getUserLocation();

if (searchHistory.length) {
    historyBtn.removeClass('hide');
}