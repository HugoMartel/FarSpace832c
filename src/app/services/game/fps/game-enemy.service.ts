import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
@Injectable({ providedIn: 'root' })

export class GameEnemyService {
  coord: Array<number>;
  health: number;
  type: number;
  state: number;
  sprtMng: BABYLON.SpriteManager | undefined;
  sprt : BABYLON.Sprite | undefined;
  mesh: BABYLON.Mesh | undefined;
  init: Function;
  setup: Function;

  constructor(c: Array<number>, @Inject(Number) private h: number, @Inject(Number) private t: number, @Inject(Number) private s: number) { 
    this.coord = c;
    this.health = h;
    this.type = t;
    //STATE: 0 = sleep
    //       1 = ambush
    //       2 = death
    //       3 = attack missil
    //       4 = attack near
    //       5 = chasing 
    this.state = s;

    this.setup = (scene: BABYLON.Scene) => {
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 1}, scene);
      this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/error.jpg", 3, {height: 64, width: 40}, scene);
    }
    //init the mesh and adding missing sprite:
    this.init = (scene : BABYLON.Scene) => {
      //setting up the mesh
      this.setup(scene);
      if(this.mesh !== undefined && this.sprtMng !== undefined){
        let enemyMat1 = new BABYLON.StandardMaterial("Emat", scene);
        enemyMat1.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
        enemyMat1.specularPower = 64;
        enemyMat1.alpha = 0;
        this.mesh.position = new BABYLON.Vector3(this.coord[0], 0.5, this.coord[1]);
        this.mesh.checkCollisions = true;
        this.mesh.material = enemyMat1;
        this.sprt = new BABYLON.Sprite("impp", this.sprtMng);
        this.sprt.position = this.mesh.position;
        this.sprt.isPickable = true;
        this.mesh.checkCollisions = true;
        this.mesh.material = enemyMat1;
      }
    }
  }
}
