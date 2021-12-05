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

const getUpdateAndCompareFunctions = R.apply(R.cond([
  [R.lt, (_, endPoint) => [R.lte(__, endPoint), R.inc]],
  [R.equals, () => [R.always(false), R.identity]],
  [R.gt, (_, endPoint) => [R.gte(__, endPoint), R.dec]]
]));

const buildGridOfOverlaps = (lineDefinitions) => {
  const { x: maxX, y: maxY } = getMaxConstraints(lineDefinitions);
  const gridOfOverlaps = buildNumberGridOfZeros(maxX, maxY);
  for (const lineDefinition of lineDefinitions) {
    const { x: xConstraints, y: yConstraints } = lineDefinition;
    const [compareX, updateX] = getUpdateAndCompareFunctions(xConstraints);
    const [compareY, updateY] = getUpdateAndCompareFunctions(yConstraints);
    for (let x = xConstraints[0], y = yConstraints[0]; compareX(x) || compareY(y); x = updateX(x), y = updateY(y)) {
      gridOfOverlaps[y][x] += 1;
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