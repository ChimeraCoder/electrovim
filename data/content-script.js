var KeyCodeShift = 16;
var KeyCodeEsc = 27;
var KeyCodeD = 68;
var KeyCodeG = 71;
var KeyCodeI = 73;
var KeyCodeN = 78;
var KeyCodeForwardSlash = 191;
var KeyCodeEnter = 13;
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
        this.json = { "contents": objs };
    }
    return LogMessage;
})();
/*

   highlight v5

   Highlights arbitrary terms.

   <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

   MIT license.

   Johann Burkard
   <http://johannburkard.de>
   <mailto:jb@eaio.com>

 */
var HighlightClass = "electrovim-highlight";
var HighlightClassSelector = "." + HighlightClass;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
jQuery.fn.highlight = function (pattern, max) {
    var highlighted = 0;
    function innerHighlight(node, pattern) {
        if (max >= 0 && highlighted >= max) {
            return 0;
        }
        var skip = 0;
        if (node.nodeType == TEXT_NODE) {
            var pos = node.data.toUpperCase().indexOf(pattern);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                var spannode = document.createElement('span');
                spannode.className = HighlightClass;
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pattern.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pattern);
            }
        }
        highlighted += skip;
        return skip;
    }
    return this.length && pattern && pattern.length ? this.each(function () {
        if (max >= 0 && highlighted >= max) {
            return;
        }
        innerHighlight(this, pattern.toUpperCase());
    }) : this;
};
jQuery.fn.removeHighlight = function () {
    return this.find("span." + HighlightClass).each(function () {
        this.parentNode.firstChild.nodeName;
        var parent = this.parentNode;
        var txtContent = this.textContent;
        $(this).replaceWith(txtContent);
        $(parent).get()[0].normalize();
    }).end();
};
/* MIT license
 * https://github.com/timoxley/keycode/blob/master/index.js
 */
var KeyCodeByName = {
    'backspace': 8,
    'tab': 9,
    'enter': 13,
    'shift': 16,
    'ctrl': 17,
    'alt': 18,
    'pause/break': 19,
    'caps lock': 20,
    'esc': 27,
    'space': 32,
    'page up': 33,
    'page down': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'insert': 45,
    'delete': 46,
    'command': 91,
    'right click': 93,
    'numpad *': 106,
    'numpad +': 107,
    'numpad -': 109,
    'numpad .': 110,
    'numpad /': 111,
    'num lock': 144,
    'scroll lock': 145,
    'my computer': 182,
    'my calculator': 183,
    ';': 186,
    '=': 187,
    ',': 188,
    '-': 189,
    '.': 190,
    '/': 191,
    '`': 192,
    '[': 219,
    '\\': 220,
    ']': 221,
    "'": 222,
    "a": 65,
    "b": 66,
    "c": 67,
    "d": 68,
    "e": 69,
    "f": 70,
    "g": 71,
    "h": 72,
    "i": 73,
    "j": 74,
    "k": 75,
    "l": 76,
    "m": 77,
    "n": 78,
    "o": 79,
    "p": 80,
    "q": 81,
    "r": 82,
    "s": 83,
    "t": 84,
    "u": 85,
    "v": 86,
    "w": 87,
    "x": 88,
    "y": 89,
    "z": 90
};
var KeyNameByCode = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause/break',
    20: 'caps lock',
    27: 'esc',
    32: 'space',
    33: 'page up',
    34: 'page down',
    35: 'end',
    36: 'home',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    45: 'insert',
    46: 'delete',
    65: "a",
    66: "b",
    67: "c",
    68: "d",
    69: "e",
    70: "f",
    71: "g",
    72: "h",
    73: "i",
    74: "j",
    75: "k",
    76: "l",
    77: "m",
    78: "n",
    79: "o",
    80: "p",
    81: "q",
    82: "r",
    83: "s",
    84: "t",
    85: "u",
    86: "v",
    87: "w",
    88: "x",
    89: "y",
    90: "z",
    91: 'command',
    93: 'right click',
    106: 'numpad *',
    107: 'numpad +',
    109: 'numpad -',
    110: 'numpad .',
    111: 'numpad /',
    144: 'num lock',
    145: 'scroll lock',
    182: 'my computer',
    183: 'my calculator',
    186: ';',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: '/',
    192: '`',
    219: '[',
    220: '\\',
    221: ']',
    222: "'",
};
function isAlphaNumeric(keyCode) {
    return (keyCode >= 65 && keyCode <= 90);
}
/// <reference path="./keycodes.ts" />
var _CommandBuffer = (function () {
    function _CommandBuffer() {
        this.reset();
    }
    _CommandBuffer.prototype.reset = function () {
        this.buffer = [];
    };
    _CommandBuffer.prototype.add = function (e) {
        var keyCode = e.keyCode;
        if (e.keyCode === KeyCodeShift) {
            return false;
        }
        var key = KeyNameByCode[keyCode];
        if (e.shiftKey && isAlphaNumeric(keyCode)) {
            key = key.toUpperCase();
        }
        this.buffer.push(key);
        return this.canExecute();
    };
    _CommandBuffer.prototype.canExecute = function () {
        return (this.parseBuffer() !== null);
    };
    _CommandBuffer.prototype.parseBuffer = function () {
        // TODO replace this with a proper parser
        var command = this.buffer.join("");
        switch (command) {
            case "d":
                return sendTabCloseEvent;
            case "G":
                return scrollToBottom;
            case "gg":
                return scrollToTop;
            case "H":
                return historyBack;
            case "L":
                return historyForward;
        }
    };
    return _CommandBuffer;
})();
function sendTabCloseEvent() {
    var message = new KeypressMessage(KeyCodeD, {});
    self["port"].emit(message.name, message);
}
function scrollToBottom() {
    $(window).scrollTop($(document).height());
}
function scrollToTop() {
    $(window).scrollTop(0);
}
function historyBack() {
    content.window.history.back();
}
function historyForward() {
    content.window.history.forward();
}
/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
/// <reference path="./highlights.ts" />
/// <reference path="./commandBuffer.ts" />
var OverlayId = "electrovim-overlay";
var OverlayModeId = "electrovim-overlay-mode";
var SearchInputId = "electrovim-find";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var ModeFind = "FIND";
var CurrentFindClass = "electrovim-current-find";
var CommandBuffer = new _CommandBuffer();
var currentMode = ModeNormal;
var findBuffer = "";
var findResults = false; // denotes whether we are in the middle of searching through results
var findSelected = -1;
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
    var newSpan = content.document.createElement("span");
    var newContent = content.document.createTextNode(currentMode);
    newSpan.id = OverlayModeId;
    newSpan.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.appendChild(newSpan);
    newDiv.id = OverlayId;
    // add the newly created element and its content into the DOM 
    content.document.body.appendChild(newDiv);
}
function updateOverlay() {
    var elem = content.document.getElementById(OverlayModeId);
    if (elem === null) {
        content.console.log("error updating overlay - no element found");
        return;
    }
    elem.textContent = currentMode;
}
// create the search input field
// or reset it if already present
function createSearchField() {
    removeSearchField();
    var inputNode = content.document.createElement("input");
    var overlay = content.document.getElementById(OverlayId);
    inputNode.setAttribute("type", "search");
    inputNode.id = SearchInputId;
    inputNode.onsubmit = submitSearch;
    overlay.appendChild(inputNode);
    // add the newly created element and its content into the DOM 
}
function removeSearchField() {
    var e = document.getElementById(SearchInputId);
    if (e) {
        e.parentNode.removeChild(e);
    }
}
function focusSearchField() {
    document.getElementById(SearchInputId).focus();
}
function setMode(mode) {
    currentMode = mode;
    if (mode !== ModeFind) {
        var overlay = document.getElementById(OverlayId);
        var inputNode = document.getElementById(SearchInputId);
        if (inputNode !== null) {
            overlay.removeChild(inputNode);
        }
    }
    updateOverlay();
}
function submitSearch(e) {
    e.preventDefault();
    var searchField = document.getElementById(SearchInputId);
    findBuffer = searchField.value;
    findResults = true;
    searchField.disabled = true;
    stealFocus();
    findSelected = -1;
    highlightAndCenter();
}
function highlightAndCenter() {
    clearHighlights();
    $("body")["highlight"](findBuffer, -1);
    var elements = $(HighlightClassSelector);
    findSelected++;
    $("." + CurrentFindClass).removeClass(CurrentFindClass);
    var selected = elements[findSelected % elements.length];
    scrollToElement(selected);
    $(selected).addClass(CurrentFindClass);
    return;
}
// remove focus from the active element
function stealFocus() {
    content.document.activeElement["blur"]();
}
function clearHighlights() {
    $("body")["removeHighlight"]();
}
function keyDownTextField(e) {
    try {
        var keyCode = e.keyCode;
        if (keyCode === KeyCodeShift) {
            return;
        }
        // From any mode, Escape always resets everything
        // and drops the user back in normal mode
        if (keyCode === KeyCodeEsc) {
            CommandBuffer.reset();
            findBuffer = "";
            findResults = false;
            findSelected = -1;
            clearHighlights();
            stealFocus();
            setMode(ModeNormal);
            return;
        }
        if (currentMode === ModeFind) {
            if (findResults) {
                if (keyCode === KeyCodeN) {
                    var elements = $(HighlightClassSelector);
                    findSelected++;
                    $("." + CurrentFindClass).removeClass(CurrentFindClass);
                    var selected = elements[findSelected % elements.length];
                    scrollToElement(selected);
                    $(selected).addClass(CurrentFindClass);
                    return;
                }
            }
            focusSearchField();
            if (keyCode === KeyCodeEnter) {
                submitSearch(e);
                return;
            }
            if (!isCharPrintable(keyCode)) {
                return;
            }
            findBuffer += String.fromCharCode(keyCode).toLowerCase();
            updateOverlay();
            log(findBuffer);
            var body = $("body");
            clearHighlights();
            $("body")["highlight"](findBuffer, 1);
            var highlighted = $(HighlightClassSelector);
            if (highlighted[0]) {
                scrollToElement(highlighted[0]);
            }
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
            createSearchField();
            focusSearchField();
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
        // add the key to command buffer and check if we can execute
        // a command
        var canExecute = CommandBuffer.add(e);
        if (canExecute) {
            var action = CommandBuffer.parseBuffer();
            action();
            CommandBuffer.reset();
        }
        return;
        switch (keyCode) {
            case KeyCodeD:
                var message = new KeypressMessage(KeyCodeD, {});
                self["port"].emit(message.name, message);
                break;
            case KeyCodeG:
                if (e.shiftKey) {
                    // capital G
                    // scroll to bottom
                    $(window).scrollTop($(document).height());
                }
        }
    }
    catch (e) {
        content.console.log("exception: ", e);
        log(e);
        throw e;
    }
}
function windowHeight() {
    if (document.compatMode === 'BackCompat') {
        return document.body.clientHeight;
    }
    return $(window).height();
}
function pageup() {
    $(document).scrollTop($(document).scrollTop() - windowHeight());
}
function pagedown() {
    $(document).scrollTop($(document).scrollTop() + windowHeight());
}
function scrollToElement(element) {
    $(document).scrollTop($(element).offset().top);
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
