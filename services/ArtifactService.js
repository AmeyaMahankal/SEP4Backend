const artifactModel = require('../model/ArtifactModel');

class ArtifactService {
  async saveArtifact(data) {
    const artifactData = new artifactModel({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      minTemp: data.minTemp,
      maxTemp: data.maxTemp,
      maxLight: data.maxLight,
      minHumidity: data.minHumidity,
      maxHumidity: data.maxHumidity,
    });

    try {
      const savedArtifact = await artifactData.save();
      return savedArtifact;
    } catch (error) {
      throw error;
    }
  }

  async getAllArtifacts() {
    try {
      const allArtifacts = await artifactModel.find();
      return allArtifacts;
    } catch (error) {
      throw error;
    }
  }

  async deleteArtifact(name) {
    try {
      const deletedArtifact = await artifactModel.findOneAndDelete({ name });
      return deletedArtifact;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ArtifactService();

