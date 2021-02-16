import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import OpenWeatherService from './services/openweather-service.js';
import OpenCageService from './services/open-cage-service.js';

// let displayWeatherForecastResponse = (response) => {
//   $('.display-weather').html(response);
// }

function tempConversion(temp){
  let convertTemp = (1.8*(temp - 273) + 32);
  return convertTemp;
}

$(document).ready(function () {
  $(".location-form").submit(function (event) {
    event.preventDefault();
    let cityName = $('#location').val();
    OpenCageService.getCoord(cityName)
      .then(async function (coordResponse) {
        if (coordResponse instanceof Error) {
          throw Error(`OpenCage API error: ${coordResponse.message}`);
        }
        let weatherForecastResponse = await OpenWeatherService.getWeatherForecast(coordResponse.results[0].geometry.lat, coordResponse.results[0].geometry.lng);
        console.log(weatherForecastResponse);

        for (let i=0; i < weatherForecastResponse.daily.length; i ++){
          let unixTimestamp = weatherForecastResponse.daily[i].dt;
          let date = [];
          for(let i=0; i < 4; i++){
            date.push(`${new Date(unixTimestamp*1000).toDateString().split(' ')[i]}`);
          }
          let stringDate = date.join(" ");
  
          let sunrise = weatherForecastResponse.daily[i].sunrise;
          let sunriseTime = (new Date(sunrise*1000).toString().split(' ')[4]);

          let sunset = weatherForecastResponse.daily[i].sunset;
          let sunsetTime = (new Date(sunset*1000).toString().split(' ')[4]);
          
          // let temp = weatherForecastResponse.daily[i].temp.day;
          let temp = await (weatherForecastResponse.daily[i].temp.day)
          let convertTemp = Math.round(tempConversion(temp));
          let forecast = await weatherForecastResponse.daily[i].weather[0].description;

          $('.display-forecast').append(`${stringDate} <br>`);
          $('.display-forecast').append(`Temperature: ${convertTemp}°F <br>`);
          $('.display-forecast').append(`Sunrise: ${sunriseTime}<br>`);
          $('.display-forecast').append(`Sunset: ${sunsetTime}<br>`);
          $('.display-forecast').append(`Forecast: ${forecast}<br><br>`);
        }
      })
      .catch(function (error) {
        return (error);
      });
  });
});



