// Some test data
var tests = [ "p>(funstuff){color: green}. This is a test.\n\n"+
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
              "*(action#card){color: green} foo\n*(#two) bar\n* baz\n** one\n** two\n*** six\n** three\n* bat\n\n"+
              "I am now _testing_ some *modifiers*, so hold on to your -balls- +hats+.  I like to have fun -- it's one of my favourite - things.  ",
              "",
              "|foo|bar|baz|\n|one|two|three|\n|benson|ashleigh|brora|",
              "Testing a \"link\":http://www.google.com",
              "Here's an image:\n!http://farm6.static.flickr.com/5124/5285147296_3c465994cd_s.jpg!\nHere's one with a link:\n !http://farm6.static.flickr.com/5100/5422259101_a329ca0779_t.jpg!:http://google.com" ];


var linen = require('./linen');
for(var i in tests) {
  console.log(linen.linen(tests[i]));
}
