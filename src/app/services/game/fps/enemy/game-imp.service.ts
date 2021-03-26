import { Injectable, Inject } from '@angular/core';
import { GameEnemyService } from '../game-enemy.service';
import * as BABYLON from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GameImpService extends GameEnemyService {
  
  constructor(c: Array<number>, @Inject(Number) private sec: number) { 
    //c = coord, 10 = life, sec = state, scene obvious
    super(c, 10, 1, sec);
    this.setup = (scene: BABYLON.Scene) => {
      //TOCHANGE
      this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/Enemy/smallImp.png", 3, {height: 64, width: 40}, scene);
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 1}, scene); 
    }
  }
}
