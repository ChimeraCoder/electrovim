/// <reference path="../data/messaging.ts" />

declare var require;

const buttons = require('sdk/ui/button/action');
const tabs = require("sdk/tabs");
const { Hotkey} = require("sdk/hotkeys");
const pageMod = require("sdk/page-mod");
const slf = require("sdk/self");
const data = require("sdk/self").data;

const ui = require("sdk/ui");


const tabWorkers = new WeakMap();

const tabLeft = Hotkey({
    combo: "control-p",
    onPress: function() {
        var activeTab = tabs.activeTab;
        var nextTab = tabs[(activeTab.index - 1) % tabs.length];
        nextTab.activate();
    }
});

const tabRight = Hotkey({
    combo: "control-n",
    onPress: function() {
        var activeTab = tabs.activeTab;
        var nextTab = tabs[(activeTab.index + 1) % tabs.length];
        nextTab.activate();
    }
});

const pagedown = Hotkey({
    combo: "control-f",
    onPress: function() {
        const activeTab = tabs.activeTab;
        if(!tabWorkers.has(activeTab)){
            console.log("tab has no worker!", activeTab);
        }
        const worker : any = tabWorkers.get(activeTab);
        worker.port.emit("pagedown", {});
    }
});

const pageup = Hotkey({
    combo: "control-b",
    onPress: function() {
        const activeTab = tabs.activeTab;
        if(!tabWorkers.has(activeTab)){
            console.log("tab has no worker!", activeTab);
        }
        const worker : any = tabWorkers.get(activeTab);
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


function closeTab(tab, message){
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
    onAttach: function(worker){
        if(!worker.tab){
            console.log("worker has no tab!", worker);
        }
        tabWorkers.set(worker.tab, worker);
        worker.port.on("keypress", (message : Message) => {
            var tab = tabs.activeTab;
            closeTab(tab, message);
        });

        worker.port.on("log", (message : LogMessage) => {
            console.log(message.json);
        });
    }
});
