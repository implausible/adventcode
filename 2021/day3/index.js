const { readInputAndSplitIntoLines } = require('../util');

const createNumberOfBags = (numBags) => [...Array(numBags).keys()].map(() => ({ ones: 0, zeros: 0 }));

const ensureBagsForInputStringLength = (bags, inputString) => bags
  || createNumberOfBags(inputString.length);

const incrementIf = (comparison) => (input, valueToIncrement) => input === comparison ? valueToIncrement + 1 : valueToIncrement;
const incrementIfOne = incrementIf('1');
const incrementIfZero = incrementIf('0');

const accumulateBitCounts = (maybeBags, inputString) => {
  const bags = ensureBagsForInputStringLength(maybeBags, inputString);
  return bags.map(({ ones, zeros }, index) => ({
    ones: incrementIfOne(inputString[index], ones),
    zeros: incrementIfZero(inputString[index], zeros)
  }));
}

const buildGamma = ({ zeros, ones }, gamma) => gamma + (zeros > ones ? '0' : '1');
const buildEpsilon = ({ zeros, ones }, epsilon) => epsilon + (zeros < ones ? '0' : '1');

const convertBagsIntoGammaAndEpsilon = ({ gamma, epsilon }, bag) => ({
  gamma: buildGamma(bag, gamma),
  epsilon: buildEpsilon(bag, epsilon)
});

const { gamma, epsilon } = readInputAndSplitIntoLines('input')
  .reduce(accumulateBitCounts, null)
  .reduce(convertBagsIntoGammaAndEpsilon, { gamma: '', epsilon: '' });

console.log(Number.parseInt(gamma, 2) * Number.parseInt(epsilon, 2));