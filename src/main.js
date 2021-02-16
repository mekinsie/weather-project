import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import OpenWeatherService from './services/openweather-service.js';
import OpenCageService from './services/open-cage-service.js';

let displayWeatherResponse = (response) => {
  $('.display-weather').html(response);
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
        let weatherResponse = await OpenWeatherService.getWeather(coordResponse.results[0].geometry.lat, coordResponse.results[0].geometry.lng);
        console.log(weatherResponse);
        displayWeatherResponse(weatherResponse.daily[0].temp.day);
      })
      .catch(function (error) {
        return (error)
      });
      
  });
});

