const supertest = require('supertest');
const express = require('express');
const LightLevelService = require('../services/LightLevelService');
const lightLevelModel = require('../model/LightLevelModel');
const lightLevelRoutes = require('../routes/LightLevels');

// Mocking the save method of lightLevelModel
lightLevelModel.prototype.save = jest.fn();

const app = express();
app.use(express.json());
app.use('/lightLevel', lightLevelRoutes);

// Service tests
describe('LightLevelService', () => {
  describe('saveLightLevel', () => {
    it('should save light level data', async () => {
      const mockData = { lightLevel: 500, time: new Date() };
      lightLevelModel.prototype.save.mockResolvedValue(mockData);

      const result = await LightLevelService.saveLightLevel(mockData.lightLevel, mockData.time);

      expect(result).toEqual(mockData);
    });

    it('should handle errors during saving', async () => {
      const mockError = new Error('Save error');
      lightLevelModel.prototype.save.mockRejectedValue(mockError);

      await expect(LightLevelService.saveLightLevel(500, new Date())).rejects.toThrow(mockError);
    });
  });

  describe('getAllLightLevels', () => {
    it('should get all light levels', async () => {
      const mockData = [
        { _id: "655dd50b8c94d9cbac5ce619", lightLevel: 500, time: new Date(), __v: 0},
        { _id: "655dd5068c94d9cbac5ce613", lightLevel: 600, time: new Date(), __v: 0}
      ];
      lightLevelModel.find = jest.fn(() => ({
        sort: jest.fn().mockResolvedValue(mockData),
      }));

      const result = await LightLevelService.getAllLightLevels();

      expect(result).toEqual(mockData);
    });
  });
});

// Routes tests
describe('LightLevel Routes', () => {
  describe('POST /lightLevel/post', () => {
    it('should return 200 if save is successful', async () => {
      LightLevelService.saveLightLevel = jest.fn();
      const mockData = { lightLevel: 500, time: new Date() };
      LightLevelService.saveLightLevel.mockResolvedValue(mockData);

      const response = await supertest(app)
        .post('/lightLevel/post')
        .send(mockData);

      expect(response.status).toBe(200);
    });

    it('should return 500 if save encounters an error', async () => {
      const mockError = new Error('Save error');
      LightLevelService.saveLightLevel.mockRejectedValue(mockError);

      const response = await supertest(app)
        .post('/lightLevel/post')
        .send({ lightLevel: 500, time: new Date() });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /lightLevel/getLightLevels', () => {
    it('should return 200 if retrieval is successful', async () => {
      LightLevelService.getAllLightLevels = jest.fn();
      const mockData = [
        { lightLevel: 500, time: new Date() },
        { lightLevel: 600, time: new Date() },
      ];
      LightLevelService.getAllLightLevels.mockResolvedValue(mockData);

      const response = await supertest(app).get('/lightLevel/getLightLevels');

      expect(response.status).toBe(200);
    });

    it('should return 500 if retrieval encounters an error', async () => {
      const mockError = new Error('Retrieve error');
      LightLevelService.getAllLightLevels.mockRejectedValue(mockError);

      const response = await supertest(app).get('/lightLevel/getLightLevels');

      expect(response.status).toBe(500);
    });
  });
});
