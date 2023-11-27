const motionDetectData = require('../TCPDataAccess/MotionDetectionDataAccess')

function motionDetectLogic() {
    const timestamp = Date.now();
    const currentDate = new Date(timestamp);

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    motionDetectData(timestamp, formattedDate);

}


module.exports = motionDetectLogic;