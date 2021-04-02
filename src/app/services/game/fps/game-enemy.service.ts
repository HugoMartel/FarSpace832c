import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
@Injectable({ providedIn: 'root' })

//TODO: add a way to change animation in function of the state
//TODO: add IA
//TODO: add attacks condition
//TODO: add pathfinding
//TODO: add a way to wake up from sleeping state
//TODO: add a way to pathfind

export class GameEnemyService {
  coord: Array<number>;
  health: number;
  type: number;
  state: number;
  sprtMng: BABYLON.SpriteManager | undefined;
  sprt : BABYLON.Sprite | undefined
  mesh: BABYLON.Mesh | undefined;
  init: Function;
  setup: Function;
  stateFrames: Array<Array<number>> | undefined;
  playAnimation : Function;
  //moveThorwardPlayer: Function;

  constructor(position: Array<number>, @Inject(Number) private healthbar: number, @Inject(Number) private typeEnemy: number, @Inject(Number) private status: number) { 
    this.coord = position;
    this.health = healthbar;
    this.type = typeEnemy;
    //STATE: 0 = sleep
    //       1 = ambush
    //       2 = death
    //       3 = attack missil
    //       4 = attack near
    //       5 = chasing

    this.state = status;
    console.log(this.state);
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
        this.sprt = new BABYLON.Sprite("lmao", this.sprtMng);
        //TODO: add way to change sprite in function of the state cc Louis
        //for(let i = 0; i < )
        this.sprt.position = this.mesh.position;
        this.sprt.isPickable = true;
        this.mesh.checkCollisions = true;
        this.mesh.material = enemyMat1;
        //defining the frames to play in function of the state:
        //this.sprt.playAnimation(0, 23, true, 300);
      }
    }
    //LMAO NOT WORKING
    /*this.moveThorwardPlayer = (playerCoord: Array<number>) => {
      if(this.coord[0] < Math.round(playerCoord[0])){
        this.coord[0] += 0.01;
        if(this.sprt !== undefined) this.sprt.position.x += 0.01;
        if(this.mesh !== undefined) this.mesh.position.x += 0.01;
      }
      else if(this.coord[0] > Math.round(playerCoord[0])){
        this.coord[0] -= 0.01;
        if(this.sprt !== undefined) this.sprt.position.x -= 0.01;
        if(this.mesh !== undefined) this.mesh.position.x -= 0.01;
      }
      if(this.coord[1] < Math.round(playerCoord[1])){
        this.coord[1] += 0.01;
        if(this.sprt !== undefined) this.sprt.position.z += 0.01;
        if(this.mesh !== undefined) this.mesh.position.z += 0.01;
      }
      else if(this.coord[1] > Math.round(playerCoord[1])){
        this.coord[1] -= 0.01;
        if(this.sprt !== undefined) this.sprt.position.z -= 0.01;
        if(this.mesh !== undefined) this.mesh.position.z -= 0.01;
      }
    }*/
    //TODO: add description
    this.playAnimation = () => {
      if(this.stateFrames === undefined || this.sprt === undefined) return;
      let loop = true;
      //if the status is death, attack near or attack far, then no looping
      if(this.state == 2 || this.state == 3 || this.status == 4) loop = false;
      //playing the animation
      this.sprt.playAnimation(this.stateFrames[this.state][0], this.stateFrames[this.state][1], loop, 300, () => {
        if(this.state == 3 || this.state == 4){
          this.state = 5;
          this.playAnimation();
        }
      });
    }
  }
}
