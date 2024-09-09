# API-Based-Node-Js-Weather-Web-App
A simple weather web application that displays the current weather conditions for a specified city. This app fetches real-time weather data using the OpenWeatherMap API and dynamically updates the content based on the user's input.

# Weather App

A simple weather web application that displays the current weather conditions for a specified city. This app fetches real-time weather data using the OpenWeatherMap API and dynamically updates the content based on the user's input.

## Features

- **City Weather Display**: Fetches real-time weather data for the entered city.
- **Dynamic Temperature Update**: Shows current temperature, minimum and maximum temperatures, city name, and country.
- **Weather Condition Icon**: Displays different weather condition icons such as sunny, cloudy, or haze based on the API response.
- **Responsive Design**: Fully responsive design with a smooth user experience across all devices.
- **Live Date and Time**: Displays the current day, date, and time.
- **Interactive Form**: The user can search for any city by typing into the input field, and the page will update without refreshing.

## Technologies Used

- **HTML5**: Structure of the web page.
- **CSS3**: Styling and animations for the sea and waves.
- **JavaScript (Vanilla)**: Handles API requests, DOM manipulation, and dynamic content update.
- **Node.js**: Backend to serve static files and handle API requests.
- **OpenWeatherMap API**: Fetches real-time weather data.

## Project Structure

- `index.html`: Main HTML file containing the structure of the webpage.
- `style.css`: Contains all the styling for the app, including the animation for the waves.
- `script.js`: Handles form submission, data fetching, and dynamic DOM updates.
- `server.js`: A Node.js server that fetches weather data using the OpenWeatherMap API and serves the HTML, CSS, JS, and SVG files.
- `sunny.svg`, `cloudy.svg`, `haze.svg`, `wave.svg`: Images used for weather icons and wave animations.

## How It Works

1. The user enters the name of a city in the input field and submits the form.
2. The app sends a request to the OpenWeatherMap API to get the current weather information for that city.
3. The temperature, city name, country, and weather condition (Sunny, Clouds, Haze, etc.) are displayed dynamically.
4. Different icons appear based on the weather condition returned by the API.
5. The app also displays a live date and time in the format "Day | Date | Time."

## Code Snippets

### Node.js Server

```javascript
const http = require("http");
const fs = require("fs");
const requests = require("requests");
const url = require("url");

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%temp%}", Math.round((orgVal.main.temp) - 273.15));
    temperature = temperature.replace("{%minTemp%}", Math.round((orgVal.main.temp_min) - 273.15));
    temperature = temperature.replace("{%maxTemp%}", Math.round((orgVal.main.temp_max) - 273.15));
    temperature = temperature.replace("{%city%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempratureStatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const cityName = parsedUrl.query.city || "pune";

    if (parsedUrl.pathname === "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=API_KEY`)
            .on('data', (chunk) => {
                const objData = JSON.parse(chunk);
                const realTimeData = replaceVal(homeFile, objData);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) res.end('Error fetching data');
                res.end();
            });
    }
});

server.listen(8000, () => {
    console.log("Server listening on port 8000");
});
