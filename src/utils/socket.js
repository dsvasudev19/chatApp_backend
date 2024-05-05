 const socketio=require("socket.io")
 let io;

 const instantiateSocket=(server)=>{
    if(!io){
        io=socketio(server);
        io.on("connection",(socket)=>{
            socket.on("join",(user)=>{
                socket.join(user.id)
            })

            socket.on("disconnect",()=>{
                console.log("A user Disconnected")
            })
        })

    }
 }

 function getIo() {
    if (!io) {
      throw new Error(
        "Socket.io has not been initialized. Call initSocket(server) first."
      );
    }
  
    return io;
  }
  
  module.exports = { instantiateSocket, getIo };