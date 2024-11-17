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
const port=process.env.PORT || 3009;
var corsOptions = {
  origin: ["http://localhost:3001", "http://localhost:3000","http://localhost:5173","https://chatterbox-dev.vercel.app","*"],
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


app.get("/",(req,res)=>{
  res.send("Backend is working fine....")
})

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowHeader: "Content-Type,Authorization,Set-Cookie",
  },
});

io.on("connection", (socket) => {
  
  console.log("A user Connected", socket.id);

  socket.on("join", async (data) => {
    console.log("joining user",data);
    const { chatId } = data;
    if (chatId) {
      socket.join(chatId);
    }
  });

  socket.on("privateMessage", (data) => {
    console.log("sending message to receiver", data);
    io.to(data.chatId).emit("receiveMessage", {message:data.message,chatId:data.chatId,senderId:data.senderId,attachment:data.attachment});
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

sequelize.sync({ force: false }).then(() => {
  server.listen(port, () => {
    console.log("Server is running on http://localhost:"+port);
  });
});


module.exports = app;
