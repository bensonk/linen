function linen(input) {
  function handle_attributes(block) {
    // TODO
    // (class)
    // (#id)
    // {style}
    // [language]

    // TODO: do something
    return block;
  }

  function handle_alignment(block) {
    // TODO
    // > right
    // < left
    // = center
    // <> justify

    // TODO: do something
    return block;
  }

  function handle_block_operations(block) {
    // TODO Handle extended blocks

    // TODO
    // hn. heading
    // bq. Blockquote
    // fnn. Footnote
    // p. Paragraph
    // bc. Block code
    // pre. Pre-formatted

    // TODO
    // # Numeric list
    // * Bulleted list

    // TODO: do something
    return block;
  }

  function handle_images(block) {
    // TODO
    // !http://example.com/image.jpg! 

    // TODO: do something
    return block;
  }

  function handle_acronyms(block) {
    // TODO
    // ABC(Always Be Closing)

    // TODO: do something
    return block;
  }

  function handle_raw_html(block) {
    // TODO
    // ==No Textile Markup Here

    // TODO: do something
    return block;
  }

  function handle_tables(block) {
    // TODO
    // |_. a|_. table|_. header|
    // |a|table|row|
    // |a|table|row|

    // TODO: do something
    return block;
  }

  function handle_phrase_modifiers(block) {
    // TODO
    var modifiers = {
      "_": "emphasis", 
      "*": "strong", 
      "__": "italic", 
      "**": "bold", 
      "??": "citation", 
      "-": "deleted text", 
      "+": "inserted text", 
      "^": "superscript", 
      "~": "subscript", 
      "%": "span", 
      "@": "code"
    };

    // TODO: do something
    return block;
  }

  function handle_substitutions(block) {
    var substitutions = {
      // "quotes" → “quotes”
      // 'quotes' → ‘quotes’
      // it's → it’s
      // em -- dash → em — dash
      // en - dash → en – dash
      // 2 x 4 → 2 × 4
      // foo(tm) → foo™
      // foo(r) → foo®
      // foo(c) → foo©
    };

    // TODO: do something
    return block;
  }

  // World's simplest lexer:
  function lex(input) { return input.split(/\n\n+/) }

  var res = input;
  res = handle_phrase_modifiers(res);
  res = handle_substitutions(res);
  return res;
}

function test() {
  tests = ["Testing _emphasis_ and *strength*." ];
  for(var i in tests) {
    console.log(linen(tests[i]));
  }
}
test();
