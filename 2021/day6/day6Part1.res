@module("fs") external readFileSync: (string, string) => string = "readFileSync"
open Belt.Array

let getInitialFishBuckets = (): array<float> =>
  readFileSync("input", "utf8")
    -> Js.String2.split(",")
    -> keepMap(n => Belt.Int.fromString(n))
    -> reduce(make(9, 0.0), (buckets, nextInitialState) => {
      buckets[nextInitialState] = buckets[nextInitialState] +. 1.0;
      buckets
    })

let runSimulation = (inputBuckets: array<float>, simulateDays: int): float =>
  range(0, simulateDays - 1) -> reduce(copy(inputBuckets), (buckets, day) => {
    let positionOfBucketSeven = mod(day + 7, 9)
    buckets[positionOfBucketSeven] = buckets[positionOfBucketSeven] +. buckets[mod(day, 9)] 
    buckets
  })
  -> reduce(0.0, (sum, numFish) => sum +. numFish)

let fishBuckets = getInitialFishBuckets()
Js.log(fishBuckets -> runSimulation(80))
Js.log(fishBuckets -> runSimulation(256))