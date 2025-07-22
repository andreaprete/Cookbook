//Import the mongoose module
const mongoose = require('mongoose');


function initDatabaseConnection (database){
    //Set up default mongoose connection
    const mongoDB = `mongodb://127.0.0.1:27017/${database}`;
    mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    //Get the default connection
    const db = mongoose.connection;

    //Bind connection to error event (to get notification of connection errors)
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', function() {
        console.log("MongoDB connected");
    });
}

module.exports = initDatabaseConnection;
