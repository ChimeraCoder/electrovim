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
/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
/// <reference path="./highlights.ts" />
var OverlayId = "electrovim-overlay";
var OverlayModeId = "electrovim-overlay-mode";
var SearchInputId = "electrovim-find";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var ModeFind = "FIND";
var CurrentFindClass = "electrovim-current-find";
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
        overlay.removeChild(inputNode);
    }
    updateOverlay();
}
function submitSearch(e) {
    e.preventDefault();
    var searchField = document.getElementById(SearchInputId);
    findBuffer = searchField.value;
    console.log("submitting search: ", findBuffer);
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
        if (keyCode === KeyCodeEsc) {
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
