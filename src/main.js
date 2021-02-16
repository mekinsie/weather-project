import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import OpenWeatherService from './services/openweather-service.js';
import OpenCageService from './services/open-cage-service.js';

// let displayWeatherForecastResponse = (response) => {
//   $('.display-weather').html(response);
// }

// tempConversion(function(temp){
//   temp -= 273.15
//   return temp;
// })

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
          let unixTimestamp = weatherForecastResponse.daily[i].dt
          let date = new Date(unixTimestamp*1000);
          $('.display-forecast').append(`${date} <br>`);
        $('.display-forecast').append(`Temperature: ${weatherForecastResponse.daily[i].temp.day} <br>`);
        }
      })
      .catch(function (error) {
        return (error)
      });
  });
});



