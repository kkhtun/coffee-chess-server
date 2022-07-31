module.exports =
    (SocketHandler) =>
    ({ io, socket }) => {
        io.emit("connection", "Hello, Socket");

        socket.on("join:game", async ({ gameId }) => {
            const game = await SocketHandler.joinGame({
                gameId,
                player: socket.data.user,
            });
            socket.leaveAll();
            socket.join(gameId);
            io.to(gameId).emit("joined:game", game);
        });

        socket.on("move:piece", async ({ gameId, move, fen }) => {
            // currently no server side validation yet
            const valid = true;
            if (valid === true) {
                const game = await SocketHandler.updateGame({
                    _id: gameId,
                    fen,
                    move,
                });
                socket.to(gameId).emit("moved:piece", { move, fen: game.fen });
            } else {
                socket.to(gameId).emit("moved:invalid", { move, fen });
            }
        });
    };
