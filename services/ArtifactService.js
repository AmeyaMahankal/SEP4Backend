const ArtifactModel = require('../model/ArtifactModel');

class ArtifactService {

    async getAllArtifacts() {
        try {
            const data = await ArtifactModel.find({});
            return data;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = new ArtifactService();