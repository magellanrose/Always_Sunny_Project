var searchInput = $('#search-text');
var searchBtn = $('#search-btn');
var city = searchInput.val();


var apiKey = '0ea7d7cb0bccf9d8193db521824c2fad';


// This function brings the current weather from the weather API
function getCurrentForecast() {
    var currentForecast = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
    $.get(currentForecast)
        .then(function (data) {
            var currentHumidity = data.main.humidity;
            var currentTemperature = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            $('#current-humidity').text("Humidity: " + currentHumidity + " %");
            $('#current-temperature').text("Temperature: " + currentTemperature + " &#8457");
            $('#current-windspeed').text("Wind Speed: " + currentWindSpeed + " mph")
        })
        console.log(city)
}

searchBtn.click(function () {
    city = searchInput.val();
    getCurrentForecast();

});
