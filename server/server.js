var express = require('express')
  , http = require('http');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var JSONboard = {"canvasRGB" : {
	"rows" : [
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		],
		[
			"#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852", "#32a852"
		]
	]}};

server.listen(1234);
console.log("Listening...");

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log("connected!");
	socket.emit('boardUpdateFromServer', JSONboard);
	// console.log("about to send news");
	// socket.emit('news', { my: 'news' });
	// console.log("just sent news!");

	socket.on('boardUpdateFromClient', function (data) {
		console.log("received board from client:")
		console.log(data);
		console.log(data.canvasRGB.rows);
	});

});

function boardUpdateFromServer(data)
{
	console.log("about to tell connections to update board");
	socket.emit('boardUpdateFromServer', JSONboard);
	console.log("told connections to update board");
}