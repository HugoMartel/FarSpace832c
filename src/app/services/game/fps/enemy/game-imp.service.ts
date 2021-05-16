import { Injectable, Inject } from '@angular/core';
import { GameEnemyService } from '../game-enemy.service';
import { GameFireballService } from '../attacks/game-fireball.service';
import * as BABYLON from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GameImpService extends GameEnemyService {
  sprtMng!:BABYLON.SpriteManager;
  mesh!:BABYLON.Mesh;
  stateFrames: Array<Array<number>>;
  attack: Function;
  
  /**
   * Constructor of the Imp Service
   * @param position spawn position of the imp
   * @param sec starting state of the imp
   * @param scene 
   */
  constructor(position: Array<number>, @Inject(Number) private sec: number) { 
    //10 = life, sec = state, scene obvious
    super(position, 10, 1, sec);
    this.stateFrames = [
      [0, 3],   //sleep
      [12, 15], //ambush
      [7, 11],  //death
      [4, 6],   //attack missile
      [4, 6],   //attack melee,
      [0, 3]    //chasing
    ];

    /**
     * Function to call when the Babylon scene is created so that the imp textures can be added
     * @param scene Babylon scene
     */
    this.setup = (scene: BABYLON.Scene):void => {
      this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/Enemy/AllImpAnimation.png", 3, {height: 65, width: 65}, scene);
      this.sprtMng.isPickable = true;
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 1}, scene);//! wtf is it attached to anything ????
    }
    
    /**
     * Function to call when the imp will enter his attack states
     * @param enemyCoord Coords of the attacked enemy (the player or another mob)
     * @param scene Babylon scene associated with the game
     */
    this.attack = (enemyCoord : Array<number>, scene: BABYLON.Scene):void => {
      //long range attack
      if (this.state === 3){
        this.projectile = new GameFireballService([this.coord[0]+1, this.coord[1]+1], enemyCoord,scene);
      }

      //close range attack
      else if (this.state === 4){
        //TODO
      }

    }
  }
}
