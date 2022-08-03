module.exports = ({ GamesService, UsersService }) => ({
    createNewGame: async ({ playerId }) => {
        const player = await UsersService.getOneUserByFilter({ _id: playerId });
        return await GamesService.createNewGame({ playerId });
    },
    getOneGame: GamesService.getOneGame,
    getGames: GamesService.getGames,
    updateGame: async ({ gameId, ...data }) => {
        return await GamesService.updateGame({ _id: gameId, ...data });
    },
    getRandomGameToJoin: GamesService.getRandomGameToJoin,
});
