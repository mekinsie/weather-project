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
function createDiv(cityName){
  $('.display-forecast').append(`<div class='new-${cityName} box-style col-2'></div>`);
  $(`.new-${cityName}`).append(`<strong>${cityName}</strong> <br><br>`);
}

$(document).ready(function () {
  let count = 0;
  $(".location-form").submit(function (event) {
    event.preventDefault();
    count +=1;
    if (count <= 4){
    let cityName = ($('#location').val()).toUpperCase();
    createDiv(cityName);
    console.log(count);
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
            console.log(date);
            for(let i=0; i < 4; i++){
              date.push(`${new Date(unixTimestamp*1000).toDateString().split(' ')[i]}`);
            }
            let stringDate = date.join(" ");
    
            let sunrise = weatherForecastResponse.daily[i].sunrise;
            let sunriseTime = (new Date(sunrise*1000).toString().split(' ')[4]);

            let sunset = weatherForecastResponse.daily[i].sunset;
            let sunsetTime = (new Date(sunset*1000).toString().split(' ')[4]);
            
            // let temp = weatherForecastResponse.daily[i].temp.day;
            let temp = await (weatherForecastResponse.daily[i].temp.day);
            let convertTemp = Math.round(tempConversion(temp));
            let forecast = await weatherForecastResponse.daily[i].weather[0].description;
            $(`.new-${cityName}`).append(`${stringDate} <br>`);
            $(`.new-${cityName}`).append(`Temperature: ${convertTemp}°F <br>`);
            $(`.new-${cityName}`).append(`Sunrise: ${sunriseTime}<br>`);
            $(`.new-${cityName}`).append(`Sunset: ${sunsetTime}<br>`);
            $(`.new-${cityName}`).append(`Forecast: ${forecast}<br><br>`);
      }
      })
      .catch(function (error) {
        console.log(error);
        $('.display-forecast').append(error);
      });
    }
    else{
      $('#city-limit').text("You have reached the city search limit.")
    }
  });
});



