const R = require('ramda');
const { readInputAndSplitIntoLines } = require('../util');
const { __ } = R;

const gatherLinesByStartAndEndCoords = () => R.map(R.pipe(
  R.split(' -> '),
  R.map(R.pipe(
    R.split(','),
    R.map(Number.parseInt)
  )),
  ([[xStart, yStart], [xEnd, yEnd]]) => ({ x: [xStart, xEnd], y: [yStart, yEnd] })
))(readInputAndSplitIntoLines('input'));

const buildNumberGridOfZeros = (xSize, ySize) => R.times(() => R.repeat(0, xSize), ySize);

const oneMoreThanMaxInList = R.pipe(R.apply(Math.max), R.inc);
const getMaxConstraints = R.pipe(
  R.map(R.map(oneMoreThanMaxInList)),
  R.reduce(R.mergeWith(Math.max), 0)
);

const getMinAndMax = R.applySpec({ min: Math.min, max: Math.max });
const walkHorizontal = (callback, startPoint, endPoint) => {
  const { min, max } = getMinAndMax(startPoint, endPoint);
  for (let i = min; i <= max; ++i) {
    callback(i);
  }
};

const buildGridOfOverlaps = (lineDefinitions) => {
  const { x: maxX, y: maxY } = getMaxConstraints(lineDefinitions);
  const gridOfOverlaps = buildNumberGridOfZeros(maxX, maxY);
  for (const lineDefinition of lineDefinitions) {
    const { x: xConstraints, y: yConstraints } = lineDefinition;
    if (xConstraints[0] === xConstraints[1]) {
      walkHorizontal((y) => {
        gridOfOverlaps[y][xConstraints[0]] += 1;
      }, ...yConstraints);
    } else if (yConstraints[0] === yConstraints[1]) {
      walkHorizontal((x) => {
        gridOfOverlaps[yConstraints[0]][x] += 1;
      }, ...xConstraints);
    }
  }

  return gridOfOverlaps;
};

const calculateNumberOfOverlaps = R.pipe(
  R.chain(R.filter(R.lt(1))),
  R.length
);

const lineDefinitions = gatherLinesByStartAndEndCoords();
const gridOfOverlaps = buildGridOfOverlaps(lineDefinitions);
console.log(calculateNumberOfOverlaps(gridOfOverlaps));