require('dotenv').config();

const express = require('express')
const http = require('http');
const path = require('path');

var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);

app.use(express.static('public'));

var BOARD_WIDTH = 15;
var roomBoards = new Map();

var ROOM_TIMEOUT_MS = 1800000;
var roomTimers = new Map();
const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}`)
})

// *********************************
// * END OF SET UP
// *********************************

app.get('/', function (req, res) {
	console.log("\nuser visited homepage");
	res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
	// res.sendFile('frontend/index.html', {root: path.dirname("./")});
});

// Find join requests to url paths that are not to index
app.get('/:pathName', function (req, res) {
	var pathName = req.params.pathName;

	if (roomBoards.has(pathName) && pathName != 'index.html' 
											&& pathName != 0) {
		console.log("\nuser is viewing room: " + pathName);
		res.sendFile(path.join(__dirname, 'frontend', 'art.html'));

	} else if (pathName === 'index.html') {
		console.log("\nserving index.html to client");
		res.sendFile(path.join(__dirname, 'frontend', 'index.html'));

	} else {
		console.log("\nuser tried to join non-existing room")
		res.sendFile(path.join(__dirname, 'frontend', 'error.html'));
	}
});


// *********************************
// * SOCKET EVENTS
// *********************************

io.on('connection', function (socket) {
	console.log("a user connected")

	socket.on('createRoom', function (data) {
		console.log("\nClient trying to create room: " + data.roomName);
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
					board[i][j] = '#23272a';
				}
			}

			roomBoards.set(data.roomName, {"canvasRGB" : { "board" : board }});

			// Room deletion management
			startRoomTimer(data.roomName);

			console.log("successfully created room")
			socket.emit('createRoomSuccess', data)
		} else {
			console.log("error creating room, room already exists");
			socket.emit('createRoomError', data);
		}
	});

	socket.on('joinRoom', function (data) {
		console.log("\nclient trying to join room: " + data.roomName);
		var roomName = data.roomName;

		// Checking if room has been created already
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

	socket.on('pixelUpdateFromClient', function (data) {
		var currBoard = roomBoards.get(data.roomName);

		// Making sure not out of bounds
		if (currBoard != null && currBoard.canvasRGB != null && currBoard.canvasRGB.board != null) {

			console.log("received pixel from client from room: " + data.roomName);

			currBoard.canvasRGB.board[data.x][data.y] = data.hexRGB;
			roomBoards.set(data.roomName, currBoard);
			
			// Sending pixel update to all users in room
			boardUpdateFromServer(socket, currBoard, data.roomName);

			// Resetting timer
			refreshRoomTimer(data.roomName);

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
	io.to(roomName).emit('boardUpdateFromServer', data);

	console.log("told connections in " + roomName + " to update board");
}

function joinRoomError(socket, data)
{
	console.log("client failed to join room.");
	socket.emit('joinRoomError', data);
}

// Room Timer Functionality
function deleteRoom(roomName) 
{
	console.log("\ndeleting room: " + roomName);
	roomBoards.delete(roomName);
	roomTimers.delete(roomName);
}

function startRoomTimer(roomName)
{
	var roomTime = setTimeout(deleteRoom, ROOM_TIMEOUT_MS, roomName);
	roomTimers.set(roomName, roomTime);
}

function refreshRoomTimer(roomName)
{
	// Clear old timer
	var oldRoomTime = roomTimers.get(roomName);
	clearTimeout(oldRoomTime);

	// Add new timer
	var newRoomTime = setTimeout(deleteRoom, ROOM_TIMEOUT_MS, roomName);
	roomTimers.set(roomName, newRoomTime);
}