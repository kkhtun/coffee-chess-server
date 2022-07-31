const Joi = require("joi");
Joi.objectid = require("joi-objectid")(Joi);

module.exports = ({ UsersController }) => ({
    syncUser: async (req, res, next) => {
        const { value, error } = Joi.object({
            firebase_id: Joi.string().required(),
            email: Joi.string().optional(),
            name: Joi.string().optional(),
        }).validate(req.body);

        if (error) return next(error);

        try {
            const ret = await UsersController.syncUser(value);
            return res.status(200).send(ret);
        } catch (e) {
            return next(e);
        }
    },
});
