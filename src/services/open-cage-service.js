export default class OpenCageService {
  static getCoord(city) {
    return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${process.env.API_OPENCAGE_KEY}`)
      .then(function (response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(function (error) {
        return error;
      });
  }
}