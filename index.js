var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var Hotkey = (require("sdk/hotkeys")).Hotkey;
var pageMod = require("sdk/page-mod");
var data = require("sdk/self").data;
var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "Visit Mozilla",
    icon: {
        "16": "./icon-16.png",
        "32": "./icon-32.png",
        "64": "./icon-64.png"
    },
    onClick: handleClick
});
var showHotKey = Hotkey({
    combo: "accel-shift-o",
    onPress: function () {
        console.log('active: ' + tabs.activeTab.url);
    }
});
var hideHotKey = Hotkey({
    combo: "accel-alt-shift-o",
    onPress: function () {
    }
});
function handleClick(state) {
    tabs.open("http://www.mozilla.org/");
}
require("sdk/tabs").on("ready", function (tab) {
    tab.attach({
        contentScript: "console.log(document.body.innerHTML);"
    });
});
function onOpen(tab) {
    console.log(tab.url + " is open");
    tab.on("pageshow", logShow);
    tab.on("activate", logActivate);
    tab.on("deactivate", logDeactivate);
    tab.on("close", logClose);
}
function logShow(tab) {
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
    contentScriptFile: [data.url("content-script.js"), data.url("jquery.min.js")],
    contentScriptWhen: "ready",
    contentStyleFile: "./style.css"
});
