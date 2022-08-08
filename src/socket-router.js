module.exports =
    (SocketHandler) =>
    ({ socket }) => {
        socket.emit("connection", "Hello, Socket");

        socket.on("join:game", async ({ gameId }) => {
            const player = socket.data.user;
            const game = await SocketHandler.joinGame({
                gameId,
                player,
            });

            socket.leaveAll();
            socket.join(gameId);
            socket.to(gameId).emit("joined:game", game);
            socket.to(gameId).emit("alert:game", {
                message: `${player.name} joined the game`,
            });
        });

        socket.on(
            "move:piece",
            async ({
                gameId,
                move,
                fen,
                pgn,
                containsGameOverMessage = false,
            }) => {
                // currently no server side validation yet, should validate the move here
                const valid = true;
                if (valid === true) {
                    const game = await SocketHandler.updateGame({
                        _id: gameId,
                        fen,
                        pgn,
                    });
                    socket.to(gameId).emit("moved:piece", {
                        move,
                        fen: game.fen,
                        pgn: game.pgn,
                    });

                    if (containsGameOverMessage) {
                        socket.to(gameId).emit("alert:game", {
                            message: containsGameOverMessage,
                        });
                    }
                } else {
                    socket.to(gameId).emit("moved:invalid", { move, fen, pgn });
                }
            }
        );

        // If a client wants to send any arbitary alerts in game
        socket.on("alert:game", ({ gameId, message }) => {
            socket.to(gameId).emit("alert:game", { message });
        });
        // If player leaves a game screen (board), to be safe, I'll just leave him from all the rooms
        socket.on("leave:all", ({ name }) => {
            Array.from(socket.rooms).forEach((gameId) => {
                socket.to(gameId).emit("alert:game", {
                    message: name + " left the game",
                });
            });
            socket.leaveAll();
        });
    };
