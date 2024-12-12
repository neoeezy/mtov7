const apiKey = 'ddb588d7e8e7697ba5eebdc276725c88';
const map = L.map('map').setView([48.8566, 2.3522], 5); // Centré sur Paris
const weatherDisplay = document.getElementById('weather-display');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const backButton = document.getElementById('back-button');
const suggestions = document.getElementById('suggestions');
const weatherBanner = document.getElementById('weather-banner');
const videoSource = document.getElementById('video-source');

// Ajouter la carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Ajouter le contrôle de zoom en bas à droite de la carte
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// Ajouter un marqueur interactif sur clic
map.on('click', async (e) => {
    const { lat, lng } = e.latlng;
    const weatherData = await fetchWeatherByCoords(lat, lng);
    displayWeather(weatherData);
    toggleMapView(false); // Masquer la carte et afficher la météo
    updateBackgroundVideo(weatherData.weather[0].main);
});

// Fonction de recherche par ville
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();
    if (!city) return;
    const weatherData = await fetchWeatherByCity(city);
    const { coord } = weatherData;
    map.setView([coord.lat, coord.lon], 10); // Recentrer la carte
    displayWeather(weatherData);
    toggleMapView(false); // Masquer la carte et afficher la météo
    updateBackgroundVideo(weatherData.weather[0].main);
});

// Obtenir la météo par coordonnées
async function fetchWeatherByCoords(lat, lon) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
    );
    const data = await response.json();
    return data;
}

// Obtenir la météo par ville
async function fetchWeatherByCity(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`
    );
    const data = await response.json();
    return data;
}

// Affichage des informations météo
function displayWeather(weatherData) {
    const { name, main, weather } = weatherData;
    const temp = Math.round(main.temp);
    const description = weather[0].description;
    weatherDisplay.innerHTML = `${name}: ${temp}°C, ${description}`;
    weatherDisplay.style.display = 'block';
}

// Retour à la carte
backButton.addEventListener('click', () => {
    toggleMapView(true);
});

// Affichage de la météo défilante
async function displayWeatherBanner() {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
    let cityIndex = 0;

    // Fonction pour mettre à jour la bannière avec une nouvelle ville
    const updateBanner = async () => {
        const city = cities[cityIndex];
        const weatherInfo = await fetchWeatherByCity(city);
        const { name, main, weather } = weatherInfo;
        const temp = Math.round(main.temp);
        const description = weather[0].description;
        weatherBanner.textContent = `${name}: ${temp}°C, ${description}`;
        cityIndex = (cityIndex + 1) % cities.length; // Passer à la ville suivante, boucle
    };

    // Mise à jour toutes les 15 secondes (plus lentement)
    setInterval(updateBanner, 15000);
    updateBanner(); // Afficher immédiatement la première ville
}

// Démarrer l'affichage de la météo défilante
displayWeatherBanner();

// Mettre à jour la vidéo de fond en fonction de la météo
function updateBackgroundVideo(weatherCondition) {
    let videoFile = '';
    switch (weatherCondition.toLowerCase()) {
        case 'clear':
            videoFile = 'sunny.mp4';
            break;
        case 'rain':
            videoFile = 'rainy.mp4';
            break;
        case 'snow':
            videoFile = 'snowy.mp4';
            break;
        case 'clouds':
            videoFile = 'cloudy.mp4';
            break;
        default:
            videoFile = 'sunny.mp4'; // Par défaut, afficher une vidéo ensoleillée
            break;
    }
    videoSource.src = `videos/${videoFile}`;
    const video = document.getElementById('background-video');
    video.load();
    video.play();
}

// Initialisation de la carte et de la météo
toggleMapView(true);

// Gérer l'affichage carte / météo
function toggleMapView(showMap) {
    map.getContainer().style.display = showMap ? 'block' : 'none';
    weatherDisplay.style.display = showMap ? 'none' : 'block';
}

const cities = ['Paris', 'Porto', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
const citySuggestions = document.getElementById('suggestions');

// Fonction de recherche avec autocomplétion
cityInput.addEventListener('input', () => {
    const query = cityInput.value.toLowerCase();
    citySuggestions.innerHTML = ''; // Effacer les suggestions précédentes
    if (query) {
        const filteredCities = cities.filter(city => city.toLowerCase().startsWith(query));
        filteredCities.forEach(city => {
            const suggestion = document.createElement('div');
            suggestion.textContent = city;
            suggestion.onclick = () => {
                cityInput.value = city;
                citySuggestions.innerHTML = ''; // Effacer les suggestions après sélection
            };
            citySuggestions.appendChild(suggestion);
        });
        citySuggestions.style.display = filteredCities.length > 0 ? 'block' : 'none';
    } else {
        citySuggestions.style.display = 'none';
    }
});

// Ajouter la carte OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

// Ajouter le contrôle de zoom au centre à droite
L.control.zoom({
    position: 'topright' // Positionner le zoom à droite
}).addTo(map);

// Fonction pour récupérer la météo par ville (réutilisée pour l'autocomplétion)
async function fetchWeatherByCity(city) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`
    );
    const data = await response.json();
    return data;
}

// Rendre la bannière météo totalement invisible, mais faire défiler le texte
async function displayWeatherBanner() {
    let cityIndex = 0;

    // Fonction pour mettre à jour la bannière avec une nouvelle ville
    const updateBanner = async () => {
        const city = cities[cityIndex];
        const weatherInfo = await fetchWeatherByCity(city);
        const { name, main, weather } = weatherInfo;
        const temp = Math.round(main.temp);
        const description = weather[0].description;
        weatherBanner.textContent = `${name}: ${temp}°C, ${description}`;
        cityIndex = (cityIndex + 1) % cities.length; // Passer à la ville suivante, boucle
    };

    // Mise à jour toutes les 15 secondes (plus lentement)
    setInterval(updateBanner, 15000);
    updateBanner(); // Afficher immédiatement la première ville
}

displayWeatherBanner(); // Lancer le défilement dès le début

