const { Router } = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
module.exports = ({ GamesHandler }) => {
    // Routes Here
    const router = Router();

    router.post("/", isAuthenticated, GamesHandler.createNewGame);
    router.get("/", isAuthenticated, GamesHandler.getGames);
    router.get("/random", isAuthenticated, GamesHandler.getRandomGameToJoin);

    router.get("/:gameId", isAuthenticated, GamesHandler.getOneGame);

    return router;
};
