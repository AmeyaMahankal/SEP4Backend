require('dotenv').config();
const cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const mongoString = process.env.DATABASE_URL

const startUp = require('./TCPDataAccess/StartupDataAccess')

mongoose.connect(mongoString);
const database = mongoose.connection

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

app.use('/temp', temps)
app.use('/light', lights)
app.use('/humid', humid)
app.use('/motion', motion)
app.use('/jwt', jwt)
app.use('/motdetect', motdetect)
app.use('/artifacts', artifacts)
app.use('/pins', pins)


app.get("/", (req, res) => {
    res.send("<h2>Express Server running on port 3000</h2>")
})

app.listen(3000, () => {
    startUp();
    console.log(`Server started at ${3000}`)
})