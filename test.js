// Some test data
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
           "* foo\n* bar\n* baz\n** one\n** two\n*** six\n** three\n* bat\n\n"+
           "I am now _testing_ some *modifiers*, so hold on to your -balls- +hats+.  I like to have fun -- it's one of my favourite things.  ";

var linen = require('./linen');
console.log(linen.linen(test));