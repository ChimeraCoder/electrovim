/// <reference path="./keycodes.ts" />
class _CommandBuffer {
    buffer : string[];

    constructor(){
        this.reset();
    }

    reset() : void {
        this.buffer = [];
    }

    add(e : KeyboardEvent) : boolean{
        const keyCode = e.keyCode
        if(e.keyCode === KeyCodeShift){
            return false;
        }

        let key : string = KeyNameByCode[keyCode]
        if(e.shiftKey && isAlphaNumeric(keyCode)){
            key = key.toUpperCase();
        }
        this.buffer.push(key);
        return this.canExecute();
    }

    canExecute() : boolean{
        return (this.parseBuffer() !== null);
    }

    parseBuffer() : () => void{
        // TODO replace this with a proper parser
        const command = this.buffer.join("");
        switch (command){
            case "d":
                return sendTabCloseEvent;
            case "G":
                return scrollToBottom;
            case "gg":
                return scrollToTop;
            case "H":
                return historyBack;
            case "L":
                return historyForward;
        }
    }
}


function sendTabCloseEvent(){
    const message = new KeypressMessage(KeyCodeD, {});
    self["port"].emit(message.name, message);
}

function scrollToBottom(){
    $(window).scrollTop($(document).height());
}

function scrollToTop(){
    $(window).scrollTop(0);
}

function historyBack(){
    content.window.history.back();
}

function historyForward(){
    content.window.history.forward();
}
