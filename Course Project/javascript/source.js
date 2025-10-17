
let apiKey;
let lat;
let lon;
let input;
let currentLocation = null;
const errorMsg = document.getElementById("error")


const GPSButton = document.getElementById("gpsbutton")

GPSButton.addEventListener("click", () => { 
    navigator.geolocation.getCurrentPosition(position => {
        lat = position.coords.latitude
        lon = position.coords.longitude
       // console.log("Lat: ", lat, "Lon: ", lon)
        fetchCurrentWeatherData()
    })
})

const fetchCurrentWeatherData = async () => {
    unit = getUnit()
    apiKey ="9a85031e4d032c1ab007d887b496a78e"
    let symbol = getSymbol(unit)

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`
    const geoCodingUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    let cityNameResponse = await fetch(geoCodingUrl)
    let cityNameData = await cityNameResponse.json()
    let cityName = cityNameData[0].name;
    currentLocation = cityNameData[0].name
    let country = cityNameData[0].country;
    if (country == "FI") {
        country = "Finland" //shhhhhh
    }

    let currentWeatherResponse = await fetch(currentWeatherUrl)
    let currentWeatherData = await currentWeatherResponse.json()
   // console.log(currentWeatherData)

    let weatherType = currentWeatherData.weather[0].icon
    //console.log(weatherType)
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${weatherType}@2x.png`
    

    

    document.getElementById("nameCity").innerHTML = cityName + ", " + country
    document.getElementById("temperature").innerHTML= Math.round(currentWeatherData.main.temp) + symbol
    document.getElementById("feelsLike").innerHTML = currentWeatherData.main.feels_like + symbol
    document.getElementById("humidity").innerHTML = currentWeatherData.main.humidity + " %"
    speedUnit = getSpeed(unit)
    document.getElementById("wind").innerHTML = currentWeatherData.wind.speed + speedUnit

    document.getElementById("misc1").innerHTML = "Highest Temp:" + currentWeatherData.main.temp_max + symbol
    document.getElementById("misc2").innerHTML = "Lowest Temp:" +currentWeatherData.main.temp_min + symbol

    if (unit == "metric"){
        updateColor(currentWeatherData.main.temp, "metric");
    } else if (unit == "imperial" ) {
        updateColor(currentWeatherData.main.temp, "imperial")
    } else { 
        updateColor(currentWeatherData.main.temp, "k")
    }
    }

const searchButton = document.getElementById("searchButton")
const searchBar = document.getElementById("searchBar")

searchButton.addEventListener("click", () => {
    if (searchBar.value === "") {
        errorMsg.innerHTML += "<br>Please enter a city first";
        setTimeout(() => {errorMsg.textContent=""}, 5000)
        return
    }
    input = searchBar.value.trim() // trim poistaa ylimääräset välit lopusta ja alustaaa
    fetchSearchData()


});


const fetchSearchData = async () => {
    apiKey = "1a49e38a019fbb3b27bd4f82c99d5eef"
    unit = getUnitForSearchAPI()
    console.log(unit)
    symbol = getSymbol(getUnit())
    speedUnit = getSpeed(getUnit())

    const searchWeatherURL = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${input}&units=${unit}`
    
    const response = await fetch(searchWeatherURL)
    if (!response.ok) {
        errorMsg.innerHTML += "<br>Search failed, are you sure you entered a real city?"
        setTimeout(() => {errorMsg.textContent=""}, 5000)
        return
    }
        
    const responseForImage = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=9a85031e4d032c1ab007d887b496a78e`)
    

    
    
    const searchData = await response.json()
    const dataForImage = await responseForImage.json()
    console.log(searchData)
    let weatherType = dataForImage.weather[0].icon || "01d"
    document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${weatherType}@2x.png`//using openweathermaps API for icons, because it is way better
    currentLocation = searchData.location.name

    document.getElementById("nameCity").innerHTML = searchData.location.name + ", " + searchData.location.country
    document.getElementById("temperature").innerHTML= searchData.current.temperature + symbol
    document.getElementById("feelsLike").innerHTML = searchData.current.feelslike + symbol
    document.getElementById("humidity").innerHTML = searchData.current.humidity + " %"
    document.getElementById("wind").innerHTML = searchData.current.wind_speed + speedUnit
    ratingUV = getUVRating(searchData.current.uv_index)
    document.getElementById("misc1").innerHTML = "UV: " + searchData.current.uv_index + ratingUV
    document.getElementById("misc2").innerHTML = ""
   // console.log(searchData.current.temperature)
    if (unit == "m"){
        updateColor(searchData.current.temperature, "metric");
    } else if (unit == "f" ) {
        updateColor(searchData.current.temperature, "imperial")
    } else { 
        updateColor(searchData.current.temperature, "kelvin")
    }
    

}

function getUVRating(UV) {
    if (UV <= 2) {
        return "(Low)"
    } else if (UV <= 5) {
        return "(Moderate)"
    } else if (UV <= 7) {
        return "(High)"
    } else if (UV <= 10) {
        return "(Very high)"
    } else if (UV > 11) {
        return "(Extreme)"
    } else {
        return ""
    }
}


function getUnit() {
    return document.querySelector('input[name=unit]:checked').value
}
function getUnitForSearchAPI() {
    unit = document.querySelector('input[name=unit]:checked').value
    if (unit === "metric") {
        return "m"
    } else if (unit === "imperial"){
        return "f"
    } else {
        return "s"
    }
}

function getSymbol(unit) {
    let symbol;
    if (unit == "metric") {
        symbol = "°C"
    } else if (unit == "imperial"){
        symbol = "°F"
    } else {
        symbol = " K"
    }
    return symbol
}

function getSpeed(unit) {
    if (unit == "metric") {
        speed = " m/s"
    } else if (unit == "imperial"){
        speed = " mph"
    } else {
        speed = " m/s"
    }
    return speed
}

const weeklyForecastBtn = document.getElementById("dailyBtn")
weeklyForecastBtn.addEventListener("click", async() => {
    if (currentLocation === null) {
        errorMsg.innerHTML += "<br>Please enter a city first";
        setTimeout(() => {errorMsg.textContent=""}, 5000)
        return
    }
    weeklyForecastSetUp()
})



async function weeklyForecastSetUp() {
    data = await getLocation()
    let URL;
    lat = data.results[0].latitude
    lon = data.results[0].longitude
    unit = getUnit()
    if (unit == "imperial") {
        URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}0&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit`
    } else {
        URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}0&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min`
    }


    let API_response = await fetch(URL)
    let API_data = await API_response.json()
   // console.log(API_data) 
   forecastBuilder(API_data)
}
const sixteenBtn = document.getElementById("newBtn")
sixteenBtn.addEventListener("click", async() => {
    if (currentLocation === null) {
        errorMsg.innerHTML += "<br>Please enter a city first";
        setTimeout(() => {errorMsg.textContent=""}, 5000)
        return
    }

    sixteenForecastSetUp()
})

async function sixteenForecastSetUp() {

    data = await getLocation()
    let URL;
    lat = data.results[0].latitude
    lon = data.results[0].longitude
    unit = getUnit()
    
    if (unit == "imperial") {
        URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}0&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&forecast_days=16`
    } else {
        URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}0&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=16`
    }


    let API_response = await fetch(URL)
    let API_data = await API_response.json()
    forecastBuilder(API_data)
}

    


    const hourlyButton = document.getElementById("hourlyBtn")

    hourlyButton.addEventListener("click", () => { 
        if (currentLocation === null) {
            eerrorMsg.innerHTML += "<br>Please enter a city first";
            setTimeout(() => {errorMsg.textContent=""}, 5000)
            return
        }
        hourlyForecastSetUp()
    })
    
    async function getLocation() {
        const geolocationURL = `https://geocoding-api.open-meteo.com/v1/search?name=${currentLocation}&count=10&language=en&format=json`
        let response = await fetch(geolocationURL)
        let data = await response.json()
        return data
    }
    async function hourlyForecastSetUp() {
        data = await getLocation()
        let URL;
        lat = data.results[0].latitude
        lon = data.results[0].longitude
        unit = getUnit()
    
        if (unit == "imperial") {
            URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&forecast_hours=24&hourly=,temperature_2m,weather_code,precipitation_probability,is_day&temperature_unit=fahrenheit&forecast_days=1&timezone=auto`
        } else { 
            URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&forecast_hours=24&hourly=,temperature_2m,weather_code,precipitation_probability,is_day&forecast_days=1&timezone=auto`
        }
        let response = await fetch(URL)
        data = await response.json()
        console.log(data)
        hourlyForecastBuilder(data)
       
    }

function forecastBuilder(data) {
    const icons = {
        0: "☀️",
        1: "🌤️",
        2: "⛅",
        3: "☁️",
        45: "🌫️",
        51: "🌦️",
        61: "🌧️",
        71: "❄️",
        95: "⛈️"
      };
    forecastContainer.innerHTML = ""
    symbol = getSymbol(getUnit())
    if (symbol == " K") {
        symbol = "°C"
    }
    for (let i = 0; i < data.daily.time.length; i++) {
        const div = document.createElement("div");
        div.classList.add("day-card")
        div.innerHTML = `
        <p class="emoji">${icons[data.daily.weather_code[i]] || "☁️"}
        <p class="maxtemp">${data.daily.temperature_2m_max[i] + symbol}</p>
        <p class="mintemp">${data.daily.temperature_2m_min[i] + symbol}</p>
        <p class="day">${data.daily.time[i]}</p> `
        forecastContainer.appendChild(div)
    }
}

function hourlyForecastBuilder(data) {
    const dayIcons = {
        0: "☀️",
        1: "🌤️",
        2: "⛅",
        3: "☁️",
        45: "🌫️",
        51: "🌦️",
        61: "🌧️",
        71: "❄️",
        95: "⛈️"
      };
    const nightIcons = {
        0: "🌕",  
        1: "🌖",   
        2: "🌤️", 
        3: "☁️",
        45: "🌫️", 
        51: "🌧️", 
        61: "🌧️", 
        71: "🌨️", 
        95: "🌩️" 
    }; //ChatGPT auttoi näitten kahden icons variablen kanssa.
    
    forecastContainer.innerHTML = ""
    symbol = getSymbol(getUnit())
    if (symbol == " K") {
        symbol = "°C"
    }
    for (let i = 0; i < 24; i++) {
        if (data.hourly.is_day[i] === 0) {
            icons = nightIcons
        } else {
            icons = dayIcons
        }

        const hour = data.hourly.time[i].split("T")[1].split(":")[0]; //chatgpt auttoi tämän kanssa
        const div = document.createElement("div");
        div.classList.add("day-card")
        div.innerHTML = `
        <p class="emoji">${icons[data.hourly.weather_code[i]] || "☁️"}
        <p class="maxtemp">${data.hourly.temperature_2m[i]+ symbol}</p>
        <p class="mintemp">💧${data.hourly.precipitation_probability[i]}% </p>
        <p class="day">${hour}</p> `
        forecastContainer.appendChild(div)
    }
}
    
    const favouriteBtn = document.getElementById("addFavourite");
    const favouritesBar = document.getElementById("favourites");      
    favouriteBtn.addEventListener("click", () => {
        if (!currentLocation) {
            errorMsg.innerHTML += "<br>Please enter a city first";
            setTimeout(() => {errorMsg.textContent=""}, 5000)
          return;
        }

        for (let i = 0; i < favourites.options.length; i++) {
            if (favourites.options[i].value === currentLocation) {
                errorMsg.innerHTML += "<br>City is already in favourites";
                setTimeout(() => {errorMsg.textContent=""}, 5000)
                return // valmiiksi tallennettu
        }}
        let newFav = document.createElement("option")
        newFav.text = currentLocation
        newFav.value = currentLocation
        favouritesBar.add(newFav)
        favouriteBtn.textContent = "Added to favourites!"
        setTimeout(() => {favouriteBtn.textContent="+ Add City To Favourites"}, 5000)
    })

favouritesBar.addEventListener("change", () => {
    input = favouritesBar.value
    fetchSearchData()
})

const switchMode = document.getElementById("switchMode")
const header = document.querySelector(".header");
const innerheader = document.querySelector(".innerheader");
let lightMode = false;

switchMode.addEventListener("click", () => {
    lightMode = !lightMode;
    if (lightMode) {
        document.body.style.backgroundImage = 'url("../images/lightbg.png")';
        header.style.backgroundColor = "#888888";
        innerheader.style.background = "#888888";
    }
    else {
        document.body.style.backgroundImage = 'url("../images/background.png")';
        header.style.backgroundColor = "#232426";
        innerheader.style.background = "#232426";
    }
})

const hot = document.getElementById("hotBtn")
const cold = document.getElementById("coldBtn")

favouritesBar.addEventListener("change", () => {
    input = favouritesBar.value
    fetchSearchData()
})

hot.addEventListener("click", () => {
    input = "Dallol"
    fetchSearchData()
})
cold.addEventListener("click", () => {
    input = "Oymyakon"
    fetchSearchData()
})





function updateColor(temp, unit) { //tässä funktiossa hyödynsin chatgptiä
    let color;

  if (unit === "metric"){
    if (temp <= 0) {
      color = "rgba(0, 100, 255, 0.6)"; 
    } else if (temp <= 15) {
      color = "rgba(0, 200, 255, 0.6)"; 
    } else if (temp <= 28) {
      color = "rgba(255, 165, 0, 0.6)"; 
    } else {
      color = "rgba(255, 0, 0, 0.6)"; 
    }
} else if (unit === "imperial") {
    if (temp <= 32) {
        color = "rgba(0, 100, 255, 0.6)";
      } else if (temp <= 59) { 
        color = "rgba(0, 200, 255, 0.6)";
      } else if (temp <= 83) {
        color = "rgba(255, 165, 0, 0.6)";
      } else {
        color = "rgba(255, 0, 0, 0.6)";
      }
} else {
    if (temp <= 273.15) {
        color = "rgba(0, 100, 255, 0.6)";
      } else if (temp <= 288.15) { 
        color = "rgba(0, 200, 255, 0.6)";
      } else if (temp <= 301.15) {
        color = "rgba(255, 165, 0, 0.6)";
      } else {
        color = "rgba(255, 0, 0, 0.6)";
      }
}
document.querySelector(".window").style.background = 
    `linear-gradient(90deg, ${color}, rgb(74, 66, 66, 0.2))`;
}
