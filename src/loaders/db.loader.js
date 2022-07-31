const mongoose = require("mongoose");

module.exports = (url) => {
    const logConnected = (url) => () => {
        let parsedUrl = new URL(url);
        console.log(
            `Connected to ${process.env.ENV} MongoDB ${parsedUrl.host} ${parsedUrl.pathname}`
        );
    };
    const logError = (err) => {
        console.log(`Mongoose Connection Error `, err);
    };
    mongoose.connection.once("open", logConnected(url));
    mongoose.connection.on("error", logError);
    return mongoose.connect(url, {
        autoIndex: true, // not ideal for large production env
        useNewUrlParser: true,
        useUnifiedTopology: true, // mongodb driver's new connection management engine
    }); // returns a connection promise
};
