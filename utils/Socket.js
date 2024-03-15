
export function createSocket(io){
  
    return () =>{
        io.sockets.on("connection",(socket) =>{
       
            socket.on("disconnect",() =>{
               console.log("usuario desconectado");
            })
     
            socket.on("suscribe",(room) =>{
               socket.join(room);
            });
     
            socket.io("unsubscribe",(room) => {
               socket.leave(room);
            });
        });
    }
}