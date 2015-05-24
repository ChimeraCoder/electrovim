/*

   highlight v5

   Highlights arbitrary terms.

   <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>

   MIT license.

   Johann Burkard
   <http://johannburkard.de>
   <mailto:jb@eaio.com>

 */

const HighlightClass = "electrovim-highlight"
const HighlightClassSelector = "." + HighlightClass;

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

jQuery.fn.highlight = function(pattern : string, max? : number) {
    var highlighted = 0;
    function innerHighlight(node, pattern) : number {
        if(max >= 0 && highlighted >= max){
            return 0;
        }
        let skip = 0;
        if (node.nodeType == TEXT_NODE) {
            let pos = node.data.toUpperCase().indexOf(pattern);
            pos -= (node.data.substr(0, pos).toUpperCase().length - node.data.substr(0, pos).length);
            if (pos >= 0) {
                let spannode = document.createElement('span');
                spannode.className = HighlightClass;
                let middlebit = node.splitText(pos);
                let endbit = middlebit.splitText(pattern.length);
                let middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                skip = 1;
            }
        }
        else if (node.nodeType == ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i], pattern);
            }
        }
        highlighted += skip;
        return skip;
    }
    return this.length && pattern && pattern.length ? this.each(function() {
        if(max >= 0 && highlighted >= max){
            return;
        }
        innerHighlight(this, pattern.toUpperCase());
    }) : this;
};

jQuery.fn.removeHighlight = function() {
    return this.find("span." + HighlightClass).each(function() {
        this.parentNode.firstChild.nodeName;
        const parent = this.parentNode;
        const txtContent = this.textContent;
        $(this).replaceWith(txtContent);
        $(parent).get()[0].normalize();
    }).end();
};

