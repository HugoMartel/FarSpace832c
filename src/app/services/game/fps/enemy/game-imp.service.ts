import { Injectable, Inject } from '@angular/core';
import { GameEnemyService } from '../game-enemy.service';
import { GameFireballService } from '../attacks/game-fireball.service';
import { GamePlayerService } from '../player/game-player.service'
import * as BABYLON from '@babylonjs/core';
import * as stuff from '../randomFunctions/random-functions.service';

@Injectable({
  providedIn: 'root'
})
export class GameImpService extends GameEnemyService {
  sprtMng!:BABYLON.SpriteManager;
  mesh!:BABYLON.Mesh;
  stateFrames: Array<Array<number>>;  
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
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 0.5}, scene);//! wtf is it attached to anything ????
      this.mesh.metadata = "enemy";
      this.mesh.isPickable = true;
    }
    
    /**
     * Function to call when the imp will enter his attack states
     * @param player: the player
     * @param scene Babylon scene associated with the game
     */
    this.attackFar = (player: GamePlayerService, scene: BABYLON.Scene) => {
      let volume = 1 / stuff.distance(player.camera.position, this.sprt.position); 
      this.projectile = new GameFireballService([this.sprt.position.x + 1 * Math.cos(this.angle), this.sprt.position.z + 1 * Math.sin(this.angle)], [player.camera.position.x, player.camera.position.z], scene);
      let sound = new BABYLON.Sound("music", "../../../assets/sound/fps/enemies/imp/attackFar.wav", scene, () => {
        sound.play();
      }, {
        loop: false,
        autoplay: false,
        volume: volume
      }); 
    }
    /**
    * Function to call when the imp will enter his attack states
    * @param player: the player
    * @param scene Babylon scene associated with the game
    */
    this.attackNear = (player: GamePlayerService, scene: BABYLON.Scene) => {
      player.applyDamage(10);
      //playing sound:
      let sound = new BABYLON.Sound("music", "../../../assets/sound/fps/enemies/imp/attackNear.wav", scene, () => {
        sound.play();
      }, {
        loop: false,
        autoplay: false,
        volume: 0.6
      }); 
    }
  }
}
