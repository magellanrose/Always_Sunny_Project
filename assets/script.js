var searchInput = $('#search-text');
var searchBtn = $('#search-btn');
var modalBtn = $('#modal-btn')
var historyModal = $('#history-modal')

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
                    $('#sunrise').text(`${sunriseTime}`)
                    $('#golden-hour').text(`${goldenHourTime}`)
                    $('#sunset').text(`${sunsetTime}`)


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
function getSearchHistory() {
    var rawDataHistory = localStorage.getItem('search-history');
    var history = JSON.parse(rawDataHistory) || [];
    return history;
}

function saveSearchHistory() {
    var history = getSearchHistory();
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('search-history', JSON.stringify(history));
    }
}


function searchHistoryOutput() {
    var citySearched = localStorage.getItem('search-history');
    if (citySearched) {
        var cities = JSON.parse(citySearched);
        var historyOutput = document.querySelector("#history-output");
        cities.forEach(function (citySearched) {
            var button = document.createElement("button");
            button.textContent = citySearched;
            historyOutput.appendChild(button);
        })
    }

}
$('#history-output').on('click', 'button', function () {
    city = $(this).text()
    getCurrentForecast();
    getsunData();


});

searchBtn.click(function () {
    city = searchInput.val();
    getCurrentForecast();
    getsunData();

});

modalBtn.click(function () {
    historyModal.removeClass('hide')
});



getUserLocation();

document.addEventListener('DOMContentLoaded', function () {
    var openModalBtn = document.getElementById('openModalBtn');
    var closeModalBtn = document.getElementById('closeModalBtn');
    var modal = document.getElementById('myModal');

    openModalBtn.addEventListener('click', function () {
        modal.style.display = 'block';
    });

    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});