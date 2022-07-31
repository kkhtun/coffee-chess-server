module.exports = ({ UsersService }) => ({
    syncUser: async (data) => {
        return await UsersService.syncUser(
            { firebase_id: data.firebase_id },
            data
        );
    },
});
