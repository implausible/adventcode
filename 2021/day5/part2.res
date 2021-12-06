@module("fs") external readFileSync: (string, string) => string = "readFileSync"
open Belt.Array

type point = (int, int)
type lineDefinition = {
  xConstraints: point,
  yConstraints: point
}

let gatherLinesByStartAndEndCoords = (): array<lineDefinition> => {
  open Js.String
  readFileSync("input", "utf8")
    -> split("\n", _)
    -> keep(_, s => Js.String.length(s) != 0)
    -> map(_, s => s
      -> splitByRe(%re("/ -> |,/"), _)
      -> map(_, Belt.Option.flatMap(_, Belt.Int.fromString))
      -> keepMap(_, n => n)
      -> (arr) => { xConstraints: (arr[0], arr[2]), yConstraints: (arr[1], arr[3]) })
}

let buildRangeOrEnsureEquallyFilledArray = (xConstraints: point, (yStart, yEnd)) =>
  switch xConstraints {
    | (xStart, xEnd) if xStart < xEnd  => range(xStart, xEnd)
    | (xStart, xEnd) if xStart > xEnd  => range(xEnd, xStart) -> reverse
    | (xStart, _xEnd)                  => make(abs(yEnd - yStart) + 1, xStart)
  }

let buildAllLineCoordinates = (lineDefinitions: array<lineDefinition>) =>
  lineDefinitions
    -> map(_, ({ xConstraints, yConstraints }) => zip(
      buildRangeOrEnsureEquallyFilledArray(xConstraints, yConstraints),
      buildRangeOrEnsureEquallyFilledArray(yConstraints, xConstraints)))
    -> concatMany

module PointHashable = Belt.Id.MakeHashable({
  type t = point;
  let hash = Hashtbl.hash;
  let eq = ((x0, y0), (x1, y1)) => x0 == x1 && y0 == y1;
})
type pointMap = Belt.HashMap.t<PointHashable.t, int, PointHashable.identity>
let buildPointsToCountMap = (points: array<point>) => {
  reduce(points, Belt.HashMap.make(~hintSize=length(points), ~id=module(PointHashable)), (pointsToCountMap, pointInLine) => {
    Belt.HashMap.set(pointsToCountMap, pointInLine, switch Belt.HashMap.get(pointsToCountMap, pointInLine) {
      | Some(value) => value + 1
      | None => 1
    })
    pointsToCountMap
  })
};

let countPointsWithOverlaps = (pointHashMap: pointMap) => pointHashMap
  -> Belt.HashMap.valuesToArray
  -> keep(_, n => n > 1)
  -> length

let pointsWithOverlaps = gatherLinesByStartAndEndCoords()
  -> buildAllLineCoordinates
  -> buildPointsToCountMap
  -> countPointsWithOverlaps

Js.log(pointsWithOverlaps)