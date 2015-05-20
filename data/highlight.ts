declare var $;
self.port.on("highlight", function(tag){
    try {
        content.console.log("asdf");
        content.console.log("$", $);

        var body = $("body");
        content.console.log(body);

    }
    catch (e){
        content.console.log("exception: ", e);
        throw e;
    }
});
