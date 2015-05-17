const buttons = require('sdk/ui/button/action');
const tabs = require("sdk/tabs");
const { Hotkey } = require("sdk/hotkeys");
const pageMod = require("sdk/page-mod");
const slf = require("sdk/self");
const data = require("sdk/self").data;
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
    onPress: () => {
        var tab = tabs.activeTab;
        var xulTab = require("sdk/view/core").viewFor(tab);
        var xulBrowser = require("sdk/tabs/utils").getBrowserForTab(xulTab);
        var browserMM = xulBrowser.messageManager;
        console.log("sending message");
        browserMM.sendAsyncMessage("keypress", { "foo": "bar" });
    }
});
function handleClick(state) {
    tabs.open("http://www.mozilla.org/");
}
require("sdk/tabs").on("ready", function (tab) {
    var tab = tabs.activeTab;
    var xulTab = require("sdk/view/core").viewFor(tab);
    var xulBrowser = require("sdk/tabs/utils").getBrowserForTab(xulTab);
    var browserMM = xulBrowser.messageManager;
    console.log("loading", slf.data.url("frame-script.js"));
    browserMM.loadFrameScript(slf.data.url("frame-script.js"), false);
});
function onOpen(tab) {
    console.log(tab.url + " is open");
    tab.on("pageshow", logShow);
    tab.on("activate", logActivate);
    tab.on("deactivate", logDeactivate);
    tab.on("close", logClose);
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
    contentStyleFile: "./style.css"
});
