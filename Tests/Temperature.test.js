const supertest = require('supertest');
const express = require('express');
const TemperatureService = require('../services/TemperatureService');
const temperatureModel = require('../model/TemperatureModel');
const temperatureRoutes = require('../routes/Temperatures');

// Mocking the save method of temperatureModel
temperatureModel.prototype.save = jest.fn();

const app = express();
app.use(express.json());
app.use('/temperature', temperatureRoutes);

//Service tests
describe('TemperatureService', () => {
  describe('saveTemperature', () => {
    it('should save temperature data', async () => {
      const mockData = { temperature: 25, time: new Date() };
      temperatureModel.prototype.save.mockResolvedValue(mockData);

      const result = await TemperatureService.saveTemperature(mockData.temperature, mockData.time);

      expect(result).toEqual(mockData);
    });

    it('should handle errors during saving', async () => {
      const mockError = new Error('Save error');
      temperatureModel.prototype.save.mockRejectedValue(mockError);

      await expect(TemperatureService.saveTemperature("25", new Date())).rejects.toThrow(mockError);
    });
  });

  describe('getAllTemperatures', () => {
    it('should get all temperatures', async () => {
      const mockData = [{ _id: "655dd50b8c94d9cbac5ce619",temperature: 25, time: new Date(), __v: 0}, {_id: "655dd5068c94d9cbac5ce613", temperature: 30, time: new Date() , __v: 0}];
      temperatureModel.find = jest.fn(() => ({
        sort: jest.fn().mockResolvedValue(mockData),
      }));

      const result = await TemperatureService.getAllTemperatures();

      expect(result).toEqual(mockData);
    });
  });
});


//Routes tests
describe('Temperature Routes', () => {
  describe('POST /temperature/post', () => {
    it('should return 200 if save is successful', async () => {
      TemperatureService.saveTemperature = jest.fn();
      const mockData = { temperature: 25, time: new Date() };
      TemperatureService.saveTemperature.mockResolvedValue(mockData);

      const response = await supertest(app)
        .post('/temperature/post')
        .send(mockData);

      expect(response.status).toBe(200);
    });

    it('should return 500 if save encounters an error', async () => {
      const mockError = new Error('Save error');
      TemperatureService.saveTemperature.mockRejectedValue(mockError);

      const response = await supertest(app)
        .post('/temperature/post')
        .send({ temperature: 25, time: new Date() });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /temperature/getTemperatures', () => {
    it('should return 200 if retrieval is successful', async () => {
      TemperatureService.getAllTemperatures = jest.fn();
      const mockData = [
        { temperature: 25, time: new Date() },
        { temperature: 30, time: new Date() },
      ];
      TemperatureService.getAllTemperatures.mockResolvedValue(mockData);

      const response = await supertest(app).get('/temperature/getTemperatures');

      expect(response.status).toBe(200);
    });

    it('should return 500 if retrieval encounters an error', async () => {
      const mockError = new Error('Retrieve error');
      TemperatureService.getAllTemperatures.mockRejectedValue(mockError);

      const response = await supertest(app).get('/temperature/getTemperatures');

      expect(response.status).toBe(500);
    });
  });
});
