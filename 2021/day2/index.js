const fs = require('fs');
 
const getCoordinateTuple = ([direction, unitsToMove]) => ({
    down: [0, unitsToMove],
    forward: [unitsToMove, 0],
    up: [0, -1 * unitsToMove]
}[direction]);
 
const parseLineForDirectionAndUnitsToMove = (line) => {
    const [direction, unitString] = line.split(/\s+/);
    return [direction, Number.parseInt(unitString, 10)];
};

const vec2Add = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2];
const multiply = (a, b) => a * b;
 
const sumOfHorizontalTimesSumOfVerticalUnits = fs.readFileSync('input', 'utf8')
    .split('\n')
    .filter(a => a)
    .map(parseLineForDirectionAndUnitsToMove)
    .map(getCoordinateTuple)
    .reduce(vec2Add, [0, 0])
    .reduce(multiply, 1);
console.log(sumOfHorizontalTimesSumOfVerticalUnits);