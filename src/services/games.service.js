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
    getGames: async ({ limit, skip, playerId }) => {
        let query = {};
        if (playerId) {
            query = {
                $or: [{ player_one: playerId }, { player_two: playerId }],
            };
        }
        const data = await GamesModel.find(query)
            .skip(skip)
            .limit(limit)
            .populate("player_one player_two")
            .lean()
            .exec();
        const count = await GamesModel.countDocuments(query);
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
    getRandomGameToJoin: async ({ playerId }) => {
        // this finds a game with missing player_two
        const game = await GamesModel.findOne({
            player_two: { $exists: false },
            player_one: { $ne: playerId },
        })
            .populate("player_one player_two")
            .lean()
            .exec();
        return game;
    },
});
