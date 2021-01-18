const serverUrl = "localhost";

var socket = io.connect();
var websiteDomain = `${serverUrl}/`;

var successMsg = document.getElementById("success-msg");
var inviteURL = document.getElementById("invite-url");
var invitePhrase = document.getElementById("invite-phrase");
var inviteDiv = document.getElementById("invite-div");
var roomNameInput = document.getElementById("roomNameInput");

var roomDuration = "30 minutes";

// Prevent enter key submit
window.addEventListener('keydown',function (e) {
    if (e.keyIdentifier == 'U+000A' || e.keyIdentifier == 'Enter' || e.keyCode == 13) {
        if (e.target.nodeName == 'INPUT' && e.target.type == 'text') {
            e.preventDefault();
            return false;
        }
    }
}, true);

// Animation to prevent image overlapping create room status text
$(document).ready(function(){
    $("#createButton").click(function(){
        $("#logo").animate({paddingTop: "40px"});
        $("#grassImg").animate({paddingBottom: "0px"});
    });
});

// END OF SET UP
/******************************************************************************************** */


// *********************************
// * SOCKET EVENTS
// *********************************

socket.on('createRoomSuccess', function (data) {
    console.log("create room success");
    
    successMsg.innerText = "Room creation success!\nPlease note that rooms expire after "
                            + roomDuration
                            + " of inactivity.";
    inviteURL.href = data.roomName;
    inviteURL.innerText = websiteDomain + data.roomName;
    invitePhrase.hidden = false;
    inviteDiv.hidden = false;

    roomNameInput.value = "";
});

socket.on('createRoomError', function (data) {
    console.log("create room error");
    
    successMsg.innerText = "This room already exists!\nVisit it here:";
    inviteURL.href = data.roomName;
    inviteURL.innerText = websiteDomain + data.roomName;
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
        successMsg.innerText = "Please remove all non-alphanumeric characters. Underscores are allowed.";
        inviteURL.innerText = "";
        invitePhrase.hidden = true;
        inviteDiv.hidden = false;

    } else {
        console.log("sending to server to create room named: " + formattedInput);
        socket.emit('createRoom', { 'roomName': formattedInput });
        console.log("sent!");
    }
}