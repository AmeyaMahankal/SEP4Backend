const net = require("net");
const mongoose = require('mongoose')
const axios = require("axios");
const mongoString = process.env.DATABASE_URL

const clients = [];

const server = net.createServer((socket) => {
    console.log("someone connected :3");

    clients.push(socket);


    socket.on("data", async (data) => {
        console.log(`Received from client: ${data.toString()}`);

        if (data.toString() == "1ChangeSecurityStatus") {
            clients.forEach((client) => {
                if (client !== socket) {
                    client.write("2iotplease");
                }
            });
        }
        else if (data.includes("4SecurityStatusChanged")) {

            clients.forEach((client) => {
                if (client !== socket) {
                    client.write("4SecurityStatusChanged")
                }
            });
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
        const endpointurl = ""
        /*
                try {
                    const response = await axios.post("http://localhost:3000/api/post", {
                        "name": "plswork",
                        "age": temperature
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

const host = "192.168.1.95"; //ip
const port = 23; //port

server.listen(port, host, () => {
    console.log(`Server is listening on ${host}:${port}`);
});


