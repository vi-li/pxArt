var socket = io.connect('http://localhost:1234');

socket.on('news', function (data) {
    console.log("received news from server: ");
    console.log(data);
    //socket.emit('received news', { my: 'data' });
});

socket.on('boardUpdateFromServer', function (data) {
    console.log("received new board!");
    updateBoardFromServer(data);
});

function updateBoardFromServer(data)
{
    JSONboard = data;
    console.log(JSONboard);
    colorPixelFromArray();
}

function notifyServerOfBoard()
{
    socket.emit('boardUpdateFromClient', JSONboard);
    console.log("sent server the board");
}

function notifyServerOfPixel(x, y, hexRGB)
{
    socket.emit('pixelUpdateFromClient', { 'x': x, 'y' : y, 'hexRGB' : hexRGB });
}