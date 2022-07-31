// const { Chess } = require("chess.js");
module.exports = ({ GamesController }) => ({
    updateGame: async (data) => {
        return await GamesController.updateGame(data);
    },
    getOneGame: GamesController.getOneGame,
    joinGame: async ({ gameId, player }) => {
        const game = await GamesController.getOneGame({ gameId });
        if (
            game.player_one === player._id.toString() ||
            game.player_two === player._id.toString()
        ) {
            return game;
        }
        if (!game.player_two) {
            return await GamesController.updateGame({
                _id: gameId,
                player_two: player._id,
            });
        }
    },
    // movePiece: ({ move, fen }) => {
    //     // validate using ChessJS
    //     const game = new Chess(fen);
    //     return { valid: game.move(move), fen: game.fen() };
    // },
});
