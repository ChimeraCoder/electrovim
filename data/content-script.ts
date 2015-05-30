/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
/// <reference path="./highlights.ts" />
/// <reference path="./commandBuffer.ts" />
declare var content;
declare var addMessageListener;
declare var sendSyncMessage;
declare var sendAsyncMessage;

const OverlayId = "electrovim-overlay";
const OverlayModeId = "electrovim-overlay-mode";
const SearchInputId = "electrovim-find";

const ModeInsert = "INSERT";
const ModeNormal = "NORMAL";
const ModeIgnore = "IGNORE";
const ModeFind = "FIND";

const CurrentFindClass = "electrovim-current-find";

const CommandBuffer = new _CommandBuffer();

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
        return;
    }


    // create a new div element 
    // and give it some content 
    const newDiv = content.document.createElement("div"); 
    const newSpan = content.document.createElement("span"); 
    const newContent = content.document.createTextNode(currentMode); 
    newSpan.id = OverlayModeId;
    newSpan.appendChild(newContent); //add the text node to the newly created div. 
    newDiv.appendChild(newSpan);
    newDiv.id = OverlayId;

    // add the newly created element and its content into the DOM 
    content.document.body.appendChild(newDiv);
}

function updateOverlay(){
    let elem = content.document.getElementById(OverlayModeId);
    elem.textContent= currentMode;
}


// create the search input field
// or reset it if already present
function createSearchField(){
    removeSearchField();
    const inputNode = content.document.createElement("input"); 
    const overlay = content.document.getElementById(OverlayId);
    inputNode.setAttribute("type", "search");

    inputNode.id = SearchInputId;
    inputNode.onsubmit = submitSearch;
    overlay.appendChild(inputNode);

    // add the newly created element and its content into the DOM 
}

function removeSearchField(){
    let e = document.getElementById(SearchInputId);
    if(e){
        e.parentNode.removeChild(e);
    }
}

function focusSearchField(){
    document.getElementById(SearchInputId).focus();
}

function setMode(mode : string){
    currentMode = mode;
    if(mode !== ModeFind){
        const overlay = document.getElementById(OverlayId);
        const inputNode = document.getElementById(SearchInputId);
        overlay.removeChild(inputNode);
    }
    updateOverlay();
}

function submitSearch(e){
    e.preventDefault();
    const searchField =  (<HTMLInputElement>document.getElementById(SearchInputId));
    findBuffer = searchField.value;
    console.log("submitting search: ", findBuffer);
    findResults = true;
    searchField.disabled = true;
    stealFocus();
    findSelected = -1;
    highlightAndCenter();

}

function highlightAndCenter(){
    clearHighlights();
    $("body")["highlight"](findBuffer, -1);

    const elements = $(HighlightClassSelector);
    findSelected++;
    $("." + CurrentFindClass).removeClass(CurrentFindClass);
    const selected = elements[findSelected % elements.length];
    scrollToElement(selected);
    $(selected).addClass(CurrentFindClass);
    return;
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
        if(keyCode === KeyCodeShift){
            return;
        }

        // From any mode, Escape always resets everything
        // and drops the user back in normal mode
        if(keyCode === KeyCodeEsc) {
            CommandBuffer.reset();


            findBuffer = "";
            findResults = false;
            findSelected = -1;

            clearHighlights();

            stealFocus();
            setMode(ModeNormal);
            return;
        } 

        if(currentMode === ModeFind){
            if(findResults) {
                if(keyCode === KeyCodeN){
                    const elements = $(HighlightClassSelector);
                    findSelected++;
                    $("." + CurrentFindClass).removeClass(CurrentFindClass);
                    const selected = elements[findSelected % elements.length];
                    scrollToElement(selected);
                    $(selected).addClass(CurrentFindClass);
                    return;
                }
            }

            focusSearchField();

            if(keyCode === KeyCodeEnter){
                submitSearch(e);
                return;
            }

            if(!isCharPrintable(keyCode)){
                return;
            }
            findBuffer += String.fromCharCode(keyCode).toLowerCase();
            updateOverlay();
            log(findBuffer);
            const body = $("body");
            

            clearHighlights();
            $("body")["highlight"](findBuffer, 1);
            const highlighted = $(HighlightClassSelector);
            if(highlighted[0]){
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
            e.preventDefault();
            createSearchField();
            focusSearchField();
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


        // add the key to command buffer and check if we can execute
        // a command
        const canExecute = CommandBuffer.add(e);
        if(canExecute){
            const action = CommandBuffer.parseBuffer();
            action();
            CommandBuffer.reset();
        }

        return;

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
