var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var sockets = [];
var board = new Array(10)
var BOARD_WIDTH = 10;

console.log("setting up canvas");
for (let i = 0; i < BOARD_WIDTH; ++i)
{
	board[i] = new Array(10)
}

for (let i = 0; i < BOARD_WIDTH; ++i)
{
	for (let j = 0; j < BOARD_WIDTH; ++j) {
		board[i][j] = '#FFFFFF';
	}
}

var JSONboard = {"canvasRGB" : { "board" : board }};

server.listen(1234);
console.log("Listening...");

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log("connected!");
	sockets.push(socket);
	boardUpdateFromServer(socket, JSONboard);
	// console.log("about to send news");
	// socket.emit('news', { my: 'news' });
	// console.log("just sent news!");

	socket.on('boardUpdateFromClient', function (data) {
		console.log("received board from client:");
		JSONboard = data;
	});

	socket.on('pixelUpdateFromClient', function (data) {
		console.log("received pixel from client");
		JSONboard.canvasRGB.board[data.x][data.y] = data.hexRGB;
		
		boardUpdateFromServer(socket, JSONboard);
	});

});



function boardUpdateFromServer(socket, data)
{
	console.log("about to tell connections to update board");
	for (let i = 0; i < sockets.length; ++i)
	{
		sockets[i].emit('boardUpdateFromServer', data);
	}

	console.log("told connections to update board");
}