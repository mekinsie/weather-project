export default class OpenWeatherService {
  static getWeather(lat, long) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${process.env.API_WEATHER_KEY}`)
    .then(function(response){
      if (!response.ok) {
        throw Error(response);
      }
      return response.json();
    })
    .catch(function(error) {
      return Error(error.message);
    })
  }
}
