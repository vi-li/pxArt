const serverUrl = "pxart.herokuapp.com";

var socket = io.connect();
var websiteDomain = `${serverUrl}/`;

var statusMsg = document.getElementById("status-msg");
var inviteURL = document.getElementById("invite-url");
var invitePhrase = document.getElementById("invite-phrase");
var inviteDiv = document.getElementById("invite-div");
var roomNameInput = document.getElementById("roomNameInput");

var roomDuration = "30 minutes";

// Prevent enter key submit
window.addEventListener('keydown',function (e) {
    if (e.keyIdentifier ===  'U+000A' || e.keyIdentifier === 'Enter' || e.key === 'Enter') {
        if (e.target.nodeName === 'INPUT' && e.target.type === 'text') {
            e.preventDefault();
            clientCreateRoom();
            return false;
        }
    }
}, true);

// END OF SET UP
/******************************************************************************************** */


// *********************************
// * SOCKET EVENTS
// *********************************

socket.on('createRoomSuccess', function (data) {
    console.log("create room success");
    
    statusMsg.innerText = "Room creation success!\nPlease note that rooms expire after "
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
    statusMsg.innerText = "This room already exists!\nVisit it here:";
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

    // Animation to prevent image overlapping create room status text
    $("#logo").animate({paddingTop: "40px"});
    $("#grassImg").animate({paddingBottom: "0px"});

    if (userInput.length === 0) {
        console.log("empty room name entered");
        userErrorMessage("Your room name cannot be empty!");

    } else if (userInput.length > 50) {
        console.log("too long room name entered");
        userErrorMessage("Your room name cannot be longer than 50 characters!");

    } else if (userInput.toLowerCase() != formattedInput) {
        console.log("invalid room name entered");
        userErrorMessage("Please remove all non-alphanumeric characters. Underscores are allowed.");

    } else {
        console.log("sending to server to create room named: " + formattedInput);
        socket.emit('createRoom', { 'roomName': formattedInput });
        console.log("sent!");
    }
}

function userErrorMessage(statusMsgString) {
    statusMsg.innerText = statusMsgString;
    inviteURL.innerText = "";
    invitePhrase.hidden = true;
    inviteDiv.hidden = false;
}