module.exports = ({ GamesModel, GAME_ERRORS }) => ({
    createNewGame: async ({ playerId }) => {
        const game = new GamesModel({
            fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // initial board position FEN
            player_one: playerId,
        });
        return await game.save();
    },
    getOneGame: async ({ gameId }) => {
        const game = await GamesModel.findOne({ _id: gameId })
            .populate("player_one player_two")
            .lean()
            .exec();
        if (!game) throw new Error(GAME_ERRORS.NOT_FOUND);
        return game;
    },
    getGames: async ({ limit, skip, ...filter }) => {
        const data = await GamesModel.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("player_one player_two")
            .lean()
            .exec();
        const count = await GamesModel.countDocuments(filter);
        return { data, count };
    },
    updateGame: async ({ _id, ...update }) => {
        const game = await GamesModel.findOneAndUpdate({ _id }, update, {
            new: true,
        })
            .populate("player_one player_two")
            .lean()
            .exec();
        if (!game) throw new Error(GAME_ERRORS.NOT_FOUND);
        return game;
    },
});
