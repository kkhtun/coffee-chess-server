// const { Chess } = require("chess.js");
module.exports = ({ GamesController }) => ({
    updateGame: async (data) => {
        return await GamesController.updateGame(data);
    },
    getOneGame: GamesController.getOneGame,
    joinGame: async ({ gameId, player }) => {
        const game = await GamesController.getOneGame({ gameId });
        const { player_one, player_two } = game;
        if (player_one._id.toString() === player._id.toString()) {
            return game;
        }
        if (!player_two) {
            const updatedGameWithP2 = await GamesController.updateGame({
                _id: gameId,
                player_two: player._id,
            });
            return updatedGameWithP2;
        }
        return game;
    },
    // movePiece: ({ move, fen }) => {
    //     // validate using ChessJS
    //     const game = new Chess(fen);
    //     return { valid: game.move(move), fen: game.fen() };
    // },
});
