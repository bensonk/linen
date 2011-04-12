// Some test data
var tests = [ 'p>(funstuff){color: green}. This is a "test".',
              'bc>(funstuff){color: green}. This is a test.',
              'A *simple* example.',
              'h2. A simple header.',
              'h2<>(#header)[EN]. I want to go home.',
              'h3<>(.test#email)(asdf)(hqzh)<[EN]{padding: 2em}(53). somebody@example.com',
              'h4<>(footie#gutter)(headie). Throw your trash over there, nobody will mind.',
              'pre{color: white; padding: 1em; background-color: darkblue;}. I walked in the valley of the shadow of death.',
              'Here, let\'s test some symbols... RegisteredTrademark(r), Trademark(tm), and Copyright (c) 2008',
              'Let\'s try a TLA(Three Letter Acronym).',
              'Maybe a ??citation??, a ^superscript^, and a ~subscript~, just for fun.',
              '\"And then he was all, \'That\'s what she said!\' and I got really upset,\" she said.',
              '*(action#card){color: green} foo\n*(#two) bar\n* baz\n** one\n** two\n*** six\n** three\n* bat',
              'I am now _testing_ some *modifiers*, so hold on to your -balls- +hats+.  I like to have fun -- it\'s one of my favourite - things.  ',
              'The following is a test of how we handle empty input.',
              '',
              '|foo|bar|baz|\n|one|two|three|\n|benson|ashleigh|brora|',
              'Testing a \"link\":http://www.google.com',
              'Here\'s an image:\n!http://farm6.static.flickr.com/5124/5285147296_3c465994cd_s.jpg!\n'+
              'Here\'s one with a link:\n !http://farm6.static.flickr.com/5100/5422259101_a329ca0779_t.jpg!:http://google.com',
              'And now for a %{color: red}red span%, and %{color: green}Alan Greenspan%.  '+
              'A "(#linky){background-color: red}link":http://github.com for great justice.',
              'div(foobar this is a test.',
              'You did it!\nYou did it! You did it! You did it!',
              '~You~ did it!*You* did it!',
              'bc. where thing = (cy-ay)(bx-ax) - (cx-ax)(by-ay)bc. <h1 class="foo">A header</h1>',
              '123-123-123\n123 -123- 123',
              'p.  -Fun for the whole family- .',
              'p. A link at the end of a "sentence":http://textile.thresholdstate.com.',
              '1. A markdown formatted list\n2. That won\'t break the lexer',
              'foobar. A block that isn\'t actually a block.',
			  '*@Nested textile tags produce unbroken HTML@*'
              ];


console.log('<h1>Linen Tests</h1>');

var linen = require('./linen');
for(var i in tests) {
  console.log('<div class="test" style="background-color: #DDD; padding: 0.5em; 0.5em; margin: 1em;">');
  console.log('  <pre class="testdata" style="border: dashed green 2px; padding: 0.5em; margin: 1em;">' + tests[i] + '</pre>');
  console.log('  <div class="testrun" style="border: dashed blue 2px; padding: 0.5em; margin: 1em;">');

  console.log(linen.linen(tests[i]));

  console.log('  </div>')
  console.log('</div>');
}
