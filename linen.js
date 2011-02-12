// The following line is a function to encapsulate all our helper functions and
// keep us from polluting the namespace.
var linen = (function() {
  function lex(doc) {
    function handle_list(b) {
      function lex_list(list_text) {
        var items = list_text.split("\n");
        var list = [];
        for(var i in items) {
          var parts = /^(\*+|#+)\s+(.*)/.exec(items[i]);
          if(parts) {
            types = { "*": "ul", "#": "ol" };
            list.push({ type: types[parts[1][0]], indent: parts[1].length, content: parts[2] });
          }
        }
        return list;
      }

      var list = lex_list(b);
      // TODO: Handle attrs.  This will likely mean refactoring, or lots of
      // pain. Who wrote this damn grammar, anyway?
      return {
        type: list[0].type,
        extended: false,
        attrs: [],
        content: list
      };
    }

    function lex_table(block) {
      var lines = block.split("\n");
      var ret = [];
      for(var i in lines) {
        var line = lines[i].replace(/^\|/, "").replace(/\|$/, "");
        ret.push(line.split("|"));
      }

      // TODO: handle attrs
      return {
        type: 'table',
        extended: false,
        attrs: [],
        content: ret
      };
    }

    function lex_block(block) {
      var res = [];
      var blockType = "";

      // First, we look for a block descriptor.
      var i = 0, c = block[0];
      if(c == 'f' && block[i+1] == 'n') {
        // TODO: Implement footnotes properly
        blockType = "f" + block[++i];
      }

      // Lists are pretty different, so we'll treat them completely differently here.
      if(c == '*' || c == '#') { return handle_list(block) }

      // Tables are also different, so they get their own function too.
      if(c == '|') { return lex_table(block) }

      // Blockquotes and Blocks of code
      if(c == 'b') { blockType = 'b' + block[++i] }

      // Headings
      if(c == "h") { blockType = 'h' + block[++i] }

      // ps and pres
      if(c == "p") {
        if(block.slice(i, i+3) == 'pre') {
          i += 2;
          blockType = "pre";
        }
        else {
          blockType = "p";
        }
      }

      for(i++; i < block.length; i++) {
        var c = block[i];

        // look for Alignment indicators
        if(c == '>') { res.push('>') }
        else if(c == '=') { res.push('=') }
        else if(c == '<') {
          // This is a special case, because the <> pair is considered an atom
          if(block[i+1] == '>') {
            i++;
            res.push('<>');
          }
          else {
            res.push('<');
          }
        }

        // Look for classes & ids
        else if(c == '(') {
          var start = i;
          while(block[i++] !== ')') continue;
          res.push(block.slice(start, i--));
        }

        // Look for languages
        else if(c == '[') {
          var start = i;
          while(block[i++] !== ']') continue;
          res.push(block.slice(start, i--));
        }

        // look for styles
        else if(c == '{') {
          var start = i;
          while(block[i++] !== '}') continue;
          res.push(block.slice(start, i--));
        }

        // look for our terminating character. It indicates the end of what this
        // function is designed to lex. Here, we'll return our result, and this
        // function can die happy.
        else if(c == '.') {
          // See if it's an extended block (i.e. the terminator is '..')
          var isExtended = block[i+1] == '.';
          return {
            type: blockType,
            extended: isExtended,
            attrs: res,
            content: block.slice(++i, block.length).trim()
          };
        }

        // This implies a sort of parse error.  Sadly, my understanding of the
        // textile grammar leads to unholy mixing of lexing and parsing, which is
        // awfully messy, but here we are.
        else {
          return { type: "p", attrs: [], extended: false, content: block.trim() };
        }
      }
      return null;
    }

    var blocks = doc.split(/\n\n+/);
    var result = [];
    for(var i in blocks) {
      var lexed = lex_block(blocks[i]);
      if(lexed) result.push(lexed);
    }

    return result;
  }

  function do_substitutions(text) {
    // This is a simple substitution based system.  It might be worth
    // considering implementing this with a real parser, but that does sound
    // like a great deal of work.  For the most part, we can fake it with
    // clever regex substitutions, but sometimes there's a danger of
    // substituting something that we ought to be leaving alone (like, for
    // example, a URL with underscores in it).


    // TODO: Make a function to do attributes on sub-blocks, and apply it.

               // We do quotes first because they are problematic. 
    return text.replace(/(\W)"([^"]*)(\W)"/g, "$1&#8220;$2&#8221;$3")

               // Links
               .replace(/"([^"]+)":(http\S+)/g, "<a href=\"$2\">$1</a>")

               // Images
               .replace(/!([^!]+)!:(http\S+)/g, "<a href=\"$2\"><img src=\"$1\"/></a>")
               .replace(/!([^!]+)!/g, "<img src=\"$1\"/>")

               // Punctuation
               .replace(/--/g, "&#8212;")
               .replace(/\n/g, "<br/>")
               .replace(/(\W)'([^']*)'(\W)/g, '$1&#8216;$2&#8217;$3')
               .replace(/'/g, "&#8217;")
               .replace(/ - /g, " &#8211; ")
               .replace(/\.\.\./g, "&#8230;")
               .replace(/\(r\)/g, "&#174;")
               .replace(/\(tm\)/g, "&#8482;")
               .replace(/\(c\)/g, "&#169;")
               // TODO: dimension sign

               // Acronyms
               .replace(/([A-Z]{2,})\(([^)]+)\)/g, "<span class=\"caps\"><acronym title=\"$2\">$1</acronym></span>")
               .replace(/([A-Z]{2,})/g, "<span class=\"caps\">$1</span>")

               // Citations
               .replace(/\?\?([^\?]+)\?\?/g, "<cite>$1</cite>")
               //
               // Spans
               .replace(/%([^%]+)%/g, "<span>$1</span>")

               // Bolding
               .replace(/\*([^\*]+)\*/g, "<strong>$1</strong>")
               .replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")

               // Italics
               .replace(/\s+_([^_]+)_\s+/g, "<em>$1</em>")
               .replace(/\s+__([^_]+)__\s+/g, "<i>$1</i>")

               // Insertions & Deletions
               .replace(/\+([^\+]+)\+/g, "<ins>$1</ins>")
               .replace(/-([^-]+)-/g, "<del>$1</del>")

               // Insertions & Deletions
               .replace(/\^([^\^]+)\^/g, "<sup>$1</sup>")
               .replace(/~([^~]+)~/g, "<sub>$1</sub>");
  }

  function parse(doc) {
    function parse_list(list) {
      var items = list.content;
      var prevIndent = 1;
      var ret = [];
      var current = ret;
      var stack = [];

      for(var i = 0; i < items.length; i++) {
        var it = items[i];
        it.content = do_substitutions(it.content);

        // Increase nesting if needed
        if(it.indent > prevIndent) {
          for(var j = 0; j < it.indent - prevIndent; j++) {
            // Save current for later
            stack.push(current);
            var newList = [];
            current.push(newList);
            current = newList;
          }
        }

        // Decrease nesting if needed
        if(it.indent < prevIndent) {
          for(var j = 0; j < prevIndent - it.indent; j++)
            current = stack.pop();
        }

        current.push(it);
        prevIndent = it.indent;
      }

      // TODO: Handle attrs
      return {
        type: list.type,
        content: ret,
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
    }

    function parse_table(block) {
      return {
        type: "table",
        content: block.content,
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
    }

    function parse_block(block) {
      // Shortcut out with a call to parse_list, which does a lot of special casing
      if(block.type == "ol" || block.type == "ul")
        return parse_list(block);

      if(block.type == "table")
        return parse_table(block);

      var obj = {
        type: block.type,
        content: do_substitutions(block.content),
        classes: "",
        id: "",
        lang: "",
        style: "",
        alignment: ""
      };
      for(var i in block.attrs) {
        var atom = block.attrs[i];

        // Look for classes and/or an id
        if(atom[0] == '(') {
          // Remove parens and split on #, for a quick and dirty parse
          var parts = atom.replace(/^\(/, "").replace(/\)$/, "").split("#");

          // Add to classes
          if(obj.classes == "")
            obj.classes = parts[0];
          else
            obj.classes = obj.classes + " " + parts[0];

          // Set ID if it hasn't already been set
          if(parts.length > 1 && obj.id == "")
            obj.id = parts[1];
        }

        // Look for a language
        else if(atom[0] == '[') {
          obj.lang = atom.replace(/^\[/, "").replace(/\]$/, "");
        }

        // Look for a style
        else if(atom[0] == '{') {
          obj.style = atom.replace(/^\{/, "").replace(/\}$/, "");
        }

        // Look for alignment
        else {
          // Shortcut out if we already have an alignment set
          if(obj.alignment == "") {
            if(atom == '>') obj.alignment = "right";
            if(atom == '<') obj.alignment = "left";
            if(atom == '=') obj.alignment = "center";
            if(atom == '<>') obj.alignment = "justify";
          }
        }
      }

      return obj;
    }

    // TODO: Handle the "extended" attribute, which indicates extended blocks.

    var res = [];
    for(var i in doc)
      res.push(parse_block(doc[i]));
    return res;
  }


  function generate_code(blocks) {
    function generate_block(block) {

      function html_attrs(b) {
        var attrs = "";
        if(b.classes)
          attrs += "class=\"" + b.classes + "\" ";

        if(b.id)
          attrs += "id=\"" + b.id + "\" ";

        if(b.align)
          b.style = "text-align: " + b.align + "; " + b.style

        if(b.style)
          attrs += "style=\"" + b.style + "\" ";

        if(b.lang)
          attrs += "lang=\"" + b.lang + "\" ";

        return attrs;
      }

      // Generate different kinds of code blocks:
      function heading(b) {
        return "<" + b.type + " " + html_attrs(b) + ">" +
                 b.content +
               "</" + b.type + ">";
      }
      function blockquote(b) {
        return "<blockquote " + html_attrs(b) + "><p>" +
                  b.content +
                "</p></blockquote>";
      }
      function footnote(b) {
        // TODO: Handle footnote numbers properly
        return "<p" + html_attrs(b) + "><sup>" + b.number + "</sup>" +
                  b.content +
                "</p>"
      }
      function paragraph(b) {
        return "<p " + html_attrs(b) + ">" +
                  b.content +
                "</p>";
      }
      function blockcode(b) {
        // TODO: Change this to fit the reference implementation,
        // if I can think of a good reason to.
        return "<pre " + html_attrs(b) + "><code>" +
                 b.content +
               "</code></pre>";
      }
      function preformatted(b) {
        return "<pre " + html_attrs(b) + ">" +
                 b.content +
               "</pre>";
      }
      function table(b) {
        var ret = "<table " + html_attrs(b) + ">";
        for(var i in b.content) {
          var line = b.content[i];
          ret += "<tr>";
          for(var j in line) {
            ret += "<td>" + line[j] + "</td>";
          }
          ret += "</tr>";
        }
        ret += "</table>";
        return ret;
      }

      function list(listObj) {
        function list_generator(items) {
          var ret = "<" + items[0].type + ">";

          for(var i in items) {
            var it = items[i];
            if(it.type) {
              ret += "<li>" + it.content;
              // Check for a sublist
              if(items[i+1] && items[i+1].type == undefined)
                ret += list_generator(items[++i]);
              ret += "</li>";
            }
            else {
              ret += list_generator(it);
            }
          }
          ret += "</" + (items[0].type) + ">";

          return ret;
        }
        // TODO: Add attributes somehow

        return list_generator(listObj.content);
      }

      switch(block.type) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return heading(block);
        case "bq":
          return blockquote(block);
        case "fn":
          return footnote(block);
        case "p":
          return paragraph(block);
        case "bc":
          return blockcode(block);
        case "pre":
          return preformatted(block);
        case "table":
          return table(block);
        case "ul":
        case "ol":
          return list(block);
      }
    }

    ret = "";
    for(var i in blocks)
      ret += generate_block(blocks[i]) + "\n";
    return ret;
  }

  // And finally, we'll export this outside this crazy scope.
  return function(textile) { return generate_code(parse(lex(textile))) };
})();

// Export to let node.js and other CommonJS
// compatible frameworks see our code:
if(typeof exports != 'undefined') {
  exports.linen = linen;
  exports.textilize = linen;
}
