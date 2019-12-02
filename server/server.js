var express = require('express')
  , http = require('http');

var path = require('path');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static('public'));

// OLD SYSTEM WHERE EVERYONE JOINED THE SAME ROOM BY DEFAULT
// var sockets = [];
// var board = new Array(10)
// var BOARD_WIDTH = 10;

// // Initializing board var
// console.log("setting up canvas");
// for (let i = 0; i < BOARD_WIDTH; ++i)
// {
// 	board[i] = new Array(10)
// }

// for (let i = 0; i < BOARD_WIDTH; ++i)
// {
// 	for (let j = 0; j < BOARD_WIDTH; ++j) {
// 		board[i][j] = '#FFFFFF';
// 	}
// }
//
// var JSONboard = {"canvasRGB" : { "board" : board }};

var BOARD_WIDTH = 10;
var roomBoards = new Map();

server.listen(1234);
console.log("Listening...");

app.get('/', function (req, res) {
	console.log("\nuser visited homepage");
	res.sendFile('frontend/index.html', {root: path.dirname(__dirname)});
});

// const middleware = (req, res, next) => {
//     console.log(req.params.pathName);
//     next();
// };

//Find join requests to url paths that are not to index
app.get('/:pathName', function (req, res) {
	var pathName = req.params.pathName;

	if (roomBoards.has(pathName) && pathName != 'index.html' 
											&& pathName != 0) {
		console.log("\nuser is viewing room: " + pathName);
		res.sendFile('frontend/art.html', {root: path.dirname(__dirname)});

	} else if (pathName == 'index.html') {
		console.log("\nserving index.html to client");
		res.sendFile('frontend/index.html', {root: path.dirname(__dirname)});

	} else {
		console.log("\nuser tried to join non-existing room")
		res.sendFile('frontend/error.html', {root: path.dirname(__dirname)});
	}
});

io.on('connection', function (socket) {
	console.log("!");

	// OLD SYSTEM WHERE EVERYONE JOINED THE SAME ROOM BY DEFAULT
	//sockets.push(socket);
	//boardUpdateFromServer(socket, JSONboard);

	socket.on('joinRoom', function (data) {
		console.log("\nclient trying to join room: " + data.roomName);
		var roomName = data.roomName;

		if (roomBoards.has(roomName) && roomName != 'index.html' && roomName.length != 0) {
			
			var joinedRooms = io.sockets.adapter.sids[socket.id];
			for(var room in joinedRooms) { socket.leave(room); }

			socket.join(roomName);
			console.log("successfully joined room!");

			var currBoard = roomBoards.get(roomName);

			io.to(roomName).emit('newUserJoin');

			boardUpdateFromServer(socket, currBoard, roomName);
			
		} else {
			if (!roomBoards.has(roomName)) { console.log("roomBoards does not have " + roomName); }

			joinRoomError(socket, {"roomName" : roomName});
		}
	});

	socket.on('createRoom', function (data) {
		console.log("\nclient trying to create room: " + data.roomName);
		if (!roomBoards.has(data.roomName)) {
			
			var board = new Array(BOARD_WIDTH);

			console.log("setting up new canvas");
			for (let i = 0; i < BOARD_WIDTH; ++i)
			{
				board[i] = new Array(BOARD_WIDTH);
			}

			for (let i = 0; i < BOARD_WIDTH; ++i)
			{
				for (let j = 0; j < BOARD_WIDTH; ++j) {
					board[i][j] = '#FFFFFF';
				}
			}

			roomBoards.set(data.roomName, {"canvasRGB" : { "board" : board }});

			console.log("successfully created room")
			socket.emit('createRoomSuccess', data)
		} else {
			console.log("error creating room, room already exists");
			socket.emit('createRoomError', data);
		}
	});

	socket.on('boardUpdateFromClient', function (data) {
		console.log("received board from client:");
		roomBoards.set(roomName, data);
	});

	socket.on('pixelUpdateFromClient', function (data) {
		console.log("received pixel from client from room: " + data.roomName);

		var currBoard = roomBoards.get(data.roomName);

		if (currBoard != null) {
			currBoard.canvasRGB.board[data.x][data.y] = data.hexRGB;
			roomBoards.set(data.roomName, currBoard);
			
			boardUpdateFromServer(socket, currBoard, data.roomName);
		} else {
			socket.emit('bootToHome');
		}
	});

	socket.on('requestUpdate', function (roomName) {
		if (roomBoards.has(roomName) && roomName != 'index.html' && roomName.length != 0) {

			var currBoard = roomBoards.get(roomName);
			boardUpdateFromServer(socket, currBoard, roomName);
		}
	});

});


// *********************************
// * FUNCTIONS
// *********************************

function boardUpdateFromServer(socket, data, roomName)
{
	// OLD SYSTEM WHERE EVERYONE JOINED THE SAME ROOM BY DEFAULT
	// for (let i = 0; i < sockets.length; ++i)
	// {
	// 	sockets[i].emit('boardUpdateFromServer', data);
	// }

	io.to(roomName).emit('boardUpdateFromServer', data);

	console.log("told connections in " + roomName + " to update board");
}

function joinRoomError(socket, data)
{
	console.log("client failed to join room.");
	socket.emit('joinRoomError', data);
}