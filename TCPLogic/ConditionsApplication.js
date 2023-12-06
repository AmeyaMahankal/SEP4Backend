const { tempConditionData, humidityConditionData, lightConditionData } = require('../TCPDataAccess/ConditionsDataAcess')
//const artifactService=  require("../services/ArtifactService")
function conditionLogic(receivedData) {
    let list = receivedData.split('/');
    //let artifacts = artifactService.getAllArtifacts();

    let tempReading, humReading, lightReading;

    list.forEach(element => {

        let [key, value] = element.split('=');
        value = parseFloat(value);

        if (key == 'T') {
            tempReading = value;

        }
        else if (key == 'H') {
            humReading = value;
        }
        else if (key == 'L') {
            lightReading = value;
        }
    });

    /*artifacts.forEach(artefact=>{
        if(tempReading>artefact.maxTemp || tempReading < artefact.minTemp)
        {console.warn("Artefact " + artefact.name + ": Temperature is out of bounds!")}
        else if(humReading>artefact.maxHumidity || humReading < artefact.minHumidity)
        {console.warn("Artefact " + artefact.name + ": Humidity is out of bounds!")}
        else if(lightReading>artefact.maxLight)
        {console.warn("Artefact " + artefact.name + ": Light levels too high!")}
    })*/

    tempConditionData(tempReading);
    humidityConditionData(humReading);
    lightConditionData(lightReading);


}

module.exports = conditionLogic;