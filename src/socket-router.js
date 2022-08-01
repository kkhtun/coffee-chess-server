module.exports =
    (SocketHandler) =>
    ({ io, socket }) => {
        socket.emit("connection", "Hello, Socket");

        socket.on("join:game", async ({ gameId }) => {
            const player = socket.data.user;
            const game = await SocketHandler.joinGame({
                gameId,
                player,
            });

            socket.leaveAll();
            socket.join(gameId);
            socket.emit("joined:game", game);
            socket.to(gameId).emit("alert:game", {
                message: `${player.name} has joined the game`,
            });
        });

        socket.on(
            "move:piece",
            async ({ gameId, move, fen, gameOver = false }) => {
                const player = socket.data.user;
                // currently no server side validation yet
                const valid = true;
                if (valid === true) {
                    const game = await SocketHandler.updateGame({
                        _id: gameId,
                        fen,
                    });
                    socket
                        .to(gameId)
                        .emit("moved:piece", { move, fen: game.fen });

                    if (gameOver) {
                        socket.to(gameId).emit("alert:game", {
                            message: `Checkmate! ${player.name} has won the game`,
                        });
                    }
                } else {
                    socket.to(gameId).emit("moved:invalid", { move, fen });
                }
            }
        );

        // If a client wants to send any arbitary alerts in game
        socket.on("alert:game", ({ gameId, message }) => {
            socket.to(gameId).emit("alert:game", { message });
        });

        socket.on("leave:game", ({ gameId, name }) => {
            socket.leaveAll();
            socket.to(gameId).emit("alert:game", {
                message: name + " has left the game " + gameId,
            });
        });

        socket.on("leave:all", ({ name }) => {
            Array.from(socket.rooms).forEach((gameId) => {
                socket.to(gameId).emit("alert:game", {
                    message: name + " has left the game",
                });
            });
            socket.leaveAll();
        });
    };
