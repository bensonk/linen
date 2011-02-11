function lex(g){function handle_list(b){function lex_list(a){var b=a.split("\n");var c=[];for(var i in b){var d=/^(\*+|#+)\s+(.*)/.exec(b[i]);if(d){types={"*":"ul","#":"ol"};c.push({type:types[d[1][0]],indent:d[1].length,content:d[2]})}}return c}var e=lex_list(b);return{type:e[0].type,extended:false,attrs:[],content:e}}function lex_block(a){var b=[];var d="";var i=0,c=a[0];if(c=='f'&&a[i+1]=='n'){}if(c=='*'||c=='#'){return handle_list(a)}if(c=='b'){d='b'+a[++i]}if(c=="h"){d='h'+a[++i]}if(c=="p"){if(a.slice(i,i+3)=='pre'){i+=2;d="pre"}else{d="p"}}for(i++;i<a.length;i++){var c=a[i];if(c=='>'){b.push('>')}else if(c=='='){b.push('=')}else if(c=='<'){if(a[i+1]=='>'){i++;b.push('<>')}else{b.push('<')}}else if(c=='('){var e=i;while(a[i++]!==')');b.push(a.slice(e,i--))}else if(c=='['){var e=i;while(a[i++]!==']');b.push(a.slice(e,i--))}else if(c=='{'){var e=i;while(a[i++]!=='}');b.push(a.slice(e,i--))}else if(c=='.'){var f=a[i+1]=='.';return{type:d,extended:f,attrs:b,content:a.slice(++i,a.length).trim()}}else{return{type:"p",attrs:[],extended:false,content:a.trim()}}}return null}var h=g.split(/\n\n+/);var j=[];for(var i in h){j.push(lex_block(h[i]))}return j}function do_substitutions(a){return a.replace(/--/,"&#8212;").replace(/\n/,"<br/>").replace(/"([^"]*)"/,"&#8220;$1&#8221;").replace(/'([^']*)'/,'&#8216;$1&#8217;').replace(/'/,"&#8217;").replace(/ - /," &endash; ").replace(/\.\.\./,"&#8230;").replace(/\(r\)/,"&#174;").replace(/\(tm\)/,"&#8482;").replace(/\(c\)/,"&#169;").replace(/([A-Z]{2,})\(([^)]+)\)/,"<acronym title=\"$2\">$1</acronym>").replace(/([A-Z]{2,})/,"<span class=\"caps\">$1</span>").replace(/\?\?([^\?]+)\?\?/,"<cite>$1</cite>").replace(/\*([^\*]+)\*/,"<strong>$1</strong>").replace(/\*\*([^\*]+)\*\*/,"<b>$1</b>").replace(/_([^_]+)_/,"<em>$1</em>").replace(/__([^_]+)__/,"<i>$1</i>").replace(/\+([^\+]+)\+/,"<ins>$1</ins>").replace(/-([^-]+)-/,"<del>$1</del>").replace(/\^([^\^]+)\^/,"<sup>$1</sup>").replace(/~([^~]+)~/,"<sub>$1</sub>")}function parse(k){function parse_list(a){var b=a.content;var c=1;var d=[];var e=d;var f=[];for(var i=0;i<b.length;i++){var g=b[i];g.content=do_substitutions(g.content);if(g.indent>c){for(var j=0;j<g.indent-c;j++){f.push(e);var h=[];e.push(h);e=h}}if(g.indent<c){for(var j=0;j<c-g.indent;j++)e=f.pop()}e.push(g);c=g.indent}return{type:a.type,content:d,classes:"",id:"",lang:"",style:"",alignment:""}}function parse_block(a){if(a.type=="li"||a.type=="ul")return parse_list(a);var b={type:a.type,content:do_substitutions(a.content),classes:"",id:"",lang:"",style:"",alignment:""};for(var i in a.attrs){var c=a.attrs[i];if(c[0]=='('){var d=c.replace(/^\(/,"").replace(/\)$/,"").split("#");if(b.classes=="")b.classes=d[0];else b.classes=b.classes+" "+d[0];if(d.length>1&&b.id=="")b.id=d[1]}else if(c[0]=='['){b.lang=c.replace(/^\[/,"").replace(/\]$/,"")}else if(c[0]=='{'){b.style=c.replace(/^\{/,"").replace(/\}$/,"")}else{if(b.alignment==""){if(c=='>')b.alignment="right";if(c=='<')b.alignment="left";if(c=='=')b.alignment="center";if(c=='<>')b.alignment="justify"}}}return b}var l=[];for(var i in k)l.push(parse_block(k[i]));return l}function generate_code(f){function generate_block(e){function html_attrs(b){var a="";if(b.classes)a+="class=\""+b.classes+"\" ";if(b.id)a+="id=\""+b.id+"\" ";if(b.align)b.style="text-align: "+b.align+"; "+b.style; if(b.style)a+="style=\""+b.style+"\" ";if(b.lang)a+="lang=\""+b.lang+"\" ";return a}function heading(b){return"<"+b.type+" "+html_attrs(b)+">"+b.content+"</"+b.type+">"}function blockquote(b){return"<blockquote "+html_attrs(b)+"><p>"+b.content+"</p></blockquote>"}function footnote(b){return"<p"+html_attrs(b)+"><sup>"+b.number+"</sup>"+b.content+"</p>"}function paragraph(b){return"<p "+html_attrs(b)+">"+b.content+"</p>"}function blockcode(b){return"<pre "+html_attrs(b)+"><code>"+b.content+"</code></pre>"}function preformatted(b){return"<pre "+html_attrs(b)+">"+b.content+"</pre>"}function list(d){function list_generator(a){var b="<"+a[0].type+">";for(var i in a){var c=a[i];if(c.type){b+="<li>"+c.content;if(a[i+1]&&a[i+1].type==undefined)b+=list_generator(a[++i]);b+="</li>"}else{b+=list_generator(c)}}b+="</"+(a[0].type)+">";return b}return list_generator(d.content)}switch(e.type){case"h1":case"h2":case"h3":case"h4":case"h5":case"h6":return heading(e);case"bq":return blockquote(e);case"fn":return footnote(e);case"p":return paragraph(e);case"bc":return blockcode(e);case"pre":return preformatted(e);case"ul":case"ol":return list(e)}}ret="";for(var i in f)ret+=generate_block(f[i])+"\n";return ret}function linen(a){return generate_code(parse(lex(a)))}exports.linen=linen;
