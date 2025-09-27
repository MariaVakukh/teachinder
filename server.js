const express = require('express');

const server=express();
const  PORT = 8888;
server.listen(PORT);
console.log('Server is running on port '+PORT);

server.use(express.static(__dirname));

server.get('/', function(req, res){
    res.sendFile(__dirname+"/lab1.html");
});

//http://localhost:8888