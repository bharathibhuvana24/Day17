const countriesApiUrl = 'https://restcountries.com/v3.1/all?fields';
const openWeatherApiKey = 'https://openweathermap.org/api/one-call-3#weather_overview'; //OpenWeatherMap API key

// Function to create a Bootstrap card for a country
function createCountryCard(country) {
    const countryName = country.name.common;
    const nativeName = country.name.nativeName ? Object.values(country.name.nativeName)[0].common : 'N/A';
    const capital = country.capital ? country.capital[0] : 'N/A';
    const population = country.population.toLocaleString();
    const region = country.region;
    const subregion = country.subregion ? country.subregion : 'N/A';
    const countryCode = country.cca2;
    const latitude = country.latlng ? country.latlng[0] : 'N/A';
    const longitude = country.latlng ? country.latlng[1] : 'N/A';
    const flagUrl = country.flags && country.flags.png ? country.flags.png : 'https://via.placeholder.com/150';

    // Create card HTML with necessary classes and details
    const cardHtml = `
        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4 mb-4">
            <div class="card h-100" onclick="toggleDetails(this)">
                <div class="card-header">
                    <h5 class="card-title">${countryName}</h5>
                </div>
                <div class="card-body">
                    <img src="${flagUrl}" class="card-img-top mb-3" alt="Flag of ${countryName}">
                    <div class="card-text">
                        <p><strong>Capital:</strong> ${capital}</p>
                        <p><strong>Region:</strong> ${region}</p>
                        <p><strong>Country Code:</strong> ${countryCode}</p>
                    </div>
                </div>
                <div class="card-details card-text" style="display: none;">
                    <p><strong>Native Name:</strong> ${nativeName}</p>
                    <p><strong>Population:</strong> ${population}</p>
                    <p><strong>Subregion:</strong> ${subregion}</p>
                    <p><strong>Latitude:</strong> ${latitude}</p>
                    <p><strong>Longitude:</strong> ${longitude}</p>
                    <button class="btn btn-primary" onclick="fetchWeather('${encodeURIComponent(capital)}', '${countryCode}', this)">Click for weather</button>
                    <div class="weather-info mt-3"></div>
                </div>
            </div>
        </div>
    `;

    // Append card to the countriesRow
    document.getElementById('countriesRow').insertAdjacentHTML('beforeend', cardHtml);
}

// Function to fetch country data and create cards
function fetchCountries() {
    fetch(countriesApiUrl)
        .then(response => response.json())
        .then(data => {
            // Ensure data is an array and contains objects
            if (Array.isArray(data)) {
                data.forEach(country => {
                    createCountryCard(country);
                });
            } else {
                console.error('Data is not an array:', data);
            }
        })
        .catch(error => console.error('Error fetching countries:', error));
}

// Function to fetch weather data from OpenWeatherMap
function fetchWeather(city, countryCode, buttonElement) {
    // Prevent event propagation to card click
    event.stopPropagation();

    if (city === 'N/A') {
        buttonElement.nextElementSibling.innerHTML = `<p class="text-danger">Weather data not available.</p>`;
        return;
    }

    const weatherApiUrl = `https://openweathermap.org/api/one-call-3#weather_overviewq=${city},${countryCode}&appid=${openWeatherApiKey}&units=metric`;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const temperature = data.main.temp;
                const weatherDescription = data.weather[0].description;
                const weatherInfoHtml = `
                    <p><strong>Temperature:</strong> ${temperature} °C</p>
                    <p><strong>Weather:</strong> ${weatherDescription}</p>
                `;
                buttonElement.nextElementSibling.innerHTML = weatherInfoHtml;
            } else {
                buttonElement.nextElementSibling.innerHTML = `<p class="text-danger">Weather data not available for ${decodeURIComponent(city)}.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            buttonElement.nextElementSibling.innerHTML = `<p class="text-danger">Error fetching weather data.</p>`;
        });
}

// Function to toggle the visibility of detailed information
function toggleDetails(cardElement) {
    const details = cardElement.querySelector('.card-details');
    const isVisible = details.style.display === 'block';
    details.style.display = isVisible ? 'none' : 'block';
}

// Call the function to fetch countries
fetchCountries();
