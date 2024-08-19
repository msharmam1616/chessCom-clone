
import WebSocket, {WebSocketServer} from "ws";
import { corsMiddleware } from "./auth/userAuth";
const express= require('express');
const cors= require('cors');
const app= express();
const userRoute= require('./routes/user');

app.use(cors());
app.use(express.json());
app.use(corsMiddleware);

app.use("/api/v1/user", userRoute);


const httpServer= app.listen(3000, () =>{
    console.log("connected successfully!");
})


const wss= new WebSocketServer({server: httpServer});

wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', function message(data, isBinary){
        wss.clients.forEach(function each(client) {
            if(client.readyState == WebSocket.OPEN){
                console.log("data received");
                console.log(data);
                client.send(data, {binary: isBinary});
            }
        })
    });

    ws.send("Hello from the server!");
})