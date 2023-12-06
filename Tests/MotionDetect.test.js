const request = require('supertest');
const express = require('express');
const motionDetectModel = require('../model/MotionDetectionModel')
const motionDetectService = require('../services/MotionDetectService');
const motionDetectRoute = require('../routes/MotionDetect');


motionDetectModel.prototype.save = jest.fn();

const app = express();
app.use(express.json());
app.use('/motiondetect', motionDetectRoute);

describe('MotionDetectService', () => {
    describe('saveMotionDetect', () => {
      it('should save motion detect data', async () => {
        const mockDataToSave = { _id: 'someId', warning: 'Mock Warning', time: Date.now() };
        motionDetectModel.prototype.save.mockResolvedValue(mockDataToSave);
  
        const result = await motionDetectService.saveMotionDetect();
  
        expect(result).toEqual(mockDataToSave);
      });
  
      it('should handle save error', async () => {
        const mockError = new Error('Mock Save Error');
        motionDetectModel.prototype.save.mockRejectedValue(mockError);
  
        await expect(motionDetectService.saveMotionDetect()).rejects.toThrow(mockError);
      });
    });
  
    describe('getAllMotionDetects', () => {
      it('should get all motion detects', async () => {
        const mockData = [
          { _id: 'someId1', warning: 'Mock Warning 1', time: Date.now() },
          { _id: 'someId2', warning: 'Mock Warning 2', time: Date.now() },
        ];
  
        motionDetectService.getAllMotionDetects = jest.fn();
        motionDetectService.getAllMotionDetects.mockResolvedValueOnce(mockData);
        const result = await motionDetectService.getAllMotionDetects();
        expect(result).toEqual(mockData);
      });
    });
  });
  

describe('MotionDetectRoute', () => {
  describe('POST /motiondetect/postDetect', () => {
    it('should save motion detect data and return 200', async () => {
      motionDetectService.saveMotionDetect = jest.fn();
      const mockData = { _id: 'someId', warning: 'Mock Warning', time: Date.now() };
      motionDetectService.saveMotionDetect.mockResolvedValueOnce(mockData);

      const response = await request(app)
        .post('/motiondetect/postDetect')
        .send(mockData);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /motiondetect/getDetects', () => {
    it('should get all motion detects and return 200', async () => {
        motionDetectService.getAllMotionDetects=jest.fn();
        const mockData = [
        { _id: 'someId1', warning: 'Mock Warning 1', time: Date.now() },
        { _id: 'someId2', warning: 'Mock Warning 2', time: Date.now() },
      ];

      motionDetectService.getAllMotionDetects.mockResolvedValueOnce(mockData);

      const response = await request(app).get('/motiondetect/getDetects');

      expect(response.status).toBe(200);
    });
  });
});


