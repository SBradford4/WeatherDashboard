// @ts-nocheck

import { Router, type Request, type Response } from 'express';
const router = Router();

// import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    // TODO: GET weather data from city name
    const cityName = req.body.cityName;
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    // TODO: save city to search history
    await historyService.addCity(cityName);
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(400).json(error);
  }

});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const historyData = await historyService.getCities();
    res.status(200).json(historyData);
  } catch (error) {
    res.status(400).json(error);
  }
 });

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => { });

export default router;
