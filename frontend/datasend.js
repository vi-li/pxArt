var socket = io.connect('http://localhost:1234');

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

function notifyServerOfPixel(x, y, hexRGB)
{
    socket.emit('pixelUpdateFromClient', { 'x': x, 'y' : y, 'hexRGB' : hexRGB });
    console.log("sent server the pixel");
}

