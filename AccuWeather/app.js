document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "INxmx7eHtYpOJ3AlvxrIhi87AACfGx6v"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchForecastData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayCurrentWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchForecastData(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });

        const dailyUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(dailyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayCurrentWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const icon = data.WeatherIcon;
        setWeatherBackground(icon);
        const weatherContent = `
            <h2>Current Weather</h2>
            <div class="weather-details current-weather">
                <img src="https://developer.accuweather.com/sites/default/files/${String(icon).padStart(2, '0')}-s.png" alt="${weather}">
                <p>Temperature: ${temperature}°C</p>
                <p>Weather: ${weather}</p>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let hourlyContent = `<h2>12-Hour Forecast</h2><div class="forecast-grid">`;
        data.forEach(hour => {
            const time = new Date(hour.DateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const temp = hour.Temperature.Value;
            const weather = hour.IconPhrase;
            const icon = hour.WeatherIcon;
            hourlyContent += `
                <div class="hourly-forecast">
                    <p><strong>${time}</strong></p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(icon).padStart(2, '0')}-s.png" alt="${weather}">
                    <p>Temperature: ${temp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        hourlyContent += `</div>`;
        weatherDiv.innerHTML += hourlyContent;
    }

    function displayDailyForecast(data) {
        let dailyContent = `<h2>5-Day Forecast</h2><div class="forecast-grid">`;
        data.forEach(day => {
            const date = new Date(day.Date).toLocaleDateString();
            const minTemp = day.Temperature.Minimum.Value;
            const maxTemp = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            const icon = day.Day.Icon;
            dailyContent += `
                <div class="daily-forecast">
                    <p><strong>${date}</strong></p>
                    <img src="https://developer.accuweather.com/sites/default/files/${String(icon).padStart(2, '0')}-s.png" alt="${weather}">
                    <p>Min: ${minTemp}°C, Max: ${maxTemp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        dailyContent += `</div>`;
        weatherDiv.innerHTML += dailyContent;
    }

    function setWeatherBackground(icon) {
        const body = document.body;
        if (icon >= 1 && icon <= 5) {
            body.style.backgroundImage = "url('sunny.jpg')";
        } else if (icon >= 6 && icon <= 11) {
            body.style.backgroundImage = "url('cloudy.jpg')";
        } else if (icon >= 12 && icon <= 18) {
            body.style.backgroundImage = "url('rain.jpg')";
        } else if (icon >= 30 && icon <= 44) {
            body.style.backgroundImage = "url('thunder.jpg')";
        }
    }
});
