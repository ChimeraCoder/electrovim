declare var jQuery;


document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if(keyCode==27) {
        // escape
    } else {
        // check if in insert/ignore mode
    }
}

