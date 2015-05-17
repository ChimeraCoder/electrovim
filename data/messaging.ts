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
    constructor(){
    }

    receiveMessage(message : Message) : void {
        content.console.log("received message", message);
    }
}
