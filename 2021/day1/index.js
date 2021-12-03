const fs = require('fs');
const { length: numIncreases } = fs.readFileSync('input', 'utf8')
    .split('\n')
    .filter(a => a)
    .map(s => Number.parseInt(s, 10))
    .filter((value, index, lines) => index != 0 && value > lines[index - 1]);
console.log(numIncreases);
