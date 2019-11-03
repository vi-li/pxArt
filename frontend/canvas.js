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

document.getElementById('toggleGridBut').onclick = function() {
    toggleGrid();
}

var LENGTH_PX = 500;
var LENGTH_BOXES = 10;
var OFFSET_CENTER = 500;
var currColorEle = document.getElementById('currColor')
var currColor = "#000000";

currColorEle.style.backgroundColor = currColor;


function drawGrid(gridColor) {

    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    if (gridColor) {
        ctx.strokeStyle = "black"; 
    } else {
        ctx.strokeStyle = "white"; 
    }

    var i;

    for (i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(((i*(LENGTH_PX / LENGTH_BOXES))), 0);
        ctx.lineTo(((i*(LENGTH_PX / LENGTH_BOXES))),LENGTH_PX);
        ctx.strokeStyle = gridColor; 
        ctx.stroke();
    }
    for (i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(0, ((i*(LENGTH_PX / LENGTH_BOXES))));
        ctx.lineTo(LENGTH_PX, (i*(LENGTH_PX / LENGTH_BOXES)));
        ctx.stroke();
    }

}

function toggleGrid() {
    console.log("here");
    let but = document.getElementById('toggleGridBut');
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");

    if (but.classList.contains('active')) {
        console.log("still here");
        ctx.strokeStyle = "black"; 
        gridColor = 1;
    } else {
        console.log("idk why here");
        but.className += " active";
        ctx.strokeStyle = "white";
        but.classList.toggle('active')
        gridColor = 0;
        console.log(but);
    }

    var i;

    for (i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(((i*(LENGTH_PX / LENGTH_BOXES))), 0);
        ctx.lineTo(((i*(LENGTH_PX / LENGTH_BOXES))),LENGTH_PX);
        ctx.strokeStyle = gridColor; 
        ctx.stroke();
    }
    for (i = 0; i <= LENGTH_BOXES; i++) {
        ctx.moveTo(0, ((i*(LENGTH_PX / LENGTH_BOXES))));
        ctx.lineTo(LENGTH_PX, (i*(LENGTH_PX / LENGTH_BOXES)));
        ctx.stroke();
    }

}

function colorPixel(cx,cy,hexRGB) {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = hexRGB;
    ctx.fillRect((cx * (LENGTH_PX / LENGTH_BOXES)) + 1, (cy * (LENGTH_PX / LENGTH_BOXES)) + 1 , 48, 48);

    JSONboard.canvasRGB.board[cx][cy] = hexRGB;
}

function colorPixelFromArray() {
    var cArray = JSONboard.canvasRGB.board;

    for (let i = 0; i < cArray.length; i++) {
        for (let j = 0; j < cArray.length; j++) {
            colorPixel(i, j, cArray[i][j]);
        }
    }
}

function getPosition(event) {
  var x = event.x;
  var y = event.y;

  var canvas = document.getElementById("myCanvas");

  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  cx = Math.floor(x / (LENGTH_PX / LENGTH_BOXES));
  cy = Math.floor(y / (LENGTH_PX / LENGTH_BOXES));

//   var hexRGB = document.getElementById("penColor").value;
    var hexRGB = currColor;

  notifyServerOfPixel(cx, cy, hexRGB);
}

function updateCurrColor(event) {
    currColor = document.getElementById("penColor").value;
    currColorEle.style.backgroundColor = currColor;
    console.log(currColor);
    console.log("here");
}

function updateFromPreset (presetID) {
    let color = document.getElementById(presetID).style.backgroundColor;
    currColor = color;
    currColorEle.style.backgroundColor = color;

    if (presetID == "preset1") {
        color = "#ff0000";
    }

    if (presetID == "preset2") {
        color = "#ffa500";
    }

    if (presetID == "preset3") {
        color = "#ffff00";
    }

    if (presetID == "preset4") {
        color = "#00ff00";
    }

    if (presetID == "preset5") {
        color = "#0000ff";
    }

    if (presetID == "preset6") {
        color = "#800080";
    }

    currColor = color;
    currColorEle.style.backgroundColor = color;

}

document.getElementById('multiColor').onclick = function () {
    document.getElementById('penColor').click();
}

document.getElementById("penColor").addEventListener("change", updateCurrColor, false);

