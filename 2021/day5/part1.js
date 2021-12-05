const R = require('ramda');
const { readInputAndSplitIntoLines } = require('../util');
const { __ } = R;

const gatherLinesByStartAndEndCoords = () => R.map(R.pipe(
  R.split(/ -> |,/),
  R.map(Number.parseInt),
  ([xStart, yStart, xEnd, yEnd]) => ({ xConstraints: [xStart, xEnd], yConstraints: [yStart, yEnd] })
))(readInputAndSplitIntoLines('input'));

const walkHorizontal = (callback, startPoint, endPoint) => R.pipe(
  R.juxt([Math.min, R.pipe(Math.max, R.inc)]),
  R.apply(R.range),
  R.forEach(callback)
)(startPoint, endPoint);

const buildGridOfOverlaps = R.reduce((sparseGridOfOverlaps, { xConstraints, yConstraints }) => {
  const incrementCellInSparseGrid = R.curry((x, y) => {
    const row = sparseGridOfOverlaps[y] ?? [];
    row[x] = (row[x] ?? 0) + 1;
    sparseGridOfOverlaps[y] = row;
  });
  if (xConstraints[0] === xConstraints[1]) {
    walkHorizontal(incrementCellInSparseGrid(xConstraints[0]), ...yConstraints);
  } else if (yConstraints[0] === yConstraints[1]) {
    walkHorizontal(incrementCellInSparseGrid(__, yConstraints[0]), ...xConstraints);
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