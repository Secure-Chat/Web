var chats = new Array();

var connIP = "";
var connPort = "";

var currentRoom = 0;

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var saved = getCookie("SavedChats");
    if (saved != "") { //if not empty
        //what to do if it is already set
        console.log(saved);
    } else {
        //what to do if not yet set (if it's empty)
        console.log("Setting chats cookie (saving chats)...");
        setCookie("SavedChats", JSON.stringify(chats), 365);
        console.log("Done.");
    }
}

function getChatsCookie() {
    var gotten = getCookie("SavedChats");
    if (gotten == "") {
        return new Array();
    } else {
        var gottenChats = JSON.parse(gotten);
        //reset addLine function
        for (var i = 0; i < gottenChats.length; i++) {
            gottenChats[i].addLine = function (nName, msg, time) {
                console.log("Adding line...");
                this.lines.push(new ChatLine(nName, msg, time));
            };
        }
        return gottenChats;
    }
}

function saveChatCookies() {
    var saved = getCookie("SavedChats");
    if (saved != "") {
        console.log("There are already saved chats. Updating now...");
    } else {
        console.log("There are no saved chats. Saving now...")
    }
    setCookie("SavedChats", JSON.stringify(chats), 365);
    console.log("Done.\n");
}

function clearCookies() {
    setCookie("SavedChats", "[]", 365);
    location.reload();
}

function Chat(room, name, pword) {
    looping = true;
    while (looping) {
        name = name.replace(';', '%3B');
        if (name.includes(";")) {
            looping = true;
        } else {
            looping = false;
        }
    }
    console.log("Did the semicolon thing");
    this.NICKNAME = name;
    this.CHATROOM = room;
    this.PASSWORD = pword;
    console.log("Saved the name, password and chatroom var");
    this.lines = new Array();
    console.log("Saved the lines var");
    this.addLine = function (nName, msg, time) {
        console.log("Adding line...");
        this.lines.push(new ChatLine(nName, msg, time));
    };
    console.log("Saved the addLine function");
}

function getChatRoomList() {
    var s = '{ "LIST": [';
    for (var i = 0; i < chats.length; i++) {
        s += '{';
        s += '"CHATROOM": "' + chats[i].CHATROOM + '",';
        s += '"NICKNAME": "' + chats[i].NICKNAME + '"'
        s += '}';

        if (i < chats.length - 1) {s += ','};
    }
    s += ']}';
    return s;
}

function ChatLine(nickname, message, timestamp) {
    this.nickname = nickname;
    this.message = message;
    this.timestamp = timestamp;
}

function newChat(room, name, pword) {
    //check for anything with the same name
    var isNew = true;
    for (var i = 0; i < chats.length; i++ ) {
        if (chats[i].CHATROOM == room) {
            isNew = false;
        }    
    }

    if (isNew) {
        chats.push(new Chat(room, name, pword));
    } else {
        alert("Sorry, chatroom  already exists with the same name!")
    }
    
}

function addAChat() {    
    //create chat            
    var nameIN = $("#nameInput").val();
    var nickNameIN = $("#nickNameInput").val();
    var passwordIN = $("#pwordInput").val();
    console.log("Just got input from boxes");

    newChat(nameIN, nickNameIN, passwordIN);
    console.log("Just saved new chat to array!")

    //update cookie
    saveChatCookies();
    console.log("Chat added");
    refreshSidebar(currentRoom);

    //reload
    location.reload();
}

function addThreeChats() {
    newChat("192.168.0.1", 6789, "Comp sci ;) a  ; friends");
    newChat("325.26.2626.3", 6800, "Mathemachicken ;)");
    newChat("201.2.1003.4", 1234, "53CURE CHAT developers");
}

function refreshSidebar(activeChat) {
    //load all chats in sidebar
    chats = getChatsCookie();
    $("#chatsUL").empty();
    var i;
    for (i = 0; i < chats.length; i++) {
        if (i == activeChat) {
            //Show which chat you are on
            console.log("adding active chat");
            $("#chatsUL").append('<li class="sideLink active"><a>' + chats[i].CHATROOM + '</a></li>');
        } else {
            //or not
            console.log("adding non-active chat");
            $("#chatsUL").append('<li class="sideLink" onclick="switchRoom(' + i + ')"><a>' + chats[i].CHATROOM + '</a></li>');
            
        }
    }
}

function refreshChatWindow(c) {
    $("#messages").empty();
    for (var i = 0; i < c.lines.length; i++) {
        var newMsgRow = '<div class="msg"><div class="name"><p><b>' + c.lines[i].nickname + ': </b></p></div><div class="msg"><p>' + c.lines[i].message + '</p></div><hr><div>';
        $("#messages").append(newMsgRow);
    }

}

function switchRoom(id) {
    currentRoom = id;
    refreshSidebar(id);
    refreshChatWindow(chats[id]);
}

function loadRemoveChats() {
    for (var i = 0; i < chats.length; i++) {
        $("#removeChatsForm").append('<div class="checkbox"><label><input type="checkbox" value=""> ' + chats[i].name + '</label></div>');
    }
}

function getChatByIP(ip, port) {
    for (var i = 0; i < chats.length; i++) {
        if (chats[i].ip == ip) {
            if (chats[i].port == port) {
                return chats[i];
            }
        }
    }
    return null;
}

function addInitialChat() {
    var ipIN = window.connIP;
    var portIN = window.connPort;
    var nameIN = "Test Chat";
    newChat(ipIN, portIN, nameIN);

    //update cookie
    saveChatCookies();
    console.log("Chat added");
    refreshSidebar(0);
}

function roomConnectMsg(cRoom, cName) {
    var o = {type: "connect", room: cRoom, name: cName};
    return JSON.stringify(o);
}

function serverSendMsg(cRoom, cTime, cName, cMsg) {
    var o = {
        type: "message",
        room: cRoom,
        timestamp: cTime.toString(),
        name: cName,
        msg: cMsg
    };
    return JSON.stringify(o);
}

function findChatIDByName(roomName) {
    for (var i = 0; i < chats.length; i++) {
        if (chats[i].CHATROOM == roomName) {
            return i;
        }
    }
    //if not found
    return -1;
}

chats = getChatsCookie();
saveChatCookies();

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    refreshSidebar(0);
    $("#editChatsBtn").click(function () {
        loadRemoveChats();
    });

    window.connIP = "chat.etcg.pw";

    //Set listeners for clicking different chats
    $(".sideLink").each(function (index) {
        $(this).click(function () {
            console.log("cliked");
            switchRoom(index);
        });
    });

    // Get references to elements on the page.
    var form = document.getElementById('message-form');
    var messageField = document.getElementById('msgBox');
    var messagesList = document.getElementById('messages');
    var socketStatus = document.getElementById('status');
    var closeBtn = document.getElementById('close');

    //create a new websocket
    window.connPort = "6789";

    var socket = new WebSocket('ws://' + window.connIP + ':' + window.connPort + '/');

    // Show a connected message when the WebSocket is opened.
    socket.onopen = function (event) {
        socketStatus.innerHTML = 'Connected to ' + event.currentTarget.url;
        socketStatus.className = 'open';

        //send connection message for each chatroom
        for (var i = 0; i < chats.length; i++) {
            socket.send(roomConnectMsg(chats[i].CHATROOM, chats[i].NICKNAME));
            console.log("SENT: " + roomConnectMsg(chats[i].CHATROOM, chats[i].NICKNAME));
        }

        //request messages
        for (var i = 0; i < chats.length; i++) {
            socket.send('{ "type":"request", "room":"' + chats[i].NICKNAME + '", "min":"START_TIME", "max":"END_TIME" }')
        }
    };

    // Handle any errors that occur.
    socket.onerror = function (error) {
        console.log('WebSocket Error: ' + error);
    };

    // Send a message when the form is submitted.
    form.onsubmit = function (e) {
        e.preventDefault();

        // Retrieve the message from the textarea.
        var message = $("#msgbox").val();
        $("msgbox").val("");

        window.userName = $("#nameInput").val();

        var messageObj = JSON.stringify(new ChatLine(window.userName, message));

        // Send the message through the WebSocket.
        var room = chats[currentRoom].CHATROOM;
        var pass = chats[currentRoom].PASSWORD;
        var d = new Date().getTime();
        socket.send(serverSendMsg(room, d, chats[currentRoom].NICKNAME, sjcl.encrypt(pass, message)));

        console.log("SENT: " + serverSendMsg(room, d, chats[currentRoom].NICKNAME, sjcl.encrypt(pass, message)));

        // Clear out the message field.
        $("#msgbox").val("");

        return false;
    };

    // Handle messages sent by the server.
    socket.onmessage = function (event) {
        var messageTXT = event.data;
        console.log("RECEIVED: " + messageTXT);
        var msgObj = JSON.parse(messageTXT);

        //log the id of the chat we're editing
        if (msgObj.type == "message") {
            console.log(msgObj);
            var roomID = findChatIDByName(msgObj.room);
            chats[roomID].addLine(msgObj.name, sjcl.decrypt(chats[roomID].PASSWORD, msgObj.msg), msgObj.timeStamp);
        } else if (msgObj.type == "server-message") {
            var roomID = findChatIDByName(msgObj.room);
            alert("Server message for room " + msgObj.room + ":\n\n" + msgObj.msg);
        }

        refreshChatWindow(chats[findChatIDByName(msgObj.room)]);

        var objDiv = document.getElementById("messages");
        objDiv.scrollTop = objDiv.scrollHeight;

        //refresh the cookie
        saveChatCookies();
    };

    // Show a disconnected message when the WebSocket is closed.
    socket.onclose = function (event) {
        socketStatus.innerHTML = 'Disconnected from chat server.';
        socketStatus.className = 'closed';
    };

    // Close the WebSocket connection when the close button is clicked.
    function closeConnection(e) {
        console.log("close btn clicked");
        e.preventDefault();

        // Close the WebSocket.
        socket.close();

        return false;
    }

    //Set sidebar height
    if ($("#main-content").position().top <= 0) {
        $(".sidenav").height(window.innerHeight);
    } else {
        $(".sidenav").height("auto");
    }

    $(window).resize(function () {
        if ($("#main-content").position().top <= 0) {
            $(".sidenav").height(window.outerHeight);
        } else {
            $(".sidenav").height("auto");
        }
    });


});

/*

NEXT TODO:
    - Upload to local IIS Webserver
    - Test with new server (so correct nicknames are displayed with messages)
    - Minor aesthetic changes - fix scrolling box, make it look gud
    - We done! Get it hosted on Greg's RaspberryPi and show Mr. Harris

Example cookie:

[
{"ip":"1234","port":"6789","name":"Hello","lines":[{"nickname":"Lucas","message":"Hello!"},{"nickname":"Greg","message":"Hey Lucas"},{"nickname":"Lucas","message":"Imma switch chats now one sec..."}]},
{"ip":"12345","port":"4121","name":"Chat 3","lines":[{"nickname":"Lucas","message":"There we go"},{"nickname":"Gerg","message":"Dang spelled my name wrong"},{"nickname":"Lucas","message":"Lol gerg"},{"nickname":"Gerg","message":"gtfo"}]},
{"ip":"1234567173721831738","port":"1234","name":"Chat 4","lines":[]},
{"ip":"121248818","port":"12345","name":"Chat 5","lines":[]}
]

*/
