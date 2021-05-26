import { Injectable, Inject } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
@Injectable({
  providedIn: 'root'
})
export class GameSwitchService {
  type: number;
  state: boolean;
  coord: Array<number>;
  mesh!: BABYLON.Mesh;
  topMesh!: BABYLON.Mesh;
  init: Function;
  on: Function;

  constructor(
    coordC: Array<number>, 
    @Inject(Number) private typeC: number,
    onWin: Function
  ) {
    // Init the switch object's properties
    this.coord = coordC;
    this.state = false;
    this.type = typeC;

    // Mesh creation on init
    this.init = (scene: BABYLON.Scene) => {
      this.mesh = BABYLON.MeshBuilder.CreateBox("switch", {size :1, height: 1}, scene);
      //adding a infinite tall mesh on top of the crate to allow the picking with ray without issue (the ray passing above the mesh)
      this.topMesh = BABYLON.MeshBuilder.CreateBox("switchInfinite", {size: 1, height: 2}, scene);
      this.topMesh.position = new BABYLON.Vector3(this.coord[0], 2, this.coord[1]);
      this.topMesh.checkCollisions = true;
      this.topMesh.isPickable = true;
      this.topMesh.metadata = "switch";
      //adding a invisible mat
      let invisibleMat = new BABYLON.StandardMaterial("Emat", scene);
      invisibleMat.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
      invisibleMat.specularPower = 128;
      invisibleMat.alpha = 0;
      this.topMesh.material = invisibleMat;
      this.mesh.position = new BABYLON.Vector3(this.coord[0], 0.5, this.coord[1]);
      this.mesh.metadata = "switch";
      this.mesh.checkCollisions = true;
      this.mesh.isPickable = true;
      let material = new BABYLON.StandardMaterial("testMat", scene);
      material.diffuseTexture = new BABYLON.Texture("assets/textures/misc/crate.png", scene);
      this.mesh.material = material;
    }

    // Event handler
    this.on = () => {
      if (!this.state) {
        this.state = true;
        switch (this.type) {
          //end of level:
          case 0:
            onWin();
            break;
          default:
            break;
        }
      }
    }
  }
}
