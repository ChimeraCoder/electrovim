function highlight(node, str) {
    try {
        const containsQuery = '*:contains("' + str + '")';
        $(containsQuery).each(function(){
            if($(this).children().length < 1) {
              const re = new RegExp("(" + str + ")", "g");
              const txt = $(this).text();
              $(this).replaceWith(txt.replace(re, '<span class="highlight">$1</span>'));
            }
        });
    }
    catch (e){
        content.console.log("exception: ", e);
        throw e;
    }
};

const removeHighlights = function(){
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
