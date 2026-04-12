import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeOnline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN || "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {

        socket.on("join-call", (path) => {

            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            // Notify all users in the room about the new join
            for (let i = 0; i < connections[path].length; i++) {
                io.to(connections[path][i]).emit("user-joined", socket.id, connections[path])
            }

            // Send existing chat history to the new joiner
            if (messages[path] !== undefined) {
                for (let i = 0; i < messages[path].length; i++) {
                    io.to(socket.id).emit("chat-message",
                        messages[path][i]['data'],
                        messages[path][i]['sender'],
                        messages[path][i]['socket-id-sender']
                    )
                }
            }

        })

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })

        socket.on("chat-message", (data, sender) => {
            // Find which room this socket belongs to
            let matchingRoom = '';
            let found = false;

            for (const [roomKey, roomValue] of Object.entries(connections)) {
                if (roomValue.includes(socket.id)) {
                    matchingRoom = roomKey;
                    found = true;
                    break;
                }
            }

            if (found) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                messages[matchingRoom].push({
                    'sender': sender,
                    'data': data,
                    'socket-id-sender': socket.id
                })

                // Broadcast to all users in the room
                connections[matchingRoom].forEach((ele) => {
                    io.to(ele).emit("chat-message", data, sender, socket.id)
                })
            }
        })

        socket.on("disconnect", () => {
            // Find and remove the socket from all rooms
            for (const [roomKey, roomValue] of Object.entries(connections)) {
                const index = roomValue.indexOf(socket.id);

                if (index !== -1) {
                    // Notify remaining users in this room
                    for (let j = 0; j < connections[roomKey].length; j++) {
                        io.to(connections[roomKey][j]).emit('user-left', socket.id)
                    }

                    // Remove socket from the room
                    connections[roomKey].splice(index, 1);

                    // Clean up empty rooms and their messages
                    if (connections[roomKey].length === 0) {
                        delete connections[roomKey]
                        delete messages[roomKey]
                    }
                }
            }

            // Clean up online time tracking
            delete timeOnline[socket.id]
        })
    })

    return io;
}
