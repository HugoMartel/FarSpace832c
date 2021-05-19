import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GamePlayerService } from '../player/game-player.service'
import * as stuff from '../randomFunctions/random-functions.service'
@Injectable({
  providedIn: 'root'
})

//TODO: add sound & add event checker

export class GameDoorsService {
  coord : Array<number>;
  key : number;
  env: number
  rotate: boolean;
  switchNeeded: boolean;
  mesh!: BABYLON.Mesh;
  state: boolean
  toOpen: boolean;
  toClose: boolean;
  counterSinceOpened: number;
  init: Function;
  open: Function;
  closeSound: Function;
  openSound: Function;
  /*
  * +-----------------+--------------------------------------+
  * | class component |               content                |
  * +-----------------+--------------------------------------+
  * | coord           | [x, z]                               |
  * | key             | -1 if no key needed, else 0, 1 or 2  |
  * | rotate          | boolean                              |
  * | switch          | false if no switch needed, else true |
  * | state           | true if open, false if closed        |
  * | toOpen          | explicit, true or false              |
  * | toClose         | same ^                               |
  * +-----------------+--------------------------------------+
  */

  constructor(coordC: Array<number>, @Inject(Number) private keyC:number, @Inject(Boolean) private switchNeededC: boolean, @Inject(Boolean) private rotateC: boolean, @Inject(Number) private envC: number) {
    this.coord = coordC;
    this.env = envC;
    this.key = keyC;
    this.switchNeeded = switchNeededC;
    this.rotate = rotateC;
    this.toOpen = false;
    this.toClose = false;
    this.state = false;
    this.counterSinceOpened = 0;

    this.init = (scene: BABYLON.Scene) => {
      this.mesh = BABYLON.MeshBuilder.CreateBox("door", {depth: 0.25, width :3, height :3}, scene);
      this.mesh.metadata = "door";
      let material = new BABYLON.StandardMaterial("doorMat", scene);
      switch(this.env) {
        default:
          material.diffuseTexture = new BABYLON.Texture("assets/textures/misc/door1.jpg", scene);
          break;
        case 1:
          material.diffuseTexture = new BABYLON.Texture("assets/textures/misc/door1.jpg", scene);
          break;
        case 2:
          material.diffuseTexture = new BABYLON.Texture("assets/textures/misc/door2.jpeg", scene);
          break;
      }
      this.mesh.material = material;
      this.mesh.position.x = this.coord[0];
      this.mesh.position.z = this.coord[1];
      this.mesh.position.y = 1;
      this.mesh.checkCollisions = true;
      this.mesh.isPickable = true;
      if(this.rotate) this.mesh.rotation.y += Math.PI / 2
    }

    this.open = (coords: BABYLON.Vector3, keys: Array<boolean>, scene: BABYLON.Scene) => {
      let distance = Math.sqrt(Math.pow(this.mesh.position.x - coords.x, 2) + Math.pow(this.mesh.position.z - coords.z , 2));
      if(distance > 3) return;
      //tODO: add switch:
      else if(this.switchNeeded) return;
      //TODO: add message for the player
      else if(this.key != -1 && !keys[this.key]) return;
      //else opening the door
      else{
        this.toOpen = true;
      }
    }
    this.closeSound = (scene: BABYLON.Scene, player: GamePlayerService) => {
      let volume = 1 / stuff.distance(player.camera.position, this.mesh.position);  
      let sound = new BABYLON.Sound("music", "../../../assets/sound/fps/doors/longDoorClosing.wav", scene, () => {
        sound.play();
      }, {
        loop: false,
        autoplay: false,
        volume: volume
      }); 
    }

    this.openSound = (scene: BABYLON.Scene, player: GamePlayerService) => {
      let sound = new BABYLON.Sound("music", "../../../assets/sound/fps/doors/longDoorOpening.wav", scene, () => {
        sound.play();
      }, {
        loop: false,
        autoplay: false,
        volume: 0.6
      });
    }
  }
}
