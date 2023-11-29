const { tempConditionData, humidityConditionData, lightConditionData } = require('../TCPDataAccess/ConditionsDataAcess')

function conditionLogic(receivedData) {
    let list = receivedData.split('/');



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



    tempConditionData(tempReading);
    humidityConditionData(humReading);
    lightConditionData(lightReading);


}

module.exports = conditionLogic;