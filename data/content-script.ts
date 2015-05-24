/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
/// <reference path="./highlights.ts" />
declare var content;
declare var addMessageListener;
declare var sendSyncMessage;
declare var sendAsyncMessage;

const OverlayId = "electrovim-overlay";

const ModeInsert = "INSERT";
const ModeNormal = "NORMAL";
const ModeIgnore = "IGNORE";
const ModeFind = "FIND";

var currentMode = ModeNormal;

var findBuffer : string = "";
var findResults : boolean = false; // denotes whether we are in the middle of searching through results
var findSelected : number = -1;

function createOverlay() { 
    // set the correct initial mode
    if(content.document.activeElement !== document.body){
        currentMode = ModeInsert;
    }

    // check if an overlay already exists
    if(content.document.getElementById(OverlayId)){
        updateOverlay();
        return
    }


    // create a new div element 
    // and give it some content 
    const newDiv = content.document.createElement("div"); 
    const newContent = content.document.createTextNode(currentMode); 
    newDiv.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.id = OverlayId;

    // add the newly created element and its content into the DOM 
    content.document.body.appendChild(newDiv);
}

function updateOverlay(){
    let elem = content.document.getElementById(OverlayId);
    if(currentMode !== ModeFind){
        elem.textContent= currentMode;
    } else {
        elem.textContent= currentMode + ": " + findBuffer;
    }
}

function setMode(mode : string){
    currentMode = mode;
    updateOverlay();
}

// remove focus from the active element
function stealFocus(){
    content.document.activeElement["blur"]();
}


function clearHighlights(){
    $("body")["removeHighlight"]();
}



function keyDownTextField(e) {
    try{
        const keyCode = e.keyCode;

        if(keyCode === KeyCodeEsc) {
            findBuffer = "";
            findResults = false;
            findSelected = -1;

            clearHighlights();

            stealFocus();
            setMode(ModeNormal);
            return;
        } 

        if(currentMode === ModeFind){
            e.preventDefault();
            stealFocus();

            if(keyCode === KeyCodeEnter){
                findResults = true;
                return;
            }

            if(findResults) {
                if(keyCode === KeyCodeN){
                    const elements = $(HighlightClassSelector);
                    findSelected++;
                    const selected = elements[findSelected % elements.length];
                    scrollToElement(selected);
                    return;
                }
            }


            if(!isCharPrintable(keyCode)){
                return;
            }
            findBuffer += String.fromCharCode(keyCode).toLowerCase();
            updateOverlay();
            log(findBuffer);
            const body = $("body");
            

            clearHighlights();
            $("body")["highlight"](findBuffer);
            const highlighted = $(HighlightClassSelector);
            if(highlighted){
                scrollToElement(highlighted[0]);
            }
        }

        // check if in insert/ignore mode
        if(currentMode !== ModeNormal){
            return;
        }

        // forward slash enters find mode
        if(keyCode === KeyCodeForwardSlash){
            setMode(ModeFind);
            findBuffer = "";
            e.preventDefault()
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
                const message = new KeypressMessage(KeyCodeD, {});
                self["port"].emit(message.name, message)
                break;
            case KeyCodeG:
                if(e.shiftKey){
                    // capital G
                    // scroll to bottom
                    $(window).scrollTop($(document).height());
                }
        }
    }
    catch (e){
        content.console.log("exception: ", e);
        log(e);
        throw e;

    }
}



function windowHeight() : number {
    if (document.compatMode === 'BackCompat') {
        return document.body.clientHeight;
    }
    return $(window).height();
}


function pageup(){
    $(document).scrollTop($(document).scrollTop()-windowHeight());
}

function pagedown(){
    $(document).scrollTop($(document).scrollTop()+windowHeight());
}

function scrollToElement(element : HTMLElement){
    $(document).scrollTop($(element).offset().top)
}

// log to extension console
function log(...objs: any[]){
    const message = new (Array.bind.apply(LogMessage, [null].concat(objs)));
    self["port"].emit(message.name, message);
}


function handleClick(e){
    if(!(content.document.activeElement === content.document.body)){
        if(currentMode != ModeInsert){
            setMode(ModeInsert);
        }
    }
}



function isCharPrintable(keycode : number) : boolean {
    const valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}

createOverlay();
content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);

self["port"].on("pagedown", pagedown);
self["port"].on("pageup", pageup);
