const supertest = require('supertest');
const express = require('express');
const MotionService = require('../services/MotionService');
const motionModel = require('../model/MotionModel');
const motionRoutes = require('../routes/Motions');

// Mocking the save method of motionModel
motionModel.prototype.save = jest.fn();

// Mocking the find and findOne methods of motionModel
motionModel.find = jest.fn();
motionModel.findOne = jest.fn();

const app = express();
app.use(express.json());
app.use('/motion', motionRoutes);

// Service tests (works)
describe('MotionService', () => {
  describe('saveMotion', () => {
    it('should save motion data', async () => {
      const mockData = { detection: true}
      motionModel.prototype.save.mockResolvedValue(mockData);

      const result = await MotionService.saveMotion(mockData.detection);

      expect(result).toEqual(mockData);
    });

    it('should handle errors during saving', async () => {
      const mockError = new Error('Save error');
      motionModel.prototype.save.mockRejectedValue(mockError);

      await expect(MotionService.saveMotion(true)).rejects.toThrow(mockError);
    });
  });

  describe('getAllMotions', () => {
    it('should get all motions', async () => {
      const mockData = [
        { _id: "655dd50b8c94d9cbac5ce619", detection: true, __v: 0},
        { _id: "655dd5068c94d9cbac5ce613", detection: false, __v: 0}
      ];

      motionModel.find = jest.fn(() => ({
        sort: jest.fn().mockResolvedValue(mockData)
      }));

      const result = await MotionService.getAllMotions();

      expect(result).toEqual(mockData);
    });
  });
 });

// Routes tests
describe('Motion Routes', () => {
  describe('POST /motion/post', () => {
    it('should return 200 if save is successful', async () => {
      MotionService.saveMotion = jest.fn();
      const mockData = { detection: true };
      MotionService.saveMotion.mockResolvedValue(mockData);

      const response = await supertest(app)
        .post('/motion/post')
        .send(mockData);

      expect(response.status).toBe(200);
    });

    it('should return 500 if save encounters an error', async () => {
      const mockError = new Error('Save error');
      MotionService.saveMotion.mockRejectedValue(mockError);

      const response = await supertest(app)
        .post('/motion/post')
        .send({ detection: true });

      expect(response.status).toBe(500);
    });
  });

  describe('GET /motion/getMotions', () => {
    it('should return 200 if retrieval is successful', async () => {
      MotionService.getAllMotions = jest.fn();
      const mockData = [
        { detection: true },
        { detection: false },
      ];
      MotionService.getAllMotions.mockResolvedValue(mockData);

      const response = await supertest(app).get('/motion/getMotions');

      expect(response.status).toBe(200);
    });

    it('should return 500 if retrieval encounters an error', async () => {
      const mockError = new Error('Retrieve error');
      MotionService.getAllMotions.mockRejectedValue(mockError);

      const response = await supertest(app).get('/motion/getMotions');

      expect(response.status).toBe(500);
    });
  });

  describe('PATCH /motion/updateMotion', () => {
    it('should return 200 if update is successful', async () => {
      MotionService.updateMotionStatus = jest.fn();
      MotionService.updateMotionStatus.mockResolvedValue({ message: 'Motion status updated successfully' });

      const response = await supertest(app).patch('/motion/updateMotion');

      expect(response.status).toBe(200);
    });

    it('should return 500 if update encounters an error', async () => {
      const mockError = new Error('Update error');
      MotionService.updateMotionStatus = jest.fn();
      MotionService.updateMotionStatus.mockRejectedValue({ status: 500, message: mockError.message });

      const response = await supertest(app).patch('/motion/updateMotion');

      expect(response.status).toBe(500);
    });
  });
});
