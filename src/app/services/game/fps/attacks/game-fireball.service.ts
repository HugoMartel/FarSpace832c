import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import * as stuff from '../randomFunctions/random-functions.service'
import {GamePlayerService} from '../player/game-player.service';
//import { SSL_OP_NO_QUERY_MTU } from 'node:constants';
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
  toMove: Boolean;
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
    this.toMove = true;
    this.target = target;
    this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/Enemy/AllImpAnimation.png", 3, {height: 65, width: 65}, scene);
    this.sprt = new BABYLON.Sprite("fire", this.sprtMng);
    this.sprt.disposeWhenFinishedAnimating = false;
    this.sprt.position = new BABYLON.Vector3(spawnCoord[0], 1, spawnCoord[1]);
    this.sprt.playAnimation(19, 20, true, 100);
    //calculating angle;
    this.xdiff = target[0] - spawnCoord[0];
    this.ydiff = target[1] - spawnCoord[1];
    let d = Math.sqrt((this.xdiff * this.xdiff) + (this.ydiff * this.ydiff));
    if(d == 0) d = 0.0000000000001;
    this.angle = Math.acos(this.xdiff / d);
    if(Math.asin(this.ydiff / d) < 0) this.angle *= -1;

    this.move = (scene: BABYLON.Scene, player: GamePlayerService) => {
      if(!this.toMove) return;
      //checking collision:
      //if moving the sprite, and hitting the player
      else if(Math.sqrt(Math.pow(this.coord[0] - player.camera.position.x, 2) + Math.pow(this.coord[1] - player.camera.position.z, 2)) < 1.2){
        player.applyDamage(20);
        this.toMove = false;
        this.sprt.stopAnimation();
        let volume = 1 / stuff.distance(this.sprt.position ,player.camera.position);
        let sound = new BABYLON.Sound("music", "assets/sound/fps/enemies/imp/fireballHit.wav", scene, () => {
          sound.play();
        }, {
          loop: false,
          autoplay: false,
          volume: volume
        }); 
        this.sprt.disposeWhenFinishedAnimating = true;
        this.sprt.playAnimation(20, 23, false, 100);
      }
      else{
        let direction = new BABYLON.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle))
        let ray = new BABYLON.Ray(new BABYLON.Vector3(this.coord[0], 0.5, this.coord[1]), direction, 100);	
        let hit = scene.pickWithRay(ray);
        //if touching a wall 
        if(hit?.pickedMesh != null && hit?.pickedMesh.position.x != null && stuff.distance(hit?.pickedMesh.position, new BABYLON.Vector3(this.coord[0], 0.5, this.coord[1])) < 0.75){
          this.toMove = false;
          let volume = 1 / stuff.distance(hit?.pickedMesh?.position, this.sprt.position);
          let sound = new BABYLON.Sound("music", "assets/sound/fps/enemies/imp/fireballHit.wav", scene, () => {
            sound.play();
          }, {
            loop: false,
            autoplay: false,
            volume: volume
          }); 
          this.sprt.stopAnimation();
          this.sprt.disposeWhenFinishedAnimating = true;
          this.sprt.playAnimation(20, 23, false, 100);
        }
        //moving the mesh
        else{
          let speed = 0.1;
          this.coord[0] += speed * Math.cos(this.angle);
          this.coord[1] += speed * Math.sin(this.angle);
          //updating sprite coord:
          this.sprt.position = new BABYLON.Vector3(this.coord[0], 1, this.coord[1]);
        }
      }
      return;
    }
   }
}
