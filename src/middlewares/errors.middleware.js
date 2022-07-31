const { ValidationError } = require("joi");

function generalErrorHandler(error, req, res, next) {
    if (error instanceof ValidationError) {
        return res.status(422).send({
            code: 422,
            message: error.details[0].message || "UNPROCESSIBLE ENTITY",
        });
    }

    if (error.status && error.status !== 500) {
        return res.status(error.status).send({
            code: error.status,
            message: error.message || "ERROR",
        });
    } else {
        // Uncaught Errors
        console.group("[ServerError]: ", error.message);
        console.error("[STACK]: ", error.stack);

        return res.status(500).send({
            code: 500,
            message: "INTERNAL SERVER ERROR",
        });
    }
}

module.exports = { generalErrorHandler };
