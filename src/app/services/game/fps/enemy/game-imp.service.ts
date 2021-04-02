import { Injectable, Inject } from '@angular/core';
import { GameEnemyService } from '../game-enemy.service';
import * as BABYLON from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GameImpService extends GameEnemyService {
  
  constructor(position: Array<number>, @Inject(Number) private sec: number) { 
    //c = coord, 10 = life, sec = state, scene obvious
    super(position, 10, 1, sec);
    this.stateFrames = [
      [0, 3], //sleep
      [12, 15], //ambush
      [7, 11], //death
      [4, 6], //attack missil
      [4, 6], //Attack near,
      [0, 3] //chasing
    ];
    this.setup = (scene: BABYLON.Scene) => {
      //TOCHANGE
      this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/Enemy/AllImpAnimation.png", 3, {height: 65, width: 65}, scene);
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 1}, scene); 
    }
  }
}
