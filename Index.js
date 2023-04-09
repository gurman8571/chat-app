const dotenv=require('dotenv').config();
const Port=process.env.PORT;
require('./Config/Db');
const express = require('express');
//middlewares
const {notfound}=require('./middlewares/ErrorMiddleware')
// Routes
const userRoutes=require('./Routes/UserRoutes')
const chatRoutes=require('./Routes/ChatRoutes')
const MessageRoutes=require('./Routes/MessageRoutes')



const app = express();
var cors = require('cors')

app.use(cors())
app.use(express.json());
//user api's
app.use('/api/user',userRoutes)
//chat api's
app.use('/api/chat',chatRoutes)
//mesage api's
app.use('/api/message',MessageRoutes)

//middlewares
app.use(notfound);

//app.use


const server = app.listen(Port);

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  //console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    //console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  //sockets for typing and not typing views
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

 
