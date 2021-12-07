@module("fs") external readFileSync: (string, string) => string = "readFileSync"
open Belt.Array

let getInitialHorizontalPositions = (): array<int> =>
  readFileSync("input", "utf8")
    -> Js.String2.split(",")
    -> keepMap(n => Belt.Int.fromString(n))

let sum = reduce(_, 0, (sum, n) => sum + n)
let getAverageOfNumbers = (nums: array<int>) =>
  sum(nums) / length(nums);

let calculateTotalFuelUse = (nums: array<int>, movePoint: int): int =>
  map(nums, i => {
    let distance = abs(movePoint - i)
    range(0, distance) -> sum
  }) -> sum

let rec minimizeFuelUseByDecrement = (nums: array<int>, startingFuelUse: int, nextAttempt: int): int => {
  if (nextAttempt < 0) {
    startingFuelUse
  } else {
    let maybeSmallerFuelUse = calculateTotalFuelUse(nums, nextAttempt)
    if maybeSmallerFuelUse < startingFuelUse {
      minimizeFuelUseByDecrement(nums, maybeSmallerFuelUse, nextAttempt - 1)
    } else {
      startingFuelUse
    }
  }
}

let rec minimizeFuelUseByIncrement = (nums: array<int>, startingFuelUse: int, nextAttempt: int): int => {
  if (nextAttempt >= reduce(nums, 0, max)) {
    startingFuelUse
  } else {
    let maybeSmallerFuelUse = calculateTotalFuelUse(nums, nextAttempt)
    if maybeSmallerFuelUse > startingFuelUse {
      minimizeFuelUseByIncrement(nums, maybeSmallerFuelUse, nextAttempt + 1)
    } else {
      startingFuelUse
    }
  }
}

let calculateMinFuelUse = (nums: array<int>): int => {
  let avgPoint = getAverageOfNumbers(nums)
  let avgFuelUse = calculateTotalFuelUse(nums, avgPoint)
  let smallerThanAvgPointFuelUsage = minimizeFuelUseByDecrement(nums, avgFuelUse, avgPoint - 1)
  if (smallerThanAvgPointFuelUsage < avgFuelUse) {
    smallerThanAvgPointFuelUsage
  } else {
    let largerThanAvgPointFuelUsage = minimizeFuelUseByIncrement(nums, avgFuelUse, avgPoint + 1)
    if (largerThanAvgPointFuelUsage < avgFuelUse) {
      largerThanAvgPointFuelUsage
    } else {
      avgFuelUse
    }
  }
}

Js.log(getInitialHorizontalPositions() -> calculateMinFuelUse)