const moment = require("moment");
require("dotenv").config();

// Initialize Dependencies
const connectToDb = require("../loaders/db.loader");
const GamesModel = require("../models/games.model");

connectToDb(process.env.MONGO_URL).then(async () => {
    // remove games that are inactive for 6 hours
    const gamesToDelete = await GamesModel.find(
        {
            updatedAt: { $lt: moment().utc().subtract(6, "hours") },
        },
        { _id: 1 }
    ).exec();

    console.log(`Found ${gamesToDelete.length} games to delete. Proceeding...`);
    await GamesModel.deleteMany({
        _id: {
            $in: gamesToDelete.map(({ _id }) => _id),
        },
    })
        .then(({ deletedCount }) => {
            console.log(`Deleted ${deletedCount} games.`);
            console.log("Success!");
            process.exit();
        })
        .catch((error) => {
            console.error(error);
            console.error("Error!");
            process.exit();
        });
});
