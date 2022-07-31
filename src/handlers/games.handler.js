const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

module.exports = ({ GamesController }) => ({
    createNewGame: async (req, res, next) => {
        const { value, error } = Joi.object({
            playerId: Joi.objectid().required(),
        }).validate({
            playerId: req.user ? req.user._id.toString() : undefined,
        });

        if (error) return next(error);

        try {
            const ret = await GamesController.createNewGame(value);
            return res.status(201).send(ret);
        } catch (e) {
            return next(e);
        }
    },
    getOneGame: async (req, res, next) => {
        const { value, error } = Joi.object({
            gameId: Joi.objectid().required(),
        }).validate(req.params);

        if (error) return next(error);

        try {
            const ret = await GamesController.getOneGame(value);
            return res.status(200).send(ret);
        } catch (e) {
            return next(e);
        }
    },
    getGames: async (req, res, next) => {
        const { value, error } = Joi.object({
            limit: Joi.number().integer().default(10),
            skip: Joi.number().integer().default(0),
        }).validate(req.query);

        if (error) return next(error);

        try {
            const ret = await GamesController.getGames(value);
            return res.status(200).send(ret);
        } catch (e) {
            return next(e);
        }
    },
});
