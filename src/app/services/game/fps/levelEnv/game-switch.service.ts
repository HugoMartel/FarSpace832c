import { Injectable, Inject } from '@angular/core';
import * as BABYLON from '@babylonjs/core';

//TODO: add clean texture
@Injectable({
  providedIn: 'root'
})
export class GameSwitchService {
  type: number;
  state: boolean;
  coord: Array<number>;
  mesh!: BABYLON.Mesh;
  init: Function;
  on: Function;

  constructor(
    coordC: Array<number>, 
    @Inject(Number) private typeC: number
  ) {
    
    
    this.coord = coordC;
    this.state = false;
    this.type = typeC;
    this.init = (scene: BABYLON.Scene) => {
      this.mesh = BABYLON.MeshBuilder.CreateBox("switch", {size :1, height: 5}, scene);
      this.mesh.checkCollisions = true;
      this.mesh.isPickable = true;
      let material = new BABYLON.StandardMaterial("testMat", scene);
      material.diffuseTexture = new BABYLON.Texture("assets/textures/misc/switchOff.png", scene);
      this.mesh.material = material;
    }
    this.on = () => {
      //giving hugo this
      if(!this.state){
        this.state = true;
        switch (this.type){
          //end of level:
          case 0:
            console.log("alo comment je return un truc la ?");
            break;
          default:
            break;
        }
      }
    }
  }
}
