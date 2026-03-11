//import express, socket and db + dotenv for the password security

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

let adapter = new JSONFile('./db.json')
let defaultData = { stories: [] }

let db = new Low(adapter, defaultData)

await db.read()


// __dirname in ES Modules
let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

let app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// // post route to check the password
// app.post('/check-password', (req, res) => {
//     let { password } = req.body;
//     if (password === process.env.PASSWORD) {
//         res.json({ success: true });
//     } else {
//         res.json({ success: false });
//     }
// });

// Initialize HTTP server
let server = createServer(app);

// Initialize socket.io (ESM corrected)
let io = new Server(server);

io.on('connection', async (socket) => {
    console.log("New client:", socket.id);

    // when a new client joins, send the history of the written stories on the screen.
    await db.read()
    socket.emit('history', db.data.stories);

    socket.on('msg', async (data) => {
        console.log("Received message:", data);

        // save the sìwritten stories permanently
        db.data.stories.push(data);
        await db.write();

        // send the messagge to all 
        io.emit('msg', data);
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected:", socket.id);
    });
});



// Port
let port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server listening at port: ${port}`);
});
