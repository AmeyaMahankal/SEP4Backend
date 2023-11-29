const supertest = require('supertest');
const express = require('express');
const HumidityService = require('../services/HumidityService');
const humidityModel = require('../model/HumidityModel');
const humidityRoutes = require('../routes/Humidities');

// Mocking the save method of humidityModel
humidityModel.prototype.save = jest.fn();

const app = express();
app.use(express.json());
app.use('/humidity', humidityRoutes);

// Service tests
describe('HumidityService', () => {
  describe('saveHumidity', () => {
    it('should save humidity data', async () => {
      const mockData = { measurement: 50, time: new Date() };
      humidityModel.prototype.save.mockResolvedValue(mockData);

      const result = await HumidityService.saveHumidity(mockData.measurement, mockData.time);

      expect(result).toEqual(mockData);
    });

    it('should handle errors during saving', async () => {
      const mockError = new Error('Save error');
      humidityModel.prototype.save.mockRejectedValue(mockError);

      await expect(HumidityService.saveHumidity(50, new Date())).rejects.toThrow(mockError);
    });
  });

  describe('getAllHumidities', () => {
    it('should get all humidities', async () => {
      const mockData = [
        { _id: "655dd50b8c94d9cbac5ce619", measurement: 50, time: new Date(), __v: 0},
        { _id: "655dd5068c94d9cbac5ce613", measurement: 60, time: new Date(), __v: 0}
      ];
      humidityModel.find = jest.fn(() => ({
        sort: jest.fn().mockResolvedValue(mockData),
      }));

      const result = await HumidityService.getAllHumidities();

      expect(result).toEqual(mockData);
    });
  });
});

// Routes tests
describe('Humidity Routes', () => {
  describe('POST /humidity/post', () => {
    it('should return 200 if save is successful', async () => {
      HumidityService.saveHumidity = jest.fn();
      const mockData = { measurement: 50, time: new Date() };
      HumidityService.saveHumidity.mockResolvedValue(mockData);

      const response = await supertest(app)
        .post('/humidity/post')
        .send(mockData);

      expect(response.status).toBe(200);
    });

    it('should return 500 if save encounters an error', async () => {
      const mockError = new Error('Save error');
      HumidityService.saveHumidity.mockRejectedValue(mockError);

      const response = await supertest(app)
        .post('/humidity/post')
        .send({ measurement: 50, time: new Date() });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /humidity/getHumidities', () => {
    it('should return 200 if retrieval is successful', async () => {
      HumidityService.getAllHumidities = jest.fn();
      const mockData = [
        { measurement: 50, time: new Date() },
        { measurement: 60, time: new Date() },
      ];
      HumidityService.getAllHumidities.mockResolvedValue(mockData);

      const response = await supertest(app).get('/humidity/getHumidities');

      expect(response.status).toBe(200);
    });

    it('should return 500 if retrieval encounters an error', async () => {
      const mockError = new Error('Retrieve error');
      HumidityService.getAllHumidities.mockRejectedValue(mockError);

      const response = await supertest(app).get('/humidity/getHumidities');

      expect(response.status).toBe(500);
    });
  });
});
