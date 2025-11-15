const apiKey = '961a55ab7ed2af2bf001c2eaa2b82e17'; // Replace with your OpenWeatherMap API key

async function getWeather(city = null) {
  const cityInput = document.getElementById("city").value;
  const query = city || cityInput;
  const info = document.getElementById("weather-info");

  if (!query) {
    info.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      info.innerHTML = `<p>${data.message}</p>`;
      return;
    }

    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    // document.body.style.background = getBackground(data.weather[0].main);
    document.body.style.backgroundImage = "url('sky3.jpg')";

    info.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="${icon}" alt="Weather Icon" />
      <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
      <p>🌡️ Temp: ${data.main.temp} °C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind: ${data.wind.speed} m/s</p>
    `;
  } catch (err) {
    info.innerHTML = "<p>Error fetching weather data.</p>";
  }
}

function getLocation() {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    getWeather(data.name);
  });
}

function startVoice() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-IN";
  recognition.start();

  recognition.onresult = (event) => {
    const city = event.results[0][0].transcript;
    document.getElementById("city").value = city;
    getWeather(city);
  };
}

function getBackground(condition) {
  switch (condition.toLowerCase()) {
    case "clear": return "linear-gradient(to right, #2980b9, #6dd5fa)";
    case "clouds": return "linear-gradient(to right, #bdc3c7, #2c3e50)";
    case "rain": return "linear-gradient(to right, #00c6ff, #0072ff)";
    case "snow": return "linear-gradient(to right, #e6dada, #274046)";
    case "thunderstorm": return "linear-gradient(to right, #141e30, #243b55)";
    default: return "linear-gradient(to right, #0f2027, #203a43, #2c5364)";
  }
}

