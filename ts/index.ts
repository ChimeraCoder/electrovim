/// <reference path="../data/messaging.ts" />

declare const require;

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
        const activeTab = tabs.activeTab;
        const activeTabIndex = activeTab.index;
        const targetIndex = ((activeTabIndex - 1) + tabs.length)  % tabs.length;
        for(let tab of tabs){
            if(tab.index === targetIndex ){
                tab.activate();
                return;
            }
        }
        console.log("could not find tab with index ", targetIndex);
    }
});

const tabRight = Hotkey({
    combo: "control-n",
    onPress: function() {
        const activeTab = tabs.activeTab;
        const activeTabIndex = activeTab.index;
        const targetIndex = (activeTabIndex + 1) % tabs.length;
        for(let tab of tabs){
            if(tab.index === targetIndex ){
                tab.activate();
                return;
            }
        }
        console.log("could not find tab with index ", targetIndex);
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


function closeTab(tab, message){
    console.log("chrome received message", message);
    console.log("closing tab", tab);
    tab.close();
}


pageMod.PageMod({
    include: ["http://*", "https://*"],
    contentStyleFile: "./style.css",
    contentScriptFile: [slf.data.url("jquery-1.11.3.min.js"), slf.data.url("content-script.js")],
    contentScriptWhen: "ready",
    onAttach: function(worker){
        if(!worker.tab){
            console.log("worker has no tab!", worker);
        }
        tabWorkers.set(worker.tab, worker);
        worker.port.on("keypress", (message : Message) => {
            const tab = tabs.activeTab;
            closeTab(tab, message);
        });

        worker.port.on("log", (message : LogMessage) => {
            const tabIndex = worker.tab ? worker.tab.index : -1;
            console.log("(tab", tabIndex, "):", ...message.json.contents);
        });
    }
});
