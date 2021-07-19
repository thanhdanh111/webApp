export function checkTrueInArray({ conditionsArray }) {
  if (!conditionsArray || !conditionsArray?.length) {
    return
  }

  return conditionsArray.some((condition) => condition)
}
