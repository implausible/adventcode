const fs = require('fs');

const readInputAndSplitIntoLines = (fileLocation) => fs.readFileSync(fileLocation, 'utf8')
.split('\n')
.filter(a => a)

module.exports = {
  readInputAndSplitIntoLines
};