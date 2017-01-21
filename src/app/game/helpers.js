export function toRadians(angle) {
  return angle * (Math.PI / 180);
}

export function toDegrees(radians) {
  return radians * (180 / Math.PI);
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


export function turnToAngle(game, currentAngle, targetAngle, rotationSpeed) {
  let difference = targetAngle - currentAngle;

  if (difference > game.math.PI) {
    difference = ((2 * game.math) - difference);
  } else if (difference < -game.math.PI) {
    difference = ((2 * game.math) + difference);
  }

  // Move the character's rotation a set amount per unit time
  const delta = (difference < 0) ? -rotationSpeed : rotationSpeed;
  return delta * game.time.elapsed;
}


export function turnToFace(game, obj1, obj2, rotationSpeed) {
  const targetAngle = game.math.angleBetween(obj1.x, obj1.y, obj2.x, obj2.y);
  obj1.rotation = targetAngle;
  // const rotateDiff = turnToAngle(game, obj1.body.rotation, targetAngle, rotationSpeed);
  // console.log(rotateDiff);
  //
  // obj1.rotation += rotateDiff;
}
