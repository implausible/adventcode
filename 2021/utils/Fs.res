@module("fs") external readFileSync: (string, string) => string = "readFileSync"
open Belt.Array

let getLines = (): array<string> => {
  open Js.String
  readFileSync("input", "utf8")
    -> split("\n", _)
    -> keep(_, s => Js.String.length(s) != 0)
}