const { readInputAndSplitIntoLines } = require('../util');

const getCountOfZerosAndOnesAtIndex = (index, inputLines) =>
  inputLines
    .map(line => line[index])
    .reduce(
      ([zerosCount, onesCount], char) => char === '0'
        ? [zerosCount + 1, onesCount]
        : [zerosCount, onesCount + 1],
      [0, 0]
    );

const getLeastCommonBinaryCharacterPreferLeastCommon = ([zerosCount, onesCount]) => onesCount >= zerosCount ? '0' : '1';
const getMostCommonBinaryCharacterPreferMostCommon = ([zerosCount, onesCount]) => onesCount >= zerosCount ? '1' : '0';

const makeFilterByIndexWithCharacterCriteria = filterCriteriaFn => (index, inputLines) => {
  const filterCriteria = filterCriteriaFn(getCountOfZerosAndOnesAtIndex(index, inputLines));
  return inputLines.filter(inputLine => inputLine[index] === filterCriteria);
};
const filterByIndexUsingLeastCommonStrategy = makeFilterByIndexWithCharacterCriteria(getLeastCommonBinaryCharacterPreferLeastCommon);
const filterByIndexUsingMostCommonStrategy = makeFilterByIndexWithCharacterCriteria(getMostCommonBinaryCharacterPreferMostCommon);

const findRatingString = applyFilterStrategy => inputLines => {
  const findRatingRecursive = (index, lines) => {
    const filteredLines = applyFilterStrategy(index, lines);
    return filteredLines.length === 1
      ? filteredLines[0]
      : findRatingRecursive(index + 1, filteredLines);
  };

  return findRatingRecursive(0, inputLines);
};
const findOxygenRatingString = findRatingString(filterByIndexUsingMostCommonStrategy);
const findCo2ScurbberRating = findRatingString(filterByIndexUsingLeastCommonStrategy);

const main = () => {
  const inputLines = readInputAndSplitIntoLines('input');
  const oxygenRating = Number.parseInt(findOxygenRatingString(inputLines), 2);
  const co2ScrubberRating = Number.parseInt(findCo2ScurbberRating(inputLines), 2);
  console.log(oxygenRating * co2ScrubberRating);
};

main();
