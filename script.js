const weekContainer = document.querySelector('.week-container');

drawWeekList(weekContainer);

let dayIndex = '0';
let weatherList = [];
const APP_ID = 'appid=223e04ae0da24baaf7932665d7a68535'
const FETCH_URL = 'https://api.openweathermap.org/data/2.5';

const searchButton = document.querySelector('#citySearch');


weekContainer.addEventListener('click', (e) => {
	if (e.target.id !== ''){
		dayIndex = e.target.id;
		const currentWeather = weatherList[dayIndex];
		const img = currentWeather.weather[0].icon;
		const sunriseDt = currentWeather.sunrise;
		const sunsetDt = currentWeather.sunset;
		const convetUnixToUtcSunriseTime = new Date(sunriseDt*1000).toTimeString();
		const convetUnixToUtcSunsetTime = new Date(sunsetDt*1000).toTimeString();
		const sunriseStringTime = convetUnixToUtcSunriseTime.split(":");
		const sunsetStringTime = convetUnixToUtcSunsetTime.split(":");
		document.querySelector('.morningTemperature').textContent = String(Math.floor(currentWeather.temp.morn));
		document.querySelector('.sunsetTemperature').textContent = String(Math.floor(currentWeather.temp.night));
		document.querySelector('.precipitation').innerHTML = `<img src=http://openweathermap.org/img/wn/${img}.png />`;
		document.querySelector('.windSpeed').textContent = String(currentWeather.wind_speed + 'm/s');
		document.querySelector('.overcast').textContent = String(currentWeather.clouds + '%');
		document.querySelector('.humidity').textContent = String(currentWeather.humidity + '%');
		document.querySelector('.sunRiseHour').textContent = sunriseStringTime[0] + ":" + sunriseStringTime[1]
		document.querySelector('.sunsetTime').textContent = sunsetStringTime[0] + ":" + sunsetStringTime[1]
	}
})

getLocation(onGetGeoSuccess);

function getLocation(onSuccess) {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(onSuccess);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function drawPageInformation(weatherInfo) {
	weatherList = weatherInfo.daily;
	const currentWeather = weatherList[dayIndex];
	const img = currentWeather.weather[0].icon
	const currentTime = weatherInfo.current.dt
	const sunriseDt = currentWeather.sunrise;
	const sunsetDt = currentWeather.sunset;
	const convetCurrentUnixToUtcTime = new Date(1608026064*1000).toString();
	const convetCurrentUnixToUtcDate = new Date(currentTime*1000).toTimeString();
	const convetUnixToUtcSunriseTime = new Date(sunriseDt*1000).toTimeString();
	const convetUnixToUtcSunsetTime = new Date(sunsetDt*1000).toTimeString();
	const currentStringDate = convetCurrentUnixToUtcTime.split(" ");
	const currentStringTime = convetCurrentUnixToUtcDate.split(":");
	const sunriseStringTime = convetUnixToUtcSunriseTime.split(":");
	const sunsetStringTime = convetUnixToUtcSunsetTime.split(":");
	const cityName = weatherInfo.timezone.toString().split("/")
	document.querySelector(".weak").textContent = currentStringDate[0] + " " + currentStringDate[2] +
		" " + currentStringDate[1] + " " + currentStringDate[3]
	document.querySelector('.hour').textContent = currentStringTime[0] + ":" + currentStringTime[1]
	document.querySelector('.sunRiseHour').textContent = sunriseStringTime[0] + ":" + sunriseStringTime[1]
	document.querySelector('.sunsetTime').textContent = sunsetStringTime[0] + ":" + sunsetStringTime[1]
	document.querySelector('.morningTemperature').textContent = String(Math.floor(currentWeather.temp.morn));
	document.querySelector('.sunsetTemperature').textContent = String(Math.floor(currentWeather.temp.night))
	document.querySelector('.degree').textContent = String(Math.floor(weatherInfo.current.temp));
	document.querySelector('.precipitation').innerHTML = `<img src=http://openweathermap.org/img/wn/${img}.png />`
	document.querySelector('.windSpeed').textContent = String(currentWeather.wind_speed + 'ms');
	document.querySelector('.overcast').textContent = String(currentWeather.clouds + '%');
	document.querySelector('.humidity').textContent = String(currentWeather.humidity + '%');
	document.querySelector('.cityName').textContent = cityName[1]
	console.log(cityName);
	console.log(currentWeather);
	console.log(weatherInfo);
	console.log(currentStringDate);


}

function onGetGeoSuccess(position){
	const lat = position.coords.latitude;
	const lon = position.coords.longitude;
	const coordinates = {lat, lon};
	getWeeklyWeather(coordinates).then((res)=>{
		drawPageInformation(res);
	}).catch((e)=>{
		console.log('error', e);
	})
}

function drawWeekList(weekContainer) {

	const weekList = getWeekList();
	let weekLayout = '';

	for (let i = 0; i < weekList.length; i++) {
		const currentDate = weekList[i];
		const day = currentDate.getDate();
		const weekName = String(currentDate).split(' ')[0];
		weekLayout += createDayLayout(day, weekName, i)
	}

	weekContainer.innerHTML = weekLayout;

	function createDayLayout(day, weekName, id) {
		return `<div class="day-container" id=${id}>
					<span class="week-name" id=${id}>${weekName}</span><br/>
					<span class="day" id=${id}>${day}</span>
				</div>`
	}
}

searchButton.addEventListener('click', ()=>{
	const cityName = document.querySelector('.search').value;
	getWeatherByCity(cityName).then(cityRes => {
		const coordinates = cityRes.coord;
		getWeeklyWeather(coordinates).then(weekRes => {
			drawPageInformation(weekRes);
		})
	})
})

function getWeeklyWeather(coordinates) {
	let units = "metric"
	let latLonQuery = `lat=${coordinates.lat}&lon=${coordinates.lon}`;

	return fetch(`${FETCH_URL}/onecall?${latLonQuery}&units=${units}&${APP_ID}`).then((async res => {

		if (res.status >= 400){
			return Promise.reject('asd');
		}
		return res.json();

	}))
}

function getWeatherByCity(city){
	const cityQuery = `q=${city}`;

	return fetch(`${FETCH_URL}/weather?${cityQuery}&${APP_ID}`).then((async res => {

		if (res.status >= 400){
			return Promise.reject('asd');
		}
		return res.json();
	}))
}
