const supertest = require('supertest');
const express = require('express');
const artifactService = require('../services/ArtifactService');
const artifactRoutes = require('../routes/Artifacts');

// Mocking the save, find, and findOne methods of artifactModel
jest.mock('../model/ArtifactModel');
const artifactModel = require('../model/ArtifactModel');
artifactModel.prototype.save = jest.fn();
artifactModel.find = jest.fn();
artifactModel.findOne = jest.fn();

const app = express();
app.use(express.json());
app.use('/artifacts', artifactRoutes);

// Service tests
describe('ArtifactService', () => {
  describe('saveArtifact', () => {
    it('should save artifact data', async () => {
      const mockData = {
        name: 'Artifact1',
        description: 'An ancient artifact',
        imageUrl: 'https://example.com/artifact1.jpg',
        minTemp: 20,
        maxTemp: 30,
        maxLight: 500,
        minHumidity: 40,
        maxHumidity: 60,
      };

      artifactModel.prototype.save.mockResolvedValue(mockData);

      const result = await artifactService.saveArtifact(mockData);

      expect(result).toEqual(mockData);
    });

    it('should handle errors during saving', async () => {
      const mockError = new Error('Save error');
      artifactModel.prototype.save.mockRejectedValue(mockError);

      await expect(artifactService.saveArtifact({})).rejects.toThrow(mockError);
    });
  });

  describe('getAllArtifacts', () => {
    it('should get all artifacts', async () => {
      const mockData = [
        { name: 'Artifact1', description: 'An ancient artifact' },
        { name: 'Artifact2', description: 'A mysterious artifact' },
      ];

      artifactModel.find.mockResolvedValue(mockData);

      const result = await artifactService.getAllArtifacts();

      expect(result).toEqual(mockData);
    });

    it('should handle errors during retrieval', async () => {
      const mockError = new Error('Retrieve error');
      artifactModel.find.mockRejectedValue(mockError);

      await expect(artifactService.getAllArtifacts()).rejects.toThrow(mockError);
    });
  });

  describe('deleteArtifact', () => {
    it('should delete artifact by name', async () => {
      const mockData = {
        name: 'Artifact1',
        description: 'An ancient artifact',
      };

      artifactModel.findOneAndDelete.mockResolvedValue(mockData);

      const result = await artifactService.deleteArtifact('Artifact1');

      expect(result).toEqual(mockData);
    });

    it('should handle errors during deletion', async () => {
      const mockError = new Error('Delete error');
      artifactModel.findOneAndDelete.mockRejectedValue(mockError);

      await expect(artifactService.deleteArtifact('Artifact1')).rejects.toThrow(mockError);
    });
  });
});

// Routes tests
describe('Artifact Routes', () => {
  describe('POST /artifacts/postArtifact', () => {
    it('should return 200 if save is successful', async () => {
      artifactService.saveArtifact = jest.fn();
      const mockData = {
        name: 'Artifact1',
        description: 'An ancient artifact',
        imageUrl: 'https://example.com/artifact1.jpg',
        minTemp: 20,
        maxTemp: 30,
        maxLight: 500,
        minHumidity: 40,
        maxHumidity: 60,
      };

      artifactService.saveArtifact.mockResolvedValue(mockData);

      const response = await supertest(app)
        .post('/artifacts/postArtifact')
        .send(mockData);

      expect(response.status).toBe(200);
    });

    it('should return 400 if save encounters an error', async () => {
      const mockError = new Error('Save error');
      artifactService.saveArtifact.mockRejectedValue(mockError);

      const response = await supertest(app)
        .post('/artifacts/postArtifact')
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /artifacts/getAllArtifacts', () => {
    it('should return 200 if retrieval is successful', async () => {
      artifactService.getAllArtifacts = jest.fn();
      const mockData = [
        { name: 'Artifact1', description: 'An ancient artifact' },
        { name: 'Artifact2', description: 'A mysterious artifact' },
      ];
      artifactService.getAllArtifacts.mockResolvedValue(mockData);

      const response = await supertest(app).get('/artifacts/getAllArtifacts');

      expect(response.status).toBe(200);
    });

    it('should return 500 if retrieval encounters an error', async () => {
      const mockError = new Error('Retrieve error');
      artifactService.getAllArtifacts.mockRejectedValue(mockError);

      const response = await supertest(app).get('/artifacts/getAllArtifacts');

      expect(response.status).toBe(500);
    });
  });

  describe('DELETE /artifacts/deleteArtifact/:name', () => {
    it('should return 200 if deletion is successful', async () => {
      artifactService.deleteArtifact = jest.fn();
      const mockData = {
        name: 'Artifact1',
        description: 'An ancient artifact',
      };
      artifactService.deleteArtifact.mockResolvedValue(mockData);

      const response = await supertest(app).delete('/artifacts/deleteArtifact/Artifact1');

      expect(response.status).toBe(200);
    });

    it('should return 404 if artifact not found', async () => {
      artifactService.deleteArtifact = jest.fn();
      artifactService.deleteArtifact.mockResolvedValue(null);

      const response = await supertest(app).delete('/artifacts/deleteArtifact/NonexistentArtifact');

      expect(response.status).toBe(404);
    });

    it('should return 400 if deletion encounters an error', async () => {
      const mockError = new Error('Delete error');
      artifactService.deleteArtifact = jest.fn();
      artifactService.deleteArtifact.mockRejectedValue(mockError);

      const response = await supertest(app).delete('/artifacts/deleteArtifact/Artifact1');

      expect(response.status).toBe(400);
    });
  });
});
