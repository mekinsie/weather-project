import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import OpenWeatherService from './services/openweather-service.js';
import OpenCageService from './services/open-cage-service.js';

function checkForecastMain(forecastMain) {
  if (forecastMain === "Rain") {
    $(`.new-${count}`).append(`<div class="imgCenter"> <img src="assets/images/rain.png" alt="drizzle" height="50px"/></div>`);
  }
  else if (forecastMain === "Drizzle") {
    $(`.new-${count}`).append('<div class="imgCenter"> <img src="assets/images/drizzle.png" alt="drizzle" height="50px"/></div>');
  }
  else if (forecastMain === "Clear") {
    $(`.new-${count}`).append('<div class="imgCenter"> <img src="assets/images/sunny.png" alt="sunny" height="50px"/></div>');
  }
  else if (forecastMain === "Snow") {
    $(`.new-${count}`).append('<div class="imgCenter"> <img src="assets/images/snow.png" alt="snow" height="50px"/></div>');
  }
  else if (forecastMain === "Thunderstorm") {
    $(`.new-${count}`).append('<div class="imgCenter"> <img src="assets/images/lightning.png" alt="thunderstorm." height="50px"></div>');
  }
  else if (forecastMain === "Clouds") {
    $(`.new-${count}`).append('<div class="imgCenter"> <img src="assets/images/cloudy.png" alt="clouds" height="50px"/></div>');
  }
}

let count = 0;

function tempConversion(temp) {
  let convertTemp = (1.8 * (temp - 273) + 32);
  return convertTemp;
}
function createDiv(cityName) {
  $('.display-forecast').append(`<div class='new-${count} box-style col-md-2'></div>`);
  $(`.new-${count}`).append(`<p id="city-name"><strong>${cityName}</p></strong> <br>`);
}

$(document).ready(function () {
  $('.hidden').hide();
  var buttonObj = document.querySelector("button");
  $('#restart').click(() => {
    document.location.reload(true);       //Reload Page
    buttonObj.textContent = "submit";
  });
  $(".location-form").submit(function (event) {
    var buttonObj = document.querySelector("button");
    event.preventDefault();
    count += 1;
    if (count <= 4) {
      let cityName = ($('#location').val()).toUpperCase();
      $('#location').val('');
      createDiv(cityName);
      //console.log(count);
      OpenCageService.getCoord(cityName)
        .then(async function (coordResponse) {
          // if (coordResponse instanceof Error) {
          // }
          let weatherForecastResponse = await OpenWeatherService.getWeatherForecast(coordResponse.results[0].geometry.lat, coordResponse.results[0].geometry.lng);
          //console.log(weatherForecastResponse);
          for (let i = 0; i < weatherForecastResponse.daily.length; i++) {
            let unixTimestamp = weatherForecastResponse.daily[i].dt;
            let date = [];
            //console.log(date);
            for (let i = 0; i < 4; i++) {
              date.push(`${new Date(unixTimestamp * 1000).toDateString().split(' ')[i]}`);
            }
            let stringDate = date.join(" ");

            let sunrise = weatherForecastResponse.daily[i].sunrise;
            let sunriseTime = (new Date(sunrise * 1000).toString().split(' ')[4]);

            let sunset = weatherForecastResponse.daily[i].sunset;
            let sunsetTime = (new Date(sunset * 1000).toString().split(' ')[4]);

            let temp = await (weatherForecastResponse.daily[i].temp.day);
            let convertTemp = Math.round(tempConversion(temp));
            let forecast = await weatherForecastResponse.daily[i].weather[0].description;
            let forecastMain = await weatherForecastResponse.daily[i].weather[0].main;
//             $(`.new-${count}`).append(`<strong>${stringDate}</strong><br>`);
//             $(`.new-${count}`).append(`Temperature: ${convertTemp}°F <br>`);
//             $(`.new-${count}`).append(`Sunrise: ${sunriseTime}<br>`);
//             $(`.new-${count}`).append(`Sunset: ${sunsetTime}<br>`);
//             $(`.new-${count}`).append(`Forecast: ${forecast}<br>`);
//             console.log(forecast);
//             console.log(forecastMain);
            $(`.new-${count}`).append(`<div class="dateClass"><strong>${stringDate}</strong></div`);
            $(`.new-${count}`).append(`<div><span class ="key center">Temperature:</span> <span class ="valueLeft">${convertTemp}°F </span></div>`);
            $(`.new-${count}`).append(`<div><span class ="key center">Sunrise:</span> <span class ="valueLeft">${sunriseTime}</span></div>`);
            $(`.new-${count}`).append(`<div><span class ="key center"> Sunset:</span> <span class ="valueLeft">${sunsetTime}</span></div>`);
            $(`.new-${count}`).append(`<div><span class ="key center">Forecast:</span> <span class ="valueLeft">${forecast}</span></div>`);
            checkForecastMain(forecastMain);
          }
          $(".jumbotron").slideDown("slow");
          $(`.new-${count}`).slideDown("slow");
          if (count === 4) {
            buttonObj.disabled = true;
            buttonObj.textContent = "Max Limit";
          }
          else {
            // Do nothing
          }
        })
        .catch(function () {
          $("#invalidCity").empty();
          $("#invalidCity").append("Please enter a valid location.");
          $(`.new-${count}`).remove();
          count -= 1;
          //console.log(count);
        });
    }
    else {
      $('#city-limit').text("You have reached the city search limit.");

    }
  });
});