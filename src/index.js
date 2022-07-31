// Load Envs using dotenv
require("dotenv").config();
// Initialize express
const express = require("express");
const app = express();
// Initialize Socket IO
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },
});

// Initialize Loaders for DB, Dependency Injections etc.
const loaders = require("./loaders/index");
const { dbConnection, routes, handleSockets } = loaders.initialize();

// Middleware Imports
const { generalErrorHandler } = require("./middlewares/errors.middleware");
const {
    extractAuthInfo,
    isAuthenticated,
    isSocketAuthenticated,
} = require("./middlewares/auth.middleware");

// Register express middlewares
app.use(require("cors")());
app.use(express.json()); // Yay, bodyParser was bundled back to express after 4.16
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.status(200).send({ message: "Hello, Let's read comics!" });
});

// Main Application Routes
app.use("/api/v1", extractAuthInfo, routes);

// Main Socket Handler
io.use(isSocketAuthenticated).on("connection", (socket) =>
    handleSockets({ io, socket })
);
httpServer.listen(8081, () => console.log("SocketIO listening at 8081"));

app.get("/auth", extractAuthInfo, isAuthenticated, (req, res) => {
    return res.status(200).send({
        message: "Yay! You are authenticated",
    });
});

// Server Error Handling
app.use(generalErrorHandler);

app.use((req, res, next) =>
    res.status(404).send({
        code: 404, // if no routes match, response this
        message: "Resource Not Found",
    })
);

// Start the server listening and database connection
(async function main() {
    const port = process.env.PORT || 3000;
    if (process.env.ENV !== "testing") {
        await dbConnection;
        app.listen(port, () => {
            console.log("Server listening at port :", port);
        });
    }
})();

module.exports = app;
