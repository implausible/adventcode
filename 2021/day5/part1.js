const R = require('ramda');
const { readInputAndSplitIntoLines } = require('../util');
const { __ } = R;

const gatherLinesByStartAndEndCoords = () => R.pipe(
  R.map(R.split(' -> ')),
  R.map(R.map(R.pipe(
    R.split(','),
    R.map(Number.parseInt),
    ([x, y]) => ({ x, y })
  ))),
  R.map(([startPoint, endPoint]) => ({ startPoint, endPoint }))
)(readInputAndSplitIntoLines('input'))

const buildBoxGridOf = (xSize, ySize, constructElement) => R.map(
  () => R.map(constructElement, R.range(0, xSize)),
  R.range(0, ySize)
);

const getMaxConstraints = R.pipe(
  R.map(({ startPoint, endPoint }) => ({ x: Math.max(startPoint.x, endPoint.x), y: Math.max(startPoint.y, endPoint.y ) })),
  R.reduce(R.mergeWith(R.max), 0),
  R.map(R.inc)
);

const buildGridOfOverlapSets = (lineDefinitions) => {
  const { x: maxX, y: maxY } = getMaxConstraints(lineDefinitions);
  const gridOfOverlapSets = buildBoxGridOf(maxX, maxY, () => new Set());

  for (const lineDefinition of lineDefinitions) {
    const { startPoint, endPoint } = lineDefinition;
    if (startPoint.x === endPoint.x) {
      const startPointY = Math.min(startPoint.y, endPoint.y);
      const endPointY = Math.max(startPoint.y, endPoint.y);
      for (let y = startPointY; y <= endPointY; ++y) {
        gridOfOverlapSets[y][startPoint.x].add(lineDefinition);
      }
    } else if (startPoint.y === endPoint.y) {
      const startPointX = Math.min(startPoint.x, endPoint.x);
      const endPointX = Math.max(startPoint.x, endPoint.x);
      for (let x = startPointX; x <= endPointX; ++x) {
        gridOfOverlapSets[startPoint.y][x].add(lineDefinition);
      }
    }
  }

  return gridOfOverlapSets;
};

const calculateNumberOfOverlaps = R.pipe(
  R.chain(R.map(R.prop('size'))),
  R.filter(R.lt(1)),
  R.length
);

const lineDefinitions = gatherLinesByStartAndEndCoords();
const gridOfOverlapSets = buildGridOfOverlapSets(lineDefinitions);
console.log(calculateNumberOfOverlaps(gridOfOverlapSets));