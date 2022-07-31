const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        firebase_id: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Users", UsersSchema, "users");
