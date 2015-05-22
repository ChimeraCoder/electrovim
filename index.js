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
/// <reference path="../data/messaging.ts" />
var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var Hotkey = (require("sdk/hotkeys")).Hotkey;
var pageMod = require("sdk/page-mod");
var slf = require("sdk/self");
var data = require("sdk/self").data;
var ui = require("sdk/ui");
var tabWorkers = new WeakMap();
var tabLeft = Hotkey({
    combo: "control-p",
    onPress: function () {
        var activeTab = tabs.activeTab;
        var nextTab = tabs[(activeTab.index - 1) % tabs.length];
        nextTab.activate();
    }
});
var tabLeft = Hotkey({
    combo: "control-n",
    onPress: function () {
        var activeTab = tabs.activeTab;
        var nextTab = tabs[(activeTab.index + 1) % tabs.length];
        nextTab.activate();
    }
});
var pageDownScript = '$(document).scrollTop($(document).scrollTop()+$(window).height());';
tabs.on("ready", function (tab) {
    var worker = tab.attach({
        contentScript: pageDownScript
    });
    console.log("injected into", tab);
});
var pagedown = Hotkey({
    combo: "control-f",
    onPress: function () {
        var activeTab = tabs.activeTab;
        if (!tabWorkers.has(activeTab)) {
            console.log("tab has no worker!", activeTab);
        }
        var worker = tabWorkers.get(activeTab);
        worker.port.emit("pagedown", {});
    }
});
var pageup = Hotkey({
    combo: "control-b",
    onPress: function () {
        var activeTab = tabs.activeTab;
        if (!tabWorkers.has(activeTab)) {
            console.log("tab has no worker!", activeTab);
        }
        var worker = tabWorkers.get(activeTab);
        worker.port.emit("pageup", {});
    }
});
function onOpen(tab) {
    console.log(tab.url + " is open");
    tab.on("pageshow", logShow);
    tab.on("activate", logActivate);
    tab.on("deactivate", logDeactivate);
    tab.on("close", logClose);
}
function closeTab(tab, message) {
    console.log("chrome received message", message);
    console.log("closing tab", tab);
    tab.close();
}
function logShow(tab) {
    // send message to frame script that a new page has been loaded
    console.log(tab.url + " is loaded");
}
function logActivate(tab) {
    console.log(tab.url + " is activated");
}
function logDeactivate(tab) {
    console.log(tab.url + " is deactivated");
}
function logClose(tab) {
    console.log(tab.url + " is closed");
}
tabs.on('open', onOpen);
pageMod.PageMod({
    include: ["http://*", "https://*"],
    contentStyleFile: "./style.css",
    contentScriptFile: [slf.data.url("jquery-1.11.3.min.js"), slf.data.url("jquery-highlight.js"), slf.data.url("frame-script.js")],
    contentScriptWhen: "ready",
    onAttach: function (worker) {
        if (!worker.tab) {
            console.log("worker has no tab!", worker);
        }
        tabWorkers.set(worker.tab, worker);
        worker.port.on("keypress", function (message) {
            var tab = tabs.activeTab;
            closeTab(tab, message);
        });
        worker.port.on("log", function (message) {
            console.log(message.json);
        });
    }
});
