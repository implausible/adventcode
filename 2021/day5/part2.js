const R = require('ramda');
const { readInputAndSplitIntoLines } = require('../util');
const { __ } = R;

const gatherLinesByStartAndEndCoords = () => R.map(R.pipe(
  R.split(/ -> |,/),
  R.map(Number.parseInt),
  ([xStart, yStart, xEnd, yEnd]) => ({ xConstraints: [xStart, xEnd], yConstraints: [yStart, yEnd] })
))(readInputAndSplitIntoLines('input'));

const getUpdateAndCompareFunctions = R.apply(R.cond([
  [R.lt, (_, endPoint) => [R.lte(__, endPoint), R.inc]],
  [R.equals, () => [R.always(false), R.identity]],
  [R.gt, (_, endPoint) => [R.gte(__, endPoint), R.dec]]
]));

const buildGridOfOverlaps = R.reduce((sparseGridOfOverlaps, { xConstraints, yConstraints }) => {
  const [compareX, updateX] = getUpdateAndCompareFunctions(xConstraints);
  const [compareY, updateY] = getUpdateAndCompareFunctions(yConstraints);
  for (let x = xConstraints[0], y = yConstraints[0]; compareX(x) || compareY(y); x = updateX(x), y = updateY(y)) {
    const row = sparseGridOfOverlaps[y] ?? [];
    row[x] = (row[x] ?? 0) + 1;
    sparseGridOfOverlaps[y] = row;
  }

  return sparseGridOfOverlaps;
}, []);

const calculateNumberOfOverlaps = R.pipe(
  R.flatten,
  R.filter(R.lt(1)),
  R.length
);

const lineDefinitions = gatherLinesByStartAndEndCoords();
const gridOfOverlaps = buildGridOfOverlaps(lineDefinitions);
console.log(calculateNumberOfOverlaps(gridOfOverlaps));
