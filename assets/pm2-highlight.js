// Highlight pm2 command tokens inside <code> elements.
// Walks text nodes only, so existing syntax highlighting spans are preserved.
(function () {
  var RE = /(^|[^\w.-])(pm2(?:-runtime|-dev|-docker)?)(?![\w.-])/g;

  document.querySelectorAll("code").forEach(function (code) {
    // Flex-styled code chips (homepage) collapse whitespace between the
    // text nodes this script creates — skip them; they are accent-colored
    // as a whole already.
    if (getComputedStyle(code).display.indexOf("flex") !== -1) return;

    var walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      if (text.indexOf("pm2") === -1) return;

      var frag = document.createDocumentFragment();
      var last = 0;
      var m;
      RE.lastIndex = 0;
      while ((m = RE.exec(text))) {
        var start = m.index + m[1].length;
        if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        var span = document.createElement("span");
        span.className = "pm2-token";
        span.textContent = m[2];
        frag.appendChild(span);
        last = start + m[2].length;
      }
      if (last === 0) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  });
})();
