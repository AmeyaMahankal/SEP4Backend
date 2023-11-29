const net = require("net");
const axios = require("axios");
require('dotenv').config();
const mongoose = require('mongoose')
const mongoString = process.env.DATABASE_URL
const motionDetectLogic = require('./TCPLogic/MotionDetectionApplication')
const MotionModel = require('./model/MotionModel');


mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


const clients = [];

const server = net.createServer((socket) => {
    console.log("someone connected :3");

    clients.push(socket);


    socket.on("data", async (data) => {
        console.log(`Received from client: ${data.toString()}`);

        if (data.toString() == "ChangeSecurityStatus") {
            clients.forEach((client) => {
                if (client !== socket) {
                    client.write("ChangeSecurityStatus");
                }
            });
        }
        else if (data.includes("SSCRemote")) {

            clients.forEach((client) => {
                if (client !== socket) {
                    client.write("SSCRemote")
                }

            });
        }
        else if (data.includes("SSCLocal")) {
            const latestMotionData = await MotionModel.findOne().sort({ time: -1 });

            if (latestMotionData) {
                latestMotionData.detection = !latestMotionData.detection;
                await latestMotionData.save();
            }

        }
        else if (data.includes("MOTION DETECTED")) {
            motionDetectLogic();
        }

        //T=24.1/H=41/L=833
        //Temp = 24.1
        //humidity = 41%
        //Light = 833
        /*
                receivedData = data.toString();
        
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
        
                console.log("temp", tempReading)
                console.log("hum", humReading)
                console.log("light", lightReading)
        
        
                try {
                    const response = await axios.post("http://localhost:3000/temp/post", {
                        "temperature": tempReading
                    });
        
                    console.log("Data sent to the endpoint:", response.data);
                } catch (error) {
                    console.error("Error sending data to the endpoint:", error);
                }
        
                try {
                    const response = await axios.post("http://localhost:3000/humid/posthumidity", {
                        "measurment": humReading
                    });
        
                    console.log("Data sent to the endpoint:", response.data);
                } catch (error) {
                    console.error("Error sending data to the endpoint:", error);
                }
        
                try {
                    const response = await axios.post("http://localhost:3000/light/post", {
                        "lightLevel": lightReading
                    });
        
                    console.log("Data sent to the endpoint:", response.data);
                } catch (error) {
                    console.error("Error sending data to the endpoint:", error);
                }
        
        
        */

    });

    socket.on("end", () => {

        console.log('Client disconnected.');

        // Remove the disconnected client from the array
        const index = clients.indexOf(socket);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });

    server.on("error", (err) => {
        console.error("Server error ,", err);
    })


});

const host = "192.168.214.98"; //ip
const port = 23; //port

server.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
});


