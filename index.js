var buttons = require('sdk/ui/button/action');
var tabs = require("sdk/tabs");
var Hotkey = (require("sdk/hotkeys")).Hotkey;
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
        console.log("triggered 1");
    }
});
var hideHotKey = Hotkey({
    combo: "accel-alt-shift-o",
    onPress: function () {
        console.log("triggered 2");
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
