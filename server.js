const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// Handle Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error : ${err.stack}`);
    console.log('Shutting down...');
    process.exit(1);
});

dotenv.config({ path: 'config/config.env' });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true
})
    .then(() => console.log("DB connected successfully"))
    .catch(err => console.log(err))


// Start Server
const PORT = process.env.PORT || 4001;
const mode = process.env.NODE_ENV;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${mode} mode`);
})

// Handle Unhandled Exception
process.on('MongoParseError', err => {
    console.log(`Error : ${err.message}`)
    console.log('Closing Server due to Unhandled Rejection')

    server.close(() => {
        process.exit(1);
    })
})