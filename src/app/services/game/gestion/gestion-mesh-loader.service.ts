import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF"; //don't forget to npm install
import { MatrixService } from './matrix.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMeshLoaderService {

  public buildingsMatrix: any[] = [];

  public baseMeshes: any[] = [];

  constructor(private matrixService: MatrixService) {}

  public initBuildingMatrix(size_x: number, size_y: number) {
    this.buildingsMatrix = this.matrixService.constructMatrix(size_x, size_y);
  }

  // Init the previsu
  public initMeshes(scene: BABYLON.Scene, moduleIndex: number, onSuccess: Function) {

    
    // Defaults to the first module
    let modulePath:string = "assets/Blender/My/1stQG/";
    let moduleName:string = "1stQG.glb";

    switch (moduleIndex) {
      case 0:
        modulePath = "assets/Blender/My/1stQG/";
        moduleName = "1stQG.glb";
        break;
      case 1:
        modulePath = "assets/Blender/My/RTG_Power_Plant/";
        moduleName = "RTG_Power_Plant.glb";
        break;
    }

    BABYLON.SceneLoader.ImportMesh("", modulePath, moduleName, scene, (newMeshes) => {//!ERROR
      // Callback called on mesh Load
      newMeshes[0].getChildMeshes().forEach(element => {
        element.isVisible = false;
        element.isPickable = false;
      });
      newMeshes[0].metadata = "module";
      this.baseMeshes.push(newMeshes[0]);
      
      onSuccess();

    });

  }

  public load1stQG(posX: number, posY: number, scene: any, matrix: any[], onSuccess: Function) {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        this.buildingsMatrix[posX+x][posY+y] = 1;
      }
    }

    BABYLON.SceneLoader.ImportMesh("", "assets/Blender/My/1stQG/", "1stQG.glb", scene, (newMeshes) => {
      newMeshes[0].position.x = posX;
      newMeshes[0].position.z = posY;
      newMeshes[0].position.y = matrix[posX][posY]+0.05;
      newMeshes[0].metadata = "1stQG";

      onSuccess();
    });
  }

  public loadRTG_Power_Plant(posX: number, posY: number, scene: any, matrix: any[], onSuccess: Function) {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        this.buildingsMatrix[posX+x][posY+y] = 1;
      }
    }
    BABYLON.SceneLoader.ImportMesh("", "assets/Blender/My/RTG_Power_Plant/", "RTG_Power_Plant.glb", scene, (newMeshes) => {
      // Callback called on mesh Load
      newMeshes[0].position.x = posX;
      newMeshes[0].position.z = posY;
      newMeshes[0].position.y = matrix[posX][posY]+0.05;
      newMeshes[0].metadata = "RTG_Power_Plant";

      onSuccess();
    });
  }

}
