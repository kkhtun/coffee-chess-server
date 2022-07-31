const router = require("express").Router();

module.exports = (container) => {
    // Routes Here
    router.use("/users", container.cradle.UsersRouter);
    router.use("/games", container.cradle.GamesRouter);

    return router;
};
