const fs = require('fs');
const path = require('path');

const tsFilePath = path.join(__dirname, 'src', 'app', 'features', 'ollas', 'pages', 'ollas-page.ts');
const htmlFilePath = path.join(__dirname, 'src', 'app', 'features', 'ollas', 'pages', 'ollas-page.html');

let code = fs.readFileSync(tsFilePath, 'utf8');

// Match the template string starting after const TEMPLATE = /* html */`
// and ending just before @Component
const templateRegex = /const TEMPLATE\s*=\s*\/\*\s*html\s*\*\/\s*`([\s\S]*?)`;\s*(@Component)/;
const match = code.match(templateRegex);

if (match) {
    const htmlContent = match[1];
    
    // Write out the HTML file
    fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
    
    // Replace the template declaration and the @Component reference
    let newCode = code.replace(templateRegex, '$2');
    newCode = newCode.replace(/template:\s*TEMPLATE/, "templateUrl: './ollas-page.html'");
    
    fs.writeFileSync(tsFilePath, newCode, 'utf8');
    console.log('Successfully separated template into ollas-page.html');
} else {
    console.log('Template regex did not match.');
}
