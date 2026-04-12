const apiKey = "2a11b87cd80bc70dca979ab83dc18b91";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
    const response = await fetch(weatherUrl + city + `&appid=${apiKey}`);
    
    if(response.status == 404) {
        alert("Invalid city name");
        return;
    }

    const data = await response.json();
    
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".description").innerHTML = data.weather[0].main;

    const iconCode = data.weather[0].icon;
    document.querySelector(".weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    checkForecast(city);
}

async function checkForecast(city) {
    const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
    const data = await response.json();

    if (response.status == 200) {
        const forecastItems = document.querySelectorAll(".forecast-item");

        // Filter entries that are at or near 12:00:00 (noon) for each future day
        const dailyForecasts = data.list.filter(item =>
            item.dt_txt.includes("12:00:00")
        );

        for (let i = 0; i < forecastItems.length; i++) {
            const dayData = dailyForecasts[i];
            if (dayData) {
                const date = new Date(dayData.dt_txt);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                const fIconCode = dayData.weather[0].icon;

                forecastItems[i].querySelector(".day").innerHTML = dayName;
                forecastItems[i].querySelector(".f-icon").src =
                    `https://openweathermap.org/img/wn/${fIconCode}.png`;
                forecastItems[i].querySelector(".f-temp").innerHTML =
                    Math.round(dayData.main.temp) + "°C";
            }
        }
    }
}

searchBtn.addEventListener("click", () => {
    if (searchBox.value.trim() !== "") {
        checkWeather(searchBox.value);
    }
});

searchBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});