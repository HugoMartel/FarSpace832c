import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF"; //don't forget to npm install --save-dev @babylonjs/core @babylonjs/loaders

@Injectable({
  providedIn: 'root'
})
export class GestionMeshLoaderService {
  constructor() { }


  public load1stQG(posX: number, posY: number, scene: any, matrix: any[]) {
    BABYLON.SceneLoader.ImportMesh("", "assets/Blender/My/1stQG/", "1stQG.glb", scene, (newMeshes) => {
      newMeshes[0].position.x = posX;
      newMeshes[0].position.z = posY;
      newMeshes[0].position.y = matrix[posX][posY];
      return newMeshes[0];
    });
  }

}
