const fs = require('fs');

const Operation = {
  AIM: 'AIM',
  MOVE: 'MOVE'
};

const toAimInstruction = (direction, units) => [Operation.AIM, (direction === 'up' ? -1 : 1) * units];

const toMoveInstruction = (units) => [Operation.MOVE, units];

const parseLineForInstruction = (line) => {
  const [direction, unitString] = line.split(/\s+/);
  const units = Number.parseInt(unitString, 10);
  return direction === 'forward'
    ? toMoveInstruction(units)
    : toAimInstruction(direction, units);
};

const createDefaultState = () => ({
  aim: 0,
  depthPosition: 0,
  horizontalPosition: 0
});

const applyAimOperationToState = (units, state) => ({
  ...state,
  aim: state.aim + units
});

const applyMoveOperationToState = (units, state) => ({
  ...state,
  depthPosition: state.depthPosition + (units * state.aim),
  horizontalPosition: state.horizontalPosition + units
});

const applyOperationToState = (
    { aim, depthPosition, horizontalPosition },
    [operation, units]
) => ({
  [Operation.AIM]: applyAimOperationToState,
  [Operation.MOVE]: applyMoveOperationToState
}[operation])(units, { aim, depthPosition, horizontalPosition });

const readInputAndSplitIntoLines = () => fs.readFileSync('input', 'utf8')
  .split('\n')
  .filter(a => a);

const { depthPosition, horizontalPosition } = readInputAndSplitIntoLines()
    .map(parseLineForInstruction)
    .reduce(applyOperationToState, createDefaultState());

console.log(depthPosition * horizontalPosition);