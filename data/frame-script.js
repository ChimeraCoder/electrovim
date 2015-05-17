var KeypressListener = (function () {
    function KeypressListener() {
    }
    KeypressListener.prototype.receiveMessage = function (message) {
        content.console.log("received message", message);
    };
    return KeypressListener;
})();
/// <reference path="./messaging.ts" />
var OverlayId = "vim-hotkeys-overlay";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var currentMode = ModeNormal;
function createOverlay() {
    // create a new div element 
    // and give it some content 
    var newDiv = content.document.createElement("div");
    var newContent = content.document.createTextNode(currentMode);
    newDiv.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.id = OverlayId;
    // add the newly created element and its content into the DOM 
    content.document.body.appendChild(newDiv);
}
createOverlay();
function updateOverlay() {
    var elem = content.document.getElementById(OverlayId);
    elem.innerHTML = currentMode;
}
function setMode(mode) {
    currentMode = mode;
    updateOverlay();
}
addMessageListener("keypress", new KeypressListener());
content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 27) {
        // escape
        content.document.activeElement["blur"]();
        setMode(ModeNormal);
    }
    else {
        // check if in insert/ignore mode
        if (currentMode === ModeInsert) {
            return;
        }
        // check if another element has focus
        if (!(content.document.activeElement === content.document.body)) {
            if (currentMode != ModeInsert) {
                setMode(ModeInsert);
            }
            return;
        }
    }
    content.console.log(content.document.activeElement);
    content.console.log(content.document.body);
}
function handleClick(e) {
    if (!(content.document.activeElement === content.document.body)) {
        if (currentMode != ModeInsert) {
            setMode(ModeInsert);
        }
    }
}
