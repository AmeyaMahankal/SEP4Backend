const humidityModel = require('../model/HumidityModel');

class HumidityService {
    async saveHumidity (measurment, time) {
        const data = new humidityModel({measurment, time});

        try {
            const dataToSave = await data.save();
            return dataToSave;
            } catch(error) {
                throw error;
            }
         }

         async getAllHumidities() {
            try{
                const data = await humidityModel.find().sort({time:-1});
                return data;
            }catch(error) {
                throw error;
            }
         }
}
module.exports = new HumidityService();