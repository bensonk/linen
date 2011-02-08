function lex(doc) {
  function lex_block(block) {
    var res = [];

    // First, we look for a block descriptor.
    var i = 0, c = block[0];
    // TODO: Implement footnotes here. 
    // TODO: Implement lists here. 
    if(c == 'b') { res.push('b' + block[++i]) }
    if(c == "h") { res.push('h' + block[++i]) }
    if(c == "p") {
      // TODO: Figure out why this is so broken
      if(block.slice(i, i+3) == 'pre') {
        res.push('pre');
        i += 2;
      }
      else {
        res.push("p");
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
        while(block[i++] !== ')');
        res.push(block.slice(start, i--));
      }

      // Look for languages
      else if(c == '[') {
        var start = i;
        while(block[i++] !== ']');
        res.push(block.slice(start, i--));
      }

      // look for styles
      else if(c == '{') {
        var start = i;
        while(block[i++] !== '}');
        res.push(block.slice(start, i--));
      }

      // look for our terminating character. It indicates the end of what this
      // function is designed to lex. Here, we'll return our result, and this
      // function can die happy.
      else if(c == '.') {
        // TODO: Check for '..' here, too.
        return [ res, block.slice(++i, block.length).trim() ]
          break;
      }

      // This implies a sort of parse error.  Sadly, my understanding of the
      // textile grammar leads to unholy mixing of lexing and parsing, which is
      // awfully messy, but here we are. 
      else {
        res = [ [ "p" ], block.trim() ];
        break;
      }
    }
    return res;
  }

  var blocks = doc.split("\n\n");
  var result = [];
  for(var i in blocks) {
    result.push(lex_block(blocks[i]));
  }

  return result;
}

function do_substitutions(text) {
              // Punctuation
  return text.replace(/--/, "&#8212;")
             .replace(/\n/, "<br/>")
             .replace(/"([^"]*)"/, "&#8220;$1&#8221;")
             .replace(/'([^']*)'/, '&#8216;$1&#8217;')
             .replace(/'/, "&#8217;")
             .replace(/ - /, " &endash; ")
             .replace(/\.\.\./, "&#8230;")
             .replace(/\(r\)/, "&#174;")
             .replace(/\(tm\)/, "&#8482;")
             .replace(/\(c\)/, "&#169;")
             // TODO: dimension sign

             // Acronyms
             .replace(/([A-Z]{2,})\(([^)]+)\)/, "<acronym title=\"$2\">$1</acronym>")
             .replace(/([A-Z]{2,})/, "<span class=\"caps\">$1</span>")

             // Citations
             .replace(/\?\?([^\?]+)\?\?/, "<cite>$1</cite>")

             // Bolding
             .replace(/\*([^\*]+)\*/, "<strong>$1</strong>")
             .replace(/\*\*([^\*]+)\*\*/, "<b>$1</b>")

             // Italics
             .replace(/_([^_]+)_/, "<em>$1</em>")
             .replace(/__([^_]+)__/, "<i>$1</i>")

             // Insertions & Deletions
             .replace(/\+([^\+]+)\+/, "<ins>$1</ins>")
             .replace(/-([^-]+)-/, "<del>$1</del>")

             // Insertions & Deletions
             .replace(/\^([^\^]+)\^/, "<sup>$1</sup>")
             .replace(/~([^~]+)~/, "<sub>$1</sub>");

  // TODO: Links
  // TODO: Images
}

function parse(doc) {
  function parse_block(block, content) {
    var obj = {
      original_data: block,
      block_type: block.shift(),
      content: do_substitutions(content),
      classes: "",
      id: "",
      lang: "",
      style: "",
      alignment: ""
    };
    for(var i in block) {
      var atom = block[i];

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

  // TODO: Recognize multiblock syntax

  var res = [];
  for(var i in doc)
    res.push(parse_block(doc[i][0], doc[i][1]));
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
      return "<" + b.block_type + " " + html_attrs(b) + ">" +
               b.content + 
             "</" + b.block_type + ">";
    }
    function blockquote(b) {
      return "<blockquote " + html_attrs(b) + "><p>" + 
                b.content + 
              "</p></blockquote>";
    }
    function footnote(b) {
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
    function ordered_list(b) {
      // TODO: Write this. 
    }
    function unordered_list(b) {
      // TODO: Write this. 
    }

    switch(block.block_type) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        return heading(block);
      case "bq":
        return blockquote(block);
      case "fn": // TODO: Handle footnote numbers
        return footnote(block);
      case "p":
        return paragraph(block);
      case "bc":
        return blockcode(block);
      case "pre":
        return preformatted(block);
      case "ul": // TODO: This
        return unordered_list(block);
      case "ol": // TODO: This too
        return ordered_list(block);
    }
  }

  ret = "";
  for(var i in blocks)
    ret += generate_block(blocks[i]) + "\n";
  return ret;
}


var test = "p>(funstuff){color: green}. This is a test.\n\n"+
           "bc>(funstuff){color: green}. This is a test.\n\n"+
           "A *simple* example.\n\n"+
           "h2. A simple header.\n\n"+
           "h2<>(#header)[EN]. I want to go home.\n\n"+
           "h3<>(.test#email)(asdf)(hqzh)<[EN]{padding: 2em}(53). somebody@example.com\n\n"+
           "h4<>(footie#gutter)(headie). Throw your trash over there, nobody will mind.\n\n"+
           "pre{color: white; padding: 1em; background-color: darkblue;}. I walked in the valley of the shadow of death.\n\n"+
           "Here, let's test some symbols... RegisteredTrademark(r), Trademark(tm), and Copyright (c) 2008\n\n"+
           "Let's try a TLA(Three Letter Acronym).\n\n"+
           "Maybe a ??citation??, a ^superscript^, and a ~subscript~, just for fun.\n\n"+
           "\"And then he was all, 'That's what she said!' and I got really upset,\" she said.\n\n"+
           "I am now _testing_ some *modifiers*, so hold on to your -balls- +hats+.  I like to have fun -- it's one of my favourite things.  ";

console.log(generate_code(parse(lex(test))));
