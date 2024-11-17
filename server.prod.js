require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./src/routes");
const { sequelize } = require("./src/models");
const app = express();
const server = createServer(app);
const bodyParser = require("body-parser");
const { Chat } = require("./src/models");
const port = process.env.PORT || 3009;

var corsOptions = {
  origin: ["http://localhost:5173","https://chatterbox-dev.vercel.app","*"],
  credentials: true,
  allowHeader: "Content-Type,Authorization,Set-Cookie",
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"))
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Backend is working fine....")
});

const io = new Server(server, {
  cors: {
    origin: ["https://chatterbox-dev.vercel.app", "http://localhost:3000"], // Add your frontend domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    transports: ["websocket", "polling"]  
  },
  allowEIO3: true,  
  path: "/socket.io/",  
  pingTimeout: 60000,   
  pingInterval: 25000,
});

io.on("connection", (socket) => {
  console.log("A user Connected", socket.id);

  socket.on("join", async (data) => {
    console.log("joining user", data);
    const { chatId } = data;
    if (chatId) {
      socket.join(chatId);
    }
  });

  socket.on("privateMessage", (data) => {
    console.log("sending message to receiver", data);
    io.to(data.chatId).emit("receiveMessage", {
      message: data.message,
      chatId: data.chatId,
      senderId: data.senderId,
      attachment: data.attachment
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

io.on("error", (err) => {
  console.error("Socket error:", err);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: { code: statusCode, message: "Something went wrong!", err },
  });
});

// Check if we're in production environment (LiteSpeed)
if (process.env.NODE_ENV === 'production') {
  // In production, just sync the database
  sequelize.sync({ force: false }).then(() => {
    console.log("Database synced successfully");
  });
} else {
  // In development, sync database and start the server
  sequelize.sync({ force: false }).then(() => {
    server.listen(port, () => {
      console.log("Server is running on http://localhost:" + port);
    });
  });
}

module.exports = app;