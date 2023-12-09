require('dotenv').config();
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();
app.use(cors())
app.use(express.json());

const temps = require('./routes/Temperatures');
const humid = require('./routes/Humidities');
const lights = require('./routes/LightLevels');
const motion = require('./routes/Motions');
const jwt = require('./routes/PassJWTs');
const motdetect = require('./routes/MotionDetect');
const artifacts = require('./routes/Artifacts');
const pins = require('./routes/PinCodes');
const warning = require("./routes/Warning");

app.use('/temp', temps)
app.use('/light', lights)
app.use('/humid', humid)
app.use('/motion', motion)
app.use('/jwt', jwt)
app.use('/motdetect', motdetect)
app.use('/artifacts', artifacts)
app.use('/pins', pins)
app.use('/warning', warning)


app.get("/", (req, res) => {
    res.send("<h2>Express Server running on port 3000</h2>")
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started at ${port}`);
});