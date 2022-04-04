
export const getPositions = cords => {
  console.log(cords)
  return [
    cords[0 * 2 + 0], cords[0 * 2 + 1], // [0] left-top
    cords[1 * 2 + 0], cords[1 * 2 + 1], // [1] right-top
    cords[2 * 2 + 0], cords[2 * 2 + 1], // [2] right-bottom

    cords[0 * 2 + 0], cords[0 * 2 + 1], // [0] left-top
    cords[2 * 2 + 0], cords[2 * 2 + 1], // [2] right-bottom
    cords[3 * 2 + 0], cords[3 * 2 + 1], // [3] left- bottom
  ]
}