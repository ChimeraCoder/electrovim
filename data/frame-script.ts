/// <reference path="./messaging.ts" />
declare var content;
declare var addMessageListener;
declare var sendSyncMessage;
declare var sendAsyncMessage;
   
const OverlayId = "vim-hotkeys-overlay";

const ModeInsert = "INSERT";
const ModeNormal = "NORMAL";
const ModeIgnore = "IGNORE";




var currentMode = ModeNormal;

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

function updateOverlay(){
    let elem = content.document.getElementById(OverlayId);
    elem.innerHTML = currentMode;
}

function setMode(mode : string){
    currentMode = mode;
    updateOverlay();
}


content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if(keyCode===27) {
        // escape
        content.document.activeElement["blur"]();
        setMode(ModeNormal);
        return;
    } 
    
    // check if in insert/ignore mode
    if(currentMode === ModeInsert || currentMode === ModeIgnore){
        return;
    }

    // i enters ignore mode
    if(keyCode===KeyCodeI){
        setMode(ModeIgnore);
        return;
    }

    // check if another element has focus
    if(!(content.document.activeElement === content.document.body)){
        if(currentMode != ModeInsert){
            setMode(ModeInsert);
        }
        return;
    }


    switch (keyCode){
        case KeyCodeD:
            var message = new KeypressMessage(KeyCodeD, {});
            sendAsyncMessage(message.name, message);
            break;
        case KeyCodeForwardSlash:
    }
}


function handleClick(e){
    if(!(content.document.activeElement === content.document.body)){
        if(currentMode != ModeInsert){
            setMode(ModeInsert);
        }
    }
}
