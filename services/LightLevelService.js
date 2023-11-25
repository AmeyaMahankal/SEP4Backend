const lightModel = require('../model/LightLevelModel');

class LightService {
    async saveLightLevel(lightLevel, time) {
        const data = new lightModel({ lightLevel, time });
    
        try {
          const dataToSave = await data.save();
          return dataToSave;
        } catch (error) {
          throw error;
        }
      }
    
      async getAllLightLevels() {
        try {
          const data = await lightModel.find().sort({ time: -1 });
          return data;
        } catch (error) {
          throw error;
        }
      }
    }
module.exports = new LightService();
