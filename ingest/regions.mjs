// Geographic labels only. Not a measurement.
const NORTH = [50, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 67];
const NORTHEAST = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49];
const EAST = [20, 21, 22, 23, 24, 25, 27];
const WEST = [70, 71, 72, 73, 74, 75, 76, 77];
const SOUTH = [80, 81, 82, 83, 84, 85, 86, 90, 91, 92, 93, 94, 95, 96];

const set = (ids, region) => Object.fromEntries(ids.map((n) => [`TH-${n}`, region]));

export const REGION_OF = {
  ...set(NORTH, "north"),
  ...set(NORTHEAST, "northeast"),
  ...set(EAST, "east"),
  ...set(WEST, "west"),
  ...set(SOUTH, "south"),
};

export function regionOf(code) {
  if (code === "TH-10") return "bangkok";
  return REGION_OF[code] || "central";
}
