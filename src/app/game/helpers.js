export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function getRandomArbitrary(min, max) {
  return (Math.random() * (max - min)) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}
