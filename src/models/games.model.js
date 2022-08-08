const mongoose = require("mongoose");

const GamesSchema = new mongoose.Schema(
    {
        fen: {
            type: String,
            required: true,
        },
        pgn: {
            type: String,
            // required: true,
            // Ref: https://github.com/Automattic/mongoose/issues/7150
            default: "",
        },
        player_one: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
        player_two: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Games", GamesSchema, "games");
