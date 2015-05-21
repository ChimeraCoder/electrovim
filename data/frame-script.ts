/// <reference path="./jquery.d.ts" />
/// <reference path="./messaging.ts" />
declare var content;
declare var addMessageListener;
declare var sendSyncMessage;
declare var sendAsyncMessage;

const OverlayId = "vim-hotkeys-overlay";

const ModeInsert = "INSERT";
const ModeNormal = "NORMAL";
const ModeIgnore = "IGNORE";
const ModeFind = "FIND";

var currentMode = ModeNormal;

var findBuffer : string = "";

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
    if(currentMode !== ModeFind){
        elem.innerHTML = currentMode;
    } else {
        elem.innerHTML = currentMode + ": " + findBuffer;
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


content.document.addEventListener("keydown", keyDownTextField, false);
content.document.addEventListener("mouseup", handleClick, false);


function keyDownTextField(e) {
    try{
        var keyCode = e.keyCode;

        if(keyCode === KeyCodeEsc) {
            stealFocus();
            setMode(ModeNormal);
            return;
        } 

        if(currentMode === ModeFind){
            e.preventDefault()
                stealFocus();
            if(!isCharPrintable(keyCode)){
                return;
            }
            findBuffer += String.fromCharCode(keyCode).toLowerCase();
            content.console.log("findBuffer", findBuffer);
            updateOverlay();
            log(findBuffer);
            var body = $("body");
            highlight(body, findBuffer)
        }

        // check if in insert/ignore mode
        if(currentMode !== ModeNormal){
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
    catch (e){
        content.console.log("exception: ", e);
        log(e);
        throw e;

    }
}



var log = function(...objs: any[]){
    var message = new (Array.bind.apply(LogMessage, [null].concat(objs)));
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
    var valid = 
        (keycode > 47 && keycode < 58)   || // number keys
        keycode == 32 || keycode == 13   || // spacebar & return key(s) (if you want to allow carriage returns)
        (keycode > 64 && keycode < 91)   || // letter keys
        (keycode > 95 && keycode < 112)  || // numpad keys
        (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
        (keycode > 218 && keycode < 223);   // [\]' (in order)

    return valid;
}



var highlight = function(node, str) {
    try {
        var containsQuery = '*:contains("' + str + '")';
        $(containsQuery).each(function(){
            if($(this).children().length < 1) {
              var re = new RegExp("(" + str + ")", "g");
              var txt = $(this).text();
              $(this).replaceWith(txt.replace(re, '<span class="highlight">$1</span>'));
            }
        });
    }
    catch (e){
        content.console.log("exception: ", e);
        throw e;
    }
};

var removeHighlights = function(){
    jQuery("span.highlight").each((index, elem) => {
        elem.parentNode.firstChild.nodeName;
        elem.parentNode.replaceChild(elem.firstChild, elem);
        elem.parentNode.normalize();
        return elem;
    }).end();

    return;
    try {
        jQuery(".highlight").each((index, elem) => {
            return $(elem).replaceWith(() => {
                return $($(elem).contents().get(0));
            })
        })
    } 
    catch (e) {
        content.console.log("exception: ", e);
        throw e;
    }

}
