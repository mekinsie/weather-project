import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';
import OpenWeatherService from './services/openweather-service.js';
import OpenCageService from './services/open-cage-service.js';

function checkForecastMain(forecastMain) {
  if (forecastMain === "Rain") {
    $(`.new-${count}`).append('<img src="assets/images/rain.png" alt="drizzle" height="50px"/><br><span class="center">______________________</span><br><br>');
  }
  else if (forecastMain === "Drizzle") {
    $(`.new-${count}`).append('<img src="assets/images/drizzle.png" alt="drizzle" height="50px"/><br><span class="center">______________________</span><br><br>');
  }
  else if (forecastMain === "Clear") {
    $(`.new-${count}`).append('<img src="assets/images/sunny.png" alt="sunny" height="50px"/><br><span class="center">______________________</span><br><br>');
  }
  else if (forecastMain === "Snow") {
    $(`.new-${count}`).append('<img src="assets/images/snow.png" alt="snow" height="50px"/><br><span class="center">______________________</span><br><br>');
  }
  else if (forecastMain === "Thunderstorm") {
    $(`.new-${count}`).append('<img src="assets/images/lightning.png" alt="thunderstorm." height="50px"><br><span class="center">______________________</span><br><br>');
  }
  else if (forecastMain === "Clouds") {
    $(`.new-${count}`).append('<img src="assets/images/cloudy.png" alt="clouds" height="50px"/><br><span class="center">______________________</span><br><br>');
  }
}

let count = 0;

function tempConversion(temp) {
  let convertTemp = (1.8 * (temp - 273) + 32);
  return convertTemp;
}
function createDiv(cityName) {
  $('.display-forecast').append(`<div class='new-${count} box-style col-md-2'></div>`);
  $(`.new-${count}`).append(`<p id="city-name"><strong>${cityName}</strong></p> <br>`);
}

$(document).ready(function () {
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

            $(`.new-${count}`).append(`<strong>${stringDate}</strong> <br>`);
            $(`.new-${count}`).append(`<span class ="key">Temperature:</span> ${convertTemp}°F <br>`);
            $(`.new-${count}`).append(`<span class ="key">Sunrise:</span> ${sunriseTime}<br>`);
            $(`.new-${count}`).append(`<span class ="key"> Sunset:</span> ${sunsetTime}<br>`);
            $(`.new-${count}`).append(`<span class ="key">Forecast:</span> ${forecast}<br>`);
            //console.log(forecast);
            //console.log(forecastMain);
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