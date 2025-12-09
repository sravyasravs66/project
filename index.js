let searchHistory = [];

const getWheather = async (fromHistory = false) => {

    let city = document.getElementById("city").value.trim().toLowerCase();

    // Clear messages
    document.getElementById("errormsg").innerHTML = "";
    document.getElementById("result").innerHTML = "";

    if (city === "") {
        document.getElementById("errormsg").innerHTML = "Please enter a city name.";
        return;
    }

    showLoading(true);

    try {
        const response = await new Promise(resolve => {
            setTimeout(() => resolve(fetch("cities.json")), 1500);
        });

        if (!response.ok) throw new Error("API Error");

        const data = await response.json();
        showLoading(false);

        const { cities } = data;
        let foundCity = cities.find(item => item.name.toLowerCase() === city);

        if (!foundCity) {
            document.getElementById("errormsg").innerHTML = "City not found.";
            return;
        }

        let weatherIcon = getIcon(foundCity.temperature);

        document.getElementById("result").innerHTML = `
            <div class="weather-card">
                <div class="icon-emoji">${weatherIcon}</div>
                <h3>${foundCity.name}</h3>
                <p><b>🌡 Temperature:</b> ${foundCity.temperature}°C</p>
                <p><b>💧 Humidity:</b> ${foundCity.humidity}%</p>
                <p><b>🌬 Wind Speed:</b> ${foundCity.wind} km/h</p>
            </div>
        `;

        if (!fromHistory) updateHistory(foundCity.name);

    } catch (error) {
        showLoading(false);
        document.getElementById("errormsg").innerHTML =
            "Unable to fetch weather.";
    }
};

function showLoading(isLoading) {
    document.getElementById("loading").style.display =
        isLoading ? "block" : "none";
}

function getIcon(temp) {
    if (temp <= 15) return "❄️";
    if (temp < 30) return "⛅";
    return "☀️";
}

function updateHistory(cityName) {

    // Make unique by removing if it already exists
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== cityName.toLowerCase());

    // Add latest search at top
    searchHistory.unshift(cityName);

    // Limit to 5 items
    searchHistory = searchHistory.slice(0, 5);

    showHistory();
}

function showHistory() {

    let historyHTML = `<h3>Search History</h3>`;

    if (searchHistory.length === 0) {
        historyHTML += `<p style="font-size:13px;color:#555;">No searches yet</p>`;
    } else {
        historyHTML += searchHistory
            .map(item => `<div class="history-item" onclick="fillFromHistory('${item}')">🔎 ${item}</div>`)
            .join("");
    }

    document.getElementById("history").innerHTML = historyHTML;
}

// When history item is clicked
function fillFromHistory(cityName) {
    document.getElementById("city").value = cityName;
    getWheather(true); // true = do NOT update history again
}










