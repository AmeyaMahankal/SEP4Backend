require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL

test('should connect to database', (done) => {
    mongoose.connect(mongoString);
    const database = mongoose.connection

    database.on('error', (error) => {
        console.error('Database connection error:', error);
        done.fail(error); // Fail the test if there is an error

    });

    database.once('connected', () => {
        console.log('Database Connected');
        expect(mongoose.connection.readyState).toBe(1);
        mongoose.disconnect();
        done();

    })

})
