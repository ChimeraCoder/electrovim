var KeyCodeEsc = 27;
var KeyCodeD = 68;
var KeyCodeI = 73;
var KeyCodeForwardSlash = 191;
var KeypressListener = (function () {
    function KeypressListener(receiveMessage) {
    }
    KeypressListener.prototype.receiveMessage = function (message) {
        content.console.log("received message", message);
        this.receiveMessageFunc(message);
    };
    return KeypressListener;
})();
var KeypressMessage = (function () {
    function KeypressMessage(keycode, json) {
        this.name = "keypress";
        this.json = json;
    }
    return KeypressMessage;
})();
var LogMessage = (function () {
    function LogMessage() {
        var objs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objs[_i - 0] = arguments[_i];
        }
        this.name = "log";
        this.json = objs;
    }
    return LogMessage;
})();
/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
var OverlayId = "electrovim-overlay";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var ModeFind = "FIND";
var currentMode = ModeNormal;
var findBuffer = "";
function createOverlay() {
    // set the correct initial mode
    if (content.document.activeElement !== document.body) {
        currentMode = ModeInsert;
    }
    // check if an overlay already exists
    if (content.document.getElementById(OverlayId)) {
        updateOverlay();
        return;
    }
    // create a new div element 
    // and give it some content 
    var newDiv = content.document.createElement("div");
    var newContent = content.document.createTextNode(currentMode);
    newDiv.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.id = OverlayId;
    // add the newly created element and its content into the DOM 
    content.document.body.appendChild(newDiv);
}
function updateOverlay() {
    var elem = content.document.getElementById(OverlayId);
    if (currentMode !== ModeFind) {
        elem.textContent = currentMode;
    }
    else {
        elem.textContent = currentMode + ": " + findBuffer;
    }
}
function setMode(mode) {
    currentMode = mode;
    updateOverlay();
}
// remove focus from the active element
function stealFocus() {
    content.document.activeElement["blur"]();
}
function keyDownTextField(e) {
    try {
        var keyCode = e.keyCode;
        if (keyCode === KeyCodeEsc) {
            stealFocus();
            setMode(ModeNormal);
            return;
        }
        if (currentMode === ModeFind) {
            e.preventDefault();
            stealFocus();
            if (!isCharPrintable(keyCode)) {
                return;
            }
            findBuffer += String.fromCharCode(keyCode).toLowerCase();
            updateOverlay();
            log(findBuffer);
            var body = $("body");
        }
        // check if in insert/ignore mode
        if (currentMode !== ModeNormal) {
            return;
        }
        // i enters ignore mode
        if (keyCode === KeyCodeI) {
            setMode(ModeIgnore);
            return;
        }
        // check if another element has focus
        if (!(content.document.activeElement === content.document.body)) {
            if (currentMode != ModeInsert) {
                setMode(ModeInsert);
            }
            return;
        }
        switch (keyCode) {
            case KeyCodeD:
                var message = new KeypressMessage(KeyCodeD, {});
                self["port"].emit(message.name, message);
                break;
            case KeyCodeForwardSlash:
        }
    }
    catch (e) {
        content.console.log("exception: ", e);
        log(e);
        throw e;
    }
}
function pageup() {
    $(document).scrollTop($(document).scrollTop() - $(window).height());
}
function pagedown() {
    $(document).scrollTop($(document).scrollTop() + $(window).height());
}
// log to extension console
function log() {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i - 0] = arguments[_i];
    }
    var message = new (Array.bind.apply(LogMessage, [null].concat(objs)));
    self["port"].emit(message.name, message);
}
function handleClick(e) {
    if (!(content.document.activeElement === content.document.body)) {
        if (currentMode != ModeInsert) {
            setMode(ModeInsert);
        }
    }
}
function isCharPrintable(keycode) {
    var valid = (keycode > 47 && keycode < 58) ||
        keycode == 32 || keycode == 13 ||
        (keycode > 64 && keycode < 91) ||
        (keycode > 95 && keycode < 112) ||
        (keycode > 185 && keycode < 193) ||
        (keycode > 218 && keycode < 223); // [\]' (in order)
    return valid;
}
createOverlay();
content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);
self["port"].on("pagedown", pagedown);
self["port"].on("pageup", pageup);
