const net = require("net");
const mongoose = require('mongoose')
const axios = require("axios");
const mongoString = process.env.DATABASE_URL


const server = net.createServer((socket) => {
    console.log("someone connected :3");

    socket.on("data", async (data) => {
        console.log(`Received from client: ${data.toString()}`);
        //T=24.1/H=41/L=833
        //Temp = 24.1
        //humidity = 41%
        //Light = 833

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
        console.log("Client disconnected");
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


