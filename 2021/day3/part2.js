const { readInputAndSplitIntoLines } = require('../util');

const countNumberOfOnesAtIndexInInputLines = (index, inputLines) =>
  inputLines.reduce((sum, inputLine) => sum + Number.parseInt(inputLine[index], 10), 0);

const findDifferenceOfNumberOfOnesAndZerosAtIndex = (index, inputLines) => {
  const numberOfOnes = countNumberOfOnesAtIndexInInputLines(index, inputLines);
  const numberOfZeros = inputLines.length - numberOfOnes;
  return numberOfOnes - numberOfZeros;
};

const findStringUsingIndexFilteringStrategy = (makeFilterPredicate, inputLines) => {
  const findStringUsingIndexFilteringStrategyRecursive = (index, prevLines) => {
    const filteredLines = prevLines.filter(makeFilterPredicate(index, prevLines));
    if (filteredLines.length === 1) {
      return filteredLines[0];
    }

    return findStringUsingIndexFilteringStrategyRecursive(index + 1, filteredLines);
  };

  return findStringUsingIndexFilteringStrategyRecursive(0, inputLines);
};

const createFilterPredicateForCharacterSelector = characterSelector => (index, inputLines) => {
  const comparisonCharacter = characterSelector(findDifferenceOfNumberOfOnesAndZerosAtIndex(index, inputLines));
  return line => line[index] === comparisonCharacter;
};
const filterPredicateForMostCommonPreferOnes = createFilterPredicateForCharacterSelector(diff => diff >= 0 ? '1' : '0');
const filterPredicateForLeastCommonPreferZeros = createFilterPredicateForCharacterSelector(diff => diff >= 0 ? '0' : '1');

const binaryStringToNumber = str => Number.parseInt(str, 2);

const main = () => {
  const inputLines = readInputAndSplitIntoLines('input');
  const oxygenRating = findStringUsingIndexFilteringStrategy(filterPredicateForMostCommonPreferOnes, inputLines);
  const co2ScrubberRating = findStringUsingIndexFilteringStrategy(filterPredicateForLeastCommonPreferZeros, inputLines);
  console.log(binaryStringToNumber(oxygenRating) * binaryStringToNumber(co2ScrubberRating));
};

main();