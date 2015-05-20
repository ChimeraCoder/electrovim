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
/// <reference path="./messaging.ts" />
var OverlayId = "vim-hotkeys-overlay";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var ModeFind = "FIND";
var currentMode = ModeNormal;
var findBuffer = "";
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
    if (currentMode !== ModeFind) {
        elem.innerHTML = currentMode;
    }
    else {
        elem.innerHTML = currentMode + ": " + findBuffer;
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
content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);
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
            content.console.log("findBuffer", findBuffer);
            updateOverlay();
            log(findBuffer);
            content.console.log("asdf");
            content.console.log("foo is", content.document.querySelector("body"));
            var body = content.document.querySelector("body");
            content.console.log("jkl;");
            content.console.log("body is ", body);
            content.console.log("$ is ", $);
            highlight(body, findBuffer, "highlight-cls");
            return;
        }
        // check if in insert/ignore mode
        if (currentMode !== ModeNormal) {
            return;
        }
        // forward slash enters find mode
        if (keyCode === KeyCodeForwardSlash) {
            setMode(ModeFind);
            findBuffer = "";
            e.preventDefault();
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
                sendAsyncMessage(message.name, message);
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
var log = function () {
    var objs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objs[_i - 0] = arguments[_i];
    }
    var message = new (Array.bind.apply(LogMessage, [null].concat(objs)));
    sendAsyncMessage(message.name, message);
};
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
var highlight = function (node, str, className) {
    var regex = new RegExp(str, "gi");
    node.innerHTML = node.innerHTML.replace(regex, function (matched) {
        return "<span class=\"" + className + "\">" + matched + "</span>";
    });
};
