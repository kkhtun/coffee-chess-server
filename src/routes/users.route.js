const { Router } = require("express");

module.exports = ({ UsersHandler }) => {
    // Routes Here
    const router = Router();

    router.post("/", UsersHandler.syncUser);

    return router;
};
