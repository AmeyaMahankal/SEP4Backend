const temperatureModel = require('../model/TemperatureModel');

class TemperatureService{
    async saveTemperature( temperature, time) {
        const data = new temperatureModel({ temperature, time});

        try{
            const dataToSave = await data.save();
            return dataToSave;
        }catch (error) {
            throw error;
        }
    }

    async getAllTemperatures() {
        try{
            const data = await temperatureModel.find().sort({time:-1});
            return data;
        }catch(error) {
            throw error;
        }
    }
}
module.exports = new TemperatureService();