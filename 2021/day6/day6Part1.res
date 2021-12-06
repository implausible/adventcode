@module("fs") external readFileSync: (string, string) => string = "readFileSync"
open Belt.Array

let getInputSequence = (): array<float> => {
  open Js.String
  readFileSync("input", "utf8")
    -> split(",", _)
    -> map(_, Belt.Float.fromString)
    -> keepMap(_, n => n)
}

type fishBuckets = {
  zero: float,
  one: float,
  two: float,
  three: float,
  four: float,
  five: float,
  six: float,
  seven: float,
  eight: float
}

let buildInitialBuckets = (initialStates: array<float>): fishBuckets => reduce(
  initialStates,
  { zero: 0.0, one: 0.0, two: 0.0, three: 0.0, four: 0.0, five: 0.0, six: 0.0, seven: 0.0, eight: 0.0 },
  (buckets, nextInitialState) => switch nextInitialState {
    | 8.0 => { ...buckets, eight: buckets.eight +. 1.0 }
    | 7.0 => { ...buckets, seven: buckets.seven +. 1.0 }
    | 6.0 => { ...buckets, six: buckets.six +. 1.0 }
    | 5.0 => { ...buckets, five: buckets.five +. 1.0 }
    | 4.0 => { ...buckets, four: buckets.four +. 1.0 }
    | 3.0 => { ...buckets, three: buckets.three +. 1.0 }
    | 2.0 => { ...buckets, two: buckets.two +. 1.0 }
    | 1.0 => { ...buckets, one: buckets.one +. 1.0 }
    | _ => { ...buckets, zero: buckets.zero +. 1.0 }
  }
)

let performBucketUpdates = (buckets: fishBuckets): fishBuckets => ({
  zero: buckets.one,
  one: buckets.two,
  two: buckets.three,
  three: buckets.four,
  four: buckets.five,
  five: buckets.six,
  six: buckets.seven +. buckets.zero,
  seven: buckets.eight,
  eight: buckets.zero
})

type numberOfFish = float
let rec runSimulation = (buckets: fishBuckets, daysLeft: int): float =>
  if daysLeft == 0 {
    buckets.zero +. buckets.one +. buckets.two
      +. buckets.three +. buckets.four +. buckets.five
      +. buckets.six +. buckets.seven +. buckets.eight
  } else {
    runSimulation(performBucketUpdates(buckets), daysLeft - 1)
  }

let numFish = getInputSequence()
  -> buildInitialBuckets
  -> runSimulation(_, 256)

Js.log(numFish)