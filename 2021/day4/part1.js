const R = require('ramda');
const { readInputAndSplitIntoLines } = require('../util');

const doubleMap = R.pipe(R.map, R.map)

const [gameSequenceString, ...boardRows] = readInputAndSplitIntoLines('input');
const gameSequence = R.pipe(R.split(','), R.map(Number.parseInt))(gameSequenceString);
const boards = R.pipe(
  R.splitEvery(5),
  doubleMap(R.pipe(
    R.trim,
    R.split(/\s+/),
    R.map(boardValue => ({
      boardValue: Number.parseInt(boardValue),
      marked: false
    }))
  ))
)(boardRows);

const playAndUpdateBoards = (entry, boards) => R.map(
  doubleMap(({ boardValue, marked }) => ({
    boardValue,
    marked: marked || boardValue === entry
  })),
  boards
);

const doesBoardHaveWinningRow = R.any(R.all(R.prop('marked')));
const doesBoardHaveWinningColumn = R.pipe(R.transpose, doesBoardHaveWinningRow);
const findWinningBoard = R.find(R.either(doesBoardHaveWinningRow, doesBoardHaveWinningColumn));

const simulateUntilWinner = (inputBoards) => {
  let mutableBoards = inputBoards;
  for (let i = 0; i < gameSequence.length; ++i) {
    const entry = gameSequence[i];
    mutableBoards = playAndUpdateBoards(entry, mutableBoards);
    if (i < 5) {
      continue;
    }

    const winningBoard = findWinningBoard(mutableBoards);
    if (winningBoard) {
      return [entry, winningBoard];
    }
  }
};

const sumOfUnmarked = R.pipe(
  R.chain(R.reject(R.prop('marked'))),
  R.pluck('boardValue'),
  R.sum
);

const [winningEntry, winningBoard] = simulateUntilWinner(boards);

console.log(winningEntry * sumOfUnmarked(winningBoard));

