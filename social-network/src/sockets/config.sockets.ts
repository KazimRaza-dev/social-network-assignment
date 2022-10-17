import { userDal } from "../dal/index.dal";
import express, { Express } from "express";
const app: Express = express();
import http from "http";
import { Server } from "socket.io";
const server = http.createServer(app);
const io = new Server(server);
let Socket;

io.on('connection', socket => {
    Socket = socket;
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User joined the room ${userId}`);
    });

    socket.on("joinFollowedUsersRooms", async (userId) => {
        try {
            const followedUsers = await userDal.getFollowedUsers(userId);
            followedUsers.map((roomId) => {
                socket.join(roomId);
                console.log(`Joined the room ${roomId}`);
            })
        } catch (error) {
            throw error;
        }
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});



export default app;
export { server, Socket };
