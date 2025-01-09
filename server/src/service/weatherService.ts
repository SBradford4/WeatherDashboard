// @ts-nocheck

import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number,
  long: number
}

// TODO: Define a class for the Weather object
class Weather {

}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL;
  private APIKey = process.env.API_KEY;
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoCodeAPI = this.buildGeocodeQuery(query);
    const locationData = await fetch(geoCodeAPI);
    const response = await locationData.json();
    return response;
  }
  // check
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
      return {
        lat: locationData[0].lat,
        long: locationData[0].lon
      } 
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.APIKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.long}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData("London");
    // check uncomment
    const destructuredLocationData = this.destructureLocationData(locationData);
    return destructuredLocationData;
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const weatherData = await fetch(weatherQuery);
    const response = await weatherData.json();
    return response;
  }
  // TODO: Build parseCurrentWeather method
  // check
  private parseCurrentWeather(response: any) {
    // city, date, icon, iconDescription, tempF, windSpeed, humidity
    const currentWeather = {
      city: response.name,
      date: response.dt,
      icon: response.weather[0].icon,
      iconDescription: response.weather[0].description,
      tempF: response.main.temp,
      windSpeed: response.wind.speed,
      humidity: response.main.humidity
    }
    return currentWeather;
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    const locationData = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeatherData = this.parseCurrentWeather(weatherData);
    console.log(currentWeatherData, "current weather data");
    return weatherData;
  }
}

export default new WeatherService();
