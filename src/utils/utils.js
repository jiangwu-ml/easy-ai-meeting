import { without } from "lodash";

export function omitEmpty(arr) {
  return without(arr,[null,undefined])
}