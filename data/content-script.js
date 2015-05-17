var OverlayId = "vim-hotkeys-overlay";
var ModeInsert = "INSERT";
var ModeNormal = "NORMAL";
var ModeIgnore = "IGNORE";
var currentMode = ModeNormal;
function createOverlay() {
    // create a new div element 
    // and give it some content 
    var newDiv = document.createElement("div");
    var newContent = document.createTextNode(currentMode);
    newDiv.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.id = OverlayId;
    // add the newly created element and its content into the DOM 
    document.body.appendChild(newDiv);
}
createOverlay();
function updateOverlay() {
    var elem = document.getElementById(OverlayId);
    elem.innerHTML = currentMode;
}
function setMode(mode) {
    currentMode = mode;
    updateOverlay();
}
document.addEventListener("keydown", keyDownTextField, false);
document.addEventListener("mouseup", handleClick, false);
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if (keyCode == 27) {
        // escape
        console.log("pressed escape");
        document.activeElement["blur"]();
        setMode(ModeNormal);
    }
    else {
        // check if in insert/ignore mode
        if (currentMode === ModeInsert) {
            return;
        }
        if (!(document.activeElement === document.body)) {
            if (currentMode != ModeInsert) {
                setMode(ModeInsert);
            }
        }
    }
    console.log(document.activeElement);
    console.log(document.body);
}
function handleClick(e) {
    if (!(document.activeElement === document.body)) {
        if (currentMode != ModeInsert) {
            setMode(ModeInsert);
        }
    }
}
