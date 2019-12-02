myCanvas.addEventListener("click", getPosition, false);

document.getElementById('preset1').onclick = function() {
    updateFromPreset('preset1');
}
document.getElementById('preset2').onclick = function() {
    updateFromPreset('preset2');
}
document.getElementById('preset3').onclick = function() {
    updateFromPreset('preset3');
}
document.getElementById('preset4').onclick = function() {
    updateFromPreset('preset4');
}
document.getElementById('preset5').onclick = function() {
    updateFromPreset('preset5');
}
document.getElementById('preset6').onclick = function() {
    updateFromPreset('preset6');
}

document.getElementById('preset1').style.backgroundColor = 'red';
document.getElementById('preset2').style.backgroundColor = 'orange';
document.getElementById('preset3').style.backgroundColor = 'yellow';
document.getElementById('preset4').style.backgroundColor = 'green';
document.getElementById('preset5').style.backgroundColor = 'blue';
document.getElementById('preset6').style.backgroundColor = 'purple';


document.getElementById('toggleGridBut').onclick = function() {
    toggleGrid();
}

var roomName = window.location.pathname.substr(1, window.location.pathname.length - 1);
var roomHeader = document.getElementById("roomName");
roomHeader.innerText = roomName;

var HEIGHT_BOXES = 10;
var LENGTH_BOXES = 10;
var heightRatio = HEIGHT_BOXES / LENGTH_BOXES;
var currColorEle = document.getElementById('currColor')
var currColor = "#000000";

currColorEle.style.backgroundColor = currColor;

socket.on('boardUpdateFromServer', function (data) {
    console.log("received new board!");
    updateBoardFromServer(data);
});


// *********************************
// * FUNCTIONS
// *********************************

function drawGrid() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.lineWidth = 1;

    ctx.strokeStyle = "black";

    for (var i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(((i*(ctx.canvas.width / LENGTH_BOXES))), 0);
        ctx.lineTo(((i*(ctx.canvas.width / LENGTH_BOXES))), ctx.canvas.width);
        ctx.stroke();
    }

    for (var i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(0, ((i*(ctx.canvas.width / LENGTH_BOXES))));
        ctx.lineTo(ctx.canvas.width, (i*(ctx.canvas.width / LENGTH_BOXES)));
        ctx.stroke();
    }
}

function toggleGrid() {
    var but = document.getElementById('toggleGridBut');
    var cArray = JSONboard.canvasRGB.board;
    var shouldTurnOnGrid = !but.classList.contains('active');

    if (shouldTurnOnGrid) {
        console.log("ACTIVE");
        drawGrid();

    } else {
        console.log("NOT ACTIVE");

        for (let i = 0; i < cArray.length; i++) {
            for (let j = 0; j < cArray.length; j++) {
                colorPixel(i, j, cArray[i][j]);
            }
        }
    }

}

function colorPixel(cx, cy, hexRGB) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = hexRGB;
    ctx.fillRect((cx * (ctx.canvas.width / LENGTH_BOXES)) + 1, (cy * (ctx.canvas.width / LENGTH_BOXES)) + 1 
                                                             , (ctx.canvas.width / LENGTH_BOXES)
                                                             , (ctx.canvas.height / HEIGHT_BOXES));

    JSONboard.canvasRGB.board[cx][cy] = hexRGB;
}


function updateBoardFromServer(data)
{
    JSONboard = data;
    console.log(JSONboard);
    colorPixelFromArray(data);
}

function colorPixelFromArray(data) {
    //var cArray = JSONboard.canvasRGB.board;
    var cArray = data.canvasRGB.board;

    var but = document.getElementById('toggleGridBut');
    var gridOn = but.classList.contains('active');

    for (let i = 0; i < cArray.length; i++) {
        for (let j = 0; j < cArray.length; j++) {
            colorPixel(i, j, cArray[i][j]);
        }
    }

    if (gridOn) {
        drawGrid();

    } else {
        //console.log("colorpixelfromarray NOT ACTIVE");
    }
}



function getPosition(event) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    var x = event.x;
    var y = event.y;

    var canvas = document.getElementById("myCanvas");

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    cx = Math.floor(x / (ctx.canvas.width / LENGTH_BOXES));
    cy = Math.floor(y / (ctx.canvas.width / LENGTH_BOXES));

    if (cx >= 0 && cx < LENGTH_BOXES &&
        cy >= 0 && cy < LENGTH_BOXES) {
        var hexRGB = currColor;

        console.log(roomName);
        notifyServerOfPixel(cx, cy, hexRGB, roomName);
    } else {
        console.log("tried to change pixel outside of canvas");
    }
}

function updateCurrColor(jscolor) {
    currColor = '#' + jscolor;
    currColorEle.style.backgroundColor = currColor;
    document.getElementById("multiColor").style.backgroundImage = "url('https://img.icons8.com/office/50/000000/rgb-circle-1.png')";
}

function updateFromPreset(presetID) {
    console.log("updating from preset");
    currColor = document.getElementById(presetID).style.backgroundColor;
    console.log(currColor);
    currColorEle.style.backgroundColor = currColor;

    // if (presetID == "preset1") {
    //     color = "#ff0000";
    // }

    // if (presetID == "preset2") {
    //     color = "#ffa500";
    // }

    // if (presetID == "preset3") {
    //     color = "#ffff00";
    // }

    // if (presetID == "preset4") {
    //     color = "#00ff00";
    // }

    // if (presetID == "preset5") {
    //     color = "#0000ff";
    // }

    // if (presetID == "preset6") {
    //     color = "#800080";
    // }
}



// Resizing maybe for another time. :(

// function canvasResize() {
//     var responsiveCanvas = document.getElementById('myCanvas');
//     var canvasDiv = document.getElementById('canvasDiv');

//     responsiveCanvas.style.width = responsiveCanvas.width;
//     responsiveCanvas.style.height = responsiveCanvas.width;

//     console.log("responsiveCanvas.width: " + responsiveCanvas.width.toString());
//     console.log("responsiveCanvas.style.width: " + responsiveCanvas.style.width);
//     console.log("responsiveCanvas.height: " + responsiveCanvas.height.toString());
//     console.log("responsiveCanvas.style.height: " + responsiveCanvas.style.height)

//     responsiveCanvas.height = responsiveCanvas.width * heightRatio;
//     responsiveCanvas.style.height = responsiveCanvas.width * heightRatio;
//     canvasDiv.height = responsiveCanvas.width * heightRatio;

//     requestUpdateFromServer(roomName);

//     console.log("changed height");
// }







document.getElementById('multiColor').onclick = function () {
    //document.getElementById('penColor').click();
}

//document.getElementById("penColor").addEventListener("change", updateCurrColor, false);

