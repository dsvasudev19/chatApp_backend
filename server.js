const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors=require("cors")
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors: {
      origin: "*", // Adjust this to your specific needs, "*" allows all origins
      methods: ["GET", "POST"] // Adjust these methods according to your requirements
    }
  });

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  socket.on("register",(data)=>{
    socket.join(data)
    console.log("registering",data);
  })
    socket.on("privateMessage", (data) => {
    console.log(data)
    io.to(data.to).emit("privateMessage", { ...data, from: socket.id });
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

// TODO:
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server);

// // Store connected users and their corresponding sockets
// const users = {};

// io.on("connection", (socket) => {
//   console.log("A user connected");

//   // Handle new user registration and join them to socket
//   socket.on("register", (userId) => {
//     users[userId] = socket.id;
//     console.log(`User ${userId} registered with socket id ${socket.id}`);
//   });

//   // Handle initiating a private chat
//   socket.on("initiatePrivateChat", (data) => {
//     const { from, to } = data;
//     const fromSocketId = users[from];
//     const toSocketId = users[to];
//     if (toSocketId) {
//       socket.join(to); // Join the room with name 'to' (receiver's ID)
//       io.to(toSocketId).emit("privateChatInitiated", { from }); // Notify the receiver
//       console.log(`Private chat initiated from ${from} to ${to}`);
//     } else {
//       console.log(`User ${to} not found.`);
//     }
//   });

//   // Handle incoming messages in a private chat
//   socket.on("privateMessage", (data) => {
//     const { to, message } = data;
//     io.to(to).emit("privateMessage", { ...data, from: socket.id });
//   });

//   // Handle disconnection and remove user from connected users
//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//   });
// });

// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
