var socket = io.connect(process.env.SOCKET_API_URL);

var roomName = window.location.pathname.substr(1, window.location.pathname.length - 1);
joinRoom(roomName);

// END OF SET UP
/******************************************************************************************** */


// *********************************
// * SOCKET EVENTS
// *********************************

socket.on('newUserJoin', function () {
    console.log("new user joined");
});

socket.on('joinRoomError', function (data) {
    console.log("join room error");
    alert("Room \"" + data.roomName + "\" does not exist!\nCreate a new room from the homepage.");
});

socket.on('bootToHome', function (data) {
    console.log("error occurred, booting to home");
    window.location.href = '/';
});


// *********************************
// * FUNCTIONS
// *********************************

function joinRoom(roomName)
{
    socket.emit('joinRoom', { 'roomName': roomName });
}

function notifyServerOfPixel(x, y, hexRGB, roomName)
{
    socket.emit('pixelUpdateFromClient', { 'x': x, 'y' : y, 'hexRGB' : hexRGB, "roomName" : roomName });
    console.log("sent server the pixel");
}

function requestUpdateFromServer(roomName) {
    socket.emit('requestUpdate', { "roomName" : roomName });
}

function clearBoard() {
    socket.emit('clearBoard', {});
}

