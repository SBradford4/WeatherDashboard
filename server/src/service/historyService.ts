import fs from "fs/promises";
import path from "path";

// TODO: Define a City class with name and id properties
class City {
  // @ts-ignore
  private name: String;
  // @ts-ignore
  private id: number;
  constructor(name: String, id: number) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  private filePath = path.join(process.cwd(), 'db/searchHistory.json');
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    const data = await fs.readFile(this.filePath, 'utf-8');
    return data;
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    await fs.writeFile(this.filePath, JSON.stringify(cities, null))
  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const citiesData = await this.read();
    const cities = JSON.parse(citiesData)
    return cities.map((city: {name: string, id: number}) => new City(city.name, city.id));
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const citiesData = await this.getCities();
    const id = citiesData.length + 1;
    citiesData.push(new City(
      city,
      id
    ))
    this.write(citiesData);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}
}

export default new HistoryService();
