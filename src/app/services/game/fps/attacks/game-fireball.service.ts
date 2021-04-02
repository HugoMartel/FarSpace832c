import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
//TODO: create this shit

@Injectable({
  providedIn: 'root'
})
export class GameFireballService {
  coord: Array<number>;
  target: Array<number>
  state: number;
  xdiff: number;
  ydiff: number;
  angle: number;
  //note:
  //States:
  //  1 = moving
  //  0 exploading
  //  2 = finished, now we have to delete it

  sprtMng: BABYLON.SpriteManager | undefined;
  sprt: BABYLON.Sprite
  move: Function; 
  //mesh: BABYLON.Mesh | undefined;

  constructor(spawnCoord: Array<number>, target: Array<number>, scene: BABYLON.Scene) {
    this.coord = spawnCoord;
    this.state = 1;
    this.target = target;
    this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/Enemy/AllImpAnimation.png", 3, {height: 65, width: 65}, scene);
    this.sprt = new BABYLON.Sprite("fire", this.sprtMng);
    this.sprt.position = new BABYLON.Vector3(spawnCoord[0], 1, spawnCoord[1]);
    this.sprt.playAnimation(19, 20, true, 300);
    //calculating angle;
    this.xdiff = target[0] - spawnCoord[0];
    this.ydiff = target[1] - spawnCoord[1];
    let d = Math.sqrt((this.xdiff * this.xdiff) + (this.ydiff * this.ydiff));
    if(d == 0) d = 0.0000000000001;
    this.angle = Math.acos(this.xdiff / d);
    if(Math.asin(this.ydiff / d) < 0) this.angle *= -1;

    this.move = () => {
      //TODO: add a way to check if collision and a stop etc
      let speed = 0.1;
      this.coord[0] += speed * Math.cos(this.angle);
      this.coord[1] += speed * Math.sin(this.angle);
      //updating sprite coord:
      this.sprt.position = new BABYLON.Vector3(this.coord[0], 1, this.coord[1]);
      return;
    }
   }
}
