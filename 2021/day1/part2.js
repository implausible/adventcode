const fs = require('fs');
const sumOfSubarray = (startingIndex, endingIndex, array) => array
  .slice(startingIndex, endingIndex)
  .reduce((s, a) => s + a, 0);
const isCurrentGroupOf3BiggerThanPreviousGroupOf3 = (index, array) =>
  sumOfSubarray(index - 2, index + 1, array) > sumOfSubarray(index - 3, index, array);
const { length: numIncreases } = fs.readFileSync('input', 'utf8')
  .split('\n')
  .filter(a => a)
  .map(s => Number.parseInt(s, 10))
  .filter((value, index, lines) => index > 2 && isCurrentGroupOf3BiggerThanPreviousGroupOf3(index, lines));
console.log(numIncreases);
