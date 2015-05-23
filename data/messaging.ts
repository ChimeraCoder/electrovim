declare var content;

const KeyCodeEsc = 27;
const KeyCodeD = 68;
const KeyCodeI = 73;
const KeyCodeN = 78;
const KeyCodeForwardSlash = 191;
const KeyCodeEnter = 13;


interface Message {
    name : string;
    sync : boolean;
    json : Object;
    objects? : Object[];
}

interface Listener {
    receiveMessage : (message : Message) => void
}

class KeypressListener {
    receiveMessageFunc : (message : Message) => void
    constructor(receiveMessage : (message : Message) => void){
    }

    receiveMessage(message : Message) : void {
        content.console.log("received message", message);
        this.receiveMessageFunc(message);
    }
}

class KeypressMessage {
    name : string;
    sync : boolean;
    json : Object;
    objects : Object[];

    keyCode : number;

    constructor(keycode : number, json){
        this.name = "keypress";
        this.json = json;
    }
}


class LogMessage {
    name : string;
    sync : boolean;
    json : Object;

    constructor(...objs: any[]){
        this.name = "log";
        this.json = objs;
    }
}
