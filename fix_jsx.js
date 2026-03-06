const fs = require('fs');
let code = fs.readFileSync('src/components/Founders.js', 'utf8');
code = code.replace(/<img([^>]*)>/g, (match, contents) => {
    if (match.endsWith('/>')) return match;
    return `<img${contents} />`;
});
code = code.replace(/<br>/g, '<br />');
fs.writeFileSync('src/components/Founders.js', code);

// Same for page.js
let pageCode = fs.readFileSync('src/app/page.js', 'utf8');
pageCode = pageCode.replace(/<img([^>]*)>/g, (match, contents) => {
    if (match.endsWith('/>')) return match;
    return `<img${contents} />`;
});
pageCode = pageCode.replace(/<br>/g, '<br />');
fs.writeFileSync('src/app/page.js', pageCode);

console.log('Fixed tags');
