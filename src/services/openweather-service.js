export default class OpenWeatherService {
  static getWeatherForecast(lat, lon) {
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${process.env.API_WEATHER_KEY}`)
      .then(function(response){
        if (!response.ok) {
          throw Error(response);
        }
        return response.json();
      })
      .catch(function(error) {
        return Error(error.message);
      });
  }
}
