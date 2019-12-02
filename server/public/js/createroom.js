var socket = io.connect("pxArt.us:1234");
var websiteDomain = "pxArt.us/";

var successMsg = document.getElementById("success-msg");
var inviteURL = document.getElementById("invite-url");
var invitePhrase = document.getElementById("invite-phrase");
var inviteDiv = document.getElementById("invite-div");
var roomNameInput = document.getElementById("roomNameInput");

window.addEventListener('keydown',function (e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
        if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            e.preventDefault();
            return false;
        }
    }
}, true);

console.log("set!");


socket.on('createRoomSuccess', function (data) {
    console.log("create room success");
    
    successMsg.innerText = "Room creation success!";
    inviteURL.href = data.roomName;
    inviteURL.innerText = websiteDomain + data.roomName;
    invitePhrase.hidden = false;
    inviteDiv.hidden = false;

    roomNameInput.value = "";
});

socket.on('createRoomError', function (data) {
    console.log("create room error");
    
    successMsg.innerText = "This room already exists! Try another name.";
    inviteURL.href = "#";
    inviteURL.innerText = "";
    invitePhrase.hidden = true;
    inviteDiv.hidden = false;
});





// *********************************
// * FUNCTIONS
// *********************************

function clientCreateRoom() {
    var userInput = document.getElementById("roomNameInput").value;
    var formattedInput = JSON.stringify(userInput).replace(/\W/g, '').toLowerCase();

    if (userInput.length == 0) {
        console.log("empty room name entered");
        successMsg.innerText = "Your room name cannot be empty!";
        inviteURL.innerText = "";
        invitePhrase.hidden = true;
        inviteDiv.hidden = false;

    } else if (userInput.toLowerCase() != formattedInput) {
        console.log("invalid room name entered");
        successMsg.innerText = "Invalid room name!\nPlease remove all non-alphanumeric characters.";
        inviteURL.innerText = "";
        invitePhrase.hidden = true;
        inviteDiv.hidden = false;

    } else {
        console.log("sending to server to create room named: " + formattedInput);
        socket.emit('createRoom', { 'roomName': formattedInput });
        console.log("sent!");
    }
}