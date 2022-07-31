const mongoose = require("mongoose");

const GamesSchema = new mongoose.Schema(
    {
        fen: {
            type: String,
            required: true,
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
