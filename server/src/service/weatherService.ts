
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number,
  lon: number
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  // city, date, icon, iconDescription, tempF, windSpeed, humidity
  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = process.env.API_BASE_URL;
  private APIKey = process.env.API_KEY;
  city: string;
  constructor() {
    this.city = "";
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoCodeAPI = this.buildGeocodeQuery(query);
    const locationData = await fetch(geoCodeAPI);
    const response = await locationData.json();
    return response;
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates[]): Coordinates {
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon
    }
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.APIKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.APIKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.city);
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
    return new Weather(
      this.city,
      new Date((parseInt(response.dt) * 1000)).toLocaleString(),
      response.weather[0].icon,
      response.weather[0].description,
      response.main.temp,
      response.wind.speed,
      response.main.humidity
    )
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    // we get list of 40 array of objects for 5 days forecast. So each interval of 8 list of data will represen one day that's why incrementing it by 8
    for (let index = 0; index < weatherData.length; index = index + 8) {
      const day = weatherData[index];
      
      forecastArray.push(
        new Weather(
          currentWeather.city,
          new Date((parseInt(day.dt) * 1000)).toLocaleDateString(),
          day.weather[0].icon,
          day.weather[0].description,
          day.main.temp,
          day.wind.speed,
          day.main.humidity
        )
      )
    }
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    // location data will contain lat and lon of the city enterd by the user as input
    const locationData = await this.fetchAndDestructureLocationData();
    // passing the lat and lon to fetchWeatherWEatherData will get the the 5 days forecast weather data of this city 
    const weatherData = await this.fetchWeatherData(locationData);
    const currentWeatherData = this.parseCurrentWeather(weatherData.list[0]);
    const forecast = this.buildForecastArray(currentWeatherData, weatherData.list);
    return forecast;
  }
}

export default new WeatherService();
