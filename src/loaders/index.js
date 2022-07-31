const initContainer = require("./container.loader");
const connectToDb = require("./db.loader");
const injectContainerToMainRouter = require("../routes");
const injectContainerToSocketHandler = require("../socket-router");

function initialize() {
    const container = initContainer([
        "models",
        "services",
        "controllers",
        "handlers",
        "routes",
        "constants",
        "helpers",
    ]);

    const routes = injectContainerToMainRouter(container);
    const handleSockets = injectContainerToSocketHandler(
        container.cradle.SocketHandler
    );

    const dbConnection = connectToDb(
        process.env.ENV !== "testing"
            ? process.env.MONGO_URL
            : process.env.MONGO_URL_TESTING
    );
    return { dbConnection, routes, handleSockets };
}

module.exports = { initialize };
