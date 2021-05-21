import * as BABYLON from '@babylonjs/core';

export function distance(pos1: BABYLON.Vector3, pos2: BABYLON.Vector3){
  let result = Math.hypot(pos1.x - pos2.x, pos1.z - pos2.z);
  return result;
}

export function computeAngle(origin: BABYLON.Vector3, target: BABYLON.Vector3){
  let xdiff = target.x - origin.x;
  let zdiff = target.z - origin.z;
  let d = Math.sqrt((xdiff * xdiff) + (zdiff * zdiff));
  if(d == 0) d = 0.0000000000001;
  let angle = Math.acos(xdiff / d);
  if(Math.asin(zdiff / d) < 0) angle *= -1;
  return angle;
}
