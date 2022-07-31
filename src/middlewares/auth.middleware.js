const { USER_ERRORS } = require("../constants/errors.constants");
const UsersModel = require("../models/users.model");
const UsersService = require("../services/users.service")({
    UsersModel,
    USER_ERRORS,
});
const FirebaseService = require("../services/firebase.service")({});

const makeErrorResponse =
    (res) =>
    ({ status = 401, message = "Unauthorized" }) => {
        return res.status(status).send({
            code: status,
            message: message,
        });
    };

async function extractAuthInfo(req, res, next) {
    let respondError = makeErrorResponse(res);

    let authorization = req.headers.authorization;
    if (authorization) {
        let bearerToken = authorization.split(" ");
        if (bearerToken.length != 2 || bearerToken[0] != "Bearer")
            return respondError({ status: 401, message: "Invalid Token" });

        let token = bearerToken[1];
        try {
            const {
                uid: firebase_id,
                name,
                email,
            } = await FirebaseService.verifyToken(token);

            req.user = await UsersService.syncUser(
                { firebase_id },
                { firebase_id, name, email }
            );
            req.token = token;
            return next();
        } catch (e) {
            console.log(e);
            return respondError({ status: 401, message: "Token Expired" });
        }
    } else {
        return next();
    }
}

function isAuthenticated(req, res, next) {
    if (req.user && req.token) {
        return next();
    }
    return res.status(401).send({
        code: 401,
        message: USER_ERRORS.NOT_AUTHORIZED,
    });
}

function isAdmin(req, res, next) {
    if (req.user && req.user.user_type === "ADMIN") {
        return next();
    }
    return res.status(401).send({
        code: 401,
        message: USER_ERRORS.NOT_AUTHORIZED,
    });
}

async function isSocketAuthenticated(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) next(new Error("Invalid Token"));

    try {
        const {
            uid: firebase_id,
            name,
            email,
        } = await FirebaseService.verifyToken(token);

        socket.data.user = await UsersService.syncUser(
            { firebase_id },
            { firebase_id, name, email }
        );
        socket.data.token = token;
        return next();
    } catch (e) {
        console.log(e);
        return next(new Error("Invalid Token"));
    }
}

module.exports = {
    extractAuthInfo,
    isAuthenticated,
    isAdmin,
    isSocketAuthenticated,
};
