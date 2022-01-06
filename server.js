const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const { userJoin, getCurrentUser } = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatBot";
// run when client connects
io.on("connection", socket => {
  socket.on("joinRoom", ({username, room}) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);

    console.log("New WS Connection...");

    socket.emit("message", formatMessage(botName, "Welcome to the chat!"));
  
  
    // broadcast when a user connects
    socket.broadcast.to(user.room).emit("message", formatMessage(botName, `${user.username} has joined the chat`));
  });
 


    // listen for chatMessage
    socket.on("chatMessage", msg => {
      
      const user = getCurrentUser(socket.id);

      io.to(user.room).emit("message", formatMessage(user.username, msg));
    })

  // runs when client disconnects
  socket.on("disconnect", () => {
    // send message to all client
    io.emit("message", formatMessage(botName, "A user has left the chat"));
  })
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
