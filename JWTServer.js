// server.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes/JWTs');

const app = express();
const port = 3002;

// Connect to MongoDB (replace with your MongoDB connection string)
mongoose.connect('mongodb+srv://ameyamahankal:4mq7FaDOD8LzQg18@cluster0.sjpz1jh.mongodb.net/'
,{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
