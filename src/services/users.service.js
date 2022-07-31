module.exports = ({ UsersModel, USER_ERRORS }) => ({
    getOneUserByFilter: async (filter, projection = {}, throwError = true) => {
        const user = await UsersModel.findOne(filter, projection).lean().exec();
        if (throwError && !user) throw new Error(USER_ERRORS.NOT_FOUND);
        return user;
    },
    createUser: async (data) => {
        const user = new UsersModel(data);
        return await user.save();
    },
    syncUser: async (filter, data) => {
        const user = await UsersModel.findOne(filter).exec();
        if (!user) {
            const user = new UsersModel(data);
            return await user.save();
        } else {
            user.firebase_id = data.firebase_id;
            user.name = data.name;
            user.email = data.email;
            return await user.save();
        }
    },
});
