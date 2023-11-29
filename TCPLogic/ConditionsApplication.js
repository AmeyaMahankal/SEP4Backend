const { tempConditionData } = require('../TCPDataAccess/ConditionsDataAcess')

function conditionLogic(receivedData) {
    let list = receivedData.split('/');

    console.log(list);

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

    console.log("temp reading is " + tempReading);
    console.log("hum reading is " + humReading);
    console.log("light reading is " + lightReading);

    tempConditionData(tempReading);
    //humidityConditionData(humReading);
    //lightConditionData(lightReading);


}

module.exports = conditionLogic;