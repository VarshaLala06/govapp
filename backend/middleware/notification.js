// // Web-Socket Start
// const express = require("express");
// const app = express();
// const http = require('http');
// const WebSocket = require('ws');
//
// const server = http.createServer(app);
// const wss = new WebSocket.Server({server});
//
// let clients = [];
//
// wss.on('connection', (ws) => {
//     clients.push(ws);
//     console.log('New client connected');
//
//     ws.on('close', () => {
//         clients = clients.filter(client => client !== ws);
//         console.log('Client disconnected');
//     });
// });
//
// exports.notifyClients = (complaint) => {
//     clients.forEach(client => {
//         client.send(JSON.stringify({
//             message: `New complaint received: ${complaint.title}`,
//             complaintId: complaint.id,
//         }));
//     });
// };
//
//
// // Web-Socket End