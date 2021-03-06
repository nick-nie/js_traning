

window.UiFeats = (function(){
var exports = {};





exports.currentLine = function currentLine(e) {
    if (!e) return 0;
    for (var t = e.children; t && t.length;) e = t[0], t = e.children;
    return e.tokens[0].line - 3
}


exports.clearHighlight = function clearHighlight() {
    for (var e = -1; ++e < tokens.length;) tokens[e].highlight = !1
}

exports.highlightTokens = function highlightTokens(e, t) {
    if (e && e.children && e.children.length) {
        t += e.tokens.length;
        e.children.forEach(function(e) {
            highlightTokens(e, t)
        });
    } else {
        e.tokens.forEach(function(e) {
            e.highlight = !0
        });
        for (var n = e.tokens[0].index, r = Math.max(0, n - t); n >= r; r++) {
            wtCoreInstance.wordNodes[r].highlight = !0;
            selectedLines.push(wtCoreInstance.wordNodes[r].line);
        }
    }
}


d3.select("#form").on("submit", function() {
    d3.event.preventDefault();
    exports.url({prefix: keyword.property("value")});
    WtInit.change();
});

d3.select("#form-source").on("submit", function() {
    d3.event.preventDefault();
    exports.url({source: source.property("value"),prefix: ""}, !0);
    WtInit.change()
});




exports.vis = d3.select("#vis")
exports.svg = exports.vis.append("svg")
exports.clip = exports.svg.append("defs").append("clipPath").attr("id", "clip").append("rect")
exports.treeG = exports.svg.append("g").attr("transform", "translate(0,20)").attr("clip-path", "url(#clip)"),//WTF. needs UiFeats.url or url...


exports.textViewer = d3.longscroll().render(textViewerRender);
function textViewerRender(e) {
    var t = e.selectAll("a").data(function (e) {
        return TextProcessing.getLines()[e] || []
    });
    t.enter().append("a").attr("href", function (e) {
        return "#" + encodeURIComponent(e.token)
    }).on("click", function (e) {
        d3.event.preventDefault(), UiFeats.url({
            prefix: e.token
        }), WtInit.change()
    }).text(function (e) {
        return e.whitespace && this.parentNode.insertBefore(document.createTextNode(" "), this), e.token
    }), t.classed("highlight", function (e) {return e.highlight});
};
//START useless stuff
d3.select(window)
    .on("keydown.hover", hoverKey)
    .on("keyup.hover", hoverKey)
    .on("resize", resize)
    .on("popstate", WtInit.change);
    WtInit.change();
    resize();
function hoverKey() {
    svg.classed("hover", d3.event.shiftKey)
}
function resize() {
    width = exports.vis.node().clientWidth,
    height = window.innerHeight - 50 - 0, 
    exports.svg.attr("width", width).attr("height", height),
    exports.clip.attr("width", width - 30.5).attr("height", height), 
    exports.treeG.call(WtInit.trees[0].width(width - 30).height(height - 20));
    text.call(exports.textViewer)
}
//END useless stuff



    
// one phrase per line checkbox
d3.select("#phrase-line").property("checked", +state["phrase-line"]).on("change", function() {
    exports.url({"phrase-line": this.checked ? 1 : 0});
    change();
});

//sets the URL to enable reloading presering the state
exports.url = function url(e, t) {
    var n = [],
        r = {};
    for (var i in state) r[i] = state[i];
    for (var i in e) r[i] = e[i];
    for (var i in r) n.push(encodeURIComponent(i) + "=" + encodeURIComponent(r[i]));
    history[t ? "pushState" : "replaceState"](null, null, "?" + n.join("&"))
};


exports.refreshText = function refreshText(e) {
    exports.clearHighlight();
    for (var t = e, n = 0; t;) {
        n += t.tokens.length;
        t = t.parent;
        selectedLines = [];
        exports.highlightTokens(e, n);
        text.call(UiFeats.textViewer.position(UiFeats.currentLine(e)));
    }
};




return exports;
})();


