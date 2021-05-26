import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import "@babylonjs/loaders/glTF"; //don't forget to npm install
import { MatrixService } from './matrix.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMeshLoaderService {

  public buildingsMatrix: number[][] = [];

  public currentLevelMesh: BABYLON.AbstractMesh[] = [];

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
      case 2:
        modulePath = "assets/Blender/Download/uploads_files_2052536_buildings_3X/service_building_1_/service_building_/";
        moduleName = "prod_building_.glb";
        break;
      case 3:
        modulePath = "assets/Blender/My/Farm/";
        moduleName = "OrganicPlant.glb";
        break;
      case 4:
        modulePath = "assets/Blender/Download/uploads_files_2052536_buildings_3X/Office building/Office building/";
        moduleName = "habitat.glb";
        break;
    }

    BABYLON.SceneLoader.ImportMesh("", modulePath, moduleName, scene, (newMeshes) => {
      newMeshes[0].getChildMeshes().forEach(element => {
        element.isVisible = false;
        element.isPickable = false;
      });
      newMeshes[0].metadata = "module";
      this.currentLevelMesh.push(newMeshes[0]);
      onSuccess();
    });
  }

  public loadBuilding(posX: number, posY: number, scene: BABYLON.Scene, matrix: number[][], moduleIndex: number) {
    let modulePath:string = "assets/Blender/My/1stQG/";
    let moduleName:string = "1stQG.glb";
    switch (moduleIndex) {
      case 0:
        modulePath = "assets/Blender/My/1stQG/";
        moduleName = "1stQG.glb";
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            this.buildingsMatrix[posX+x][posY+y] = 1;
          }
        }
        break;
      case 1:
        modulePath = "assets/Blender/My/RTG_Power_Plant/";
        moduleName = "RTG_Power_Plant.glb";
        for (let x = -1; x < 2; x++) {
          for (let y = -1; y < 2; y++) {
            this.buildingsMatrix[posX+x][posY+y] = 1;
          }
        }
        break;
      case 2:
        modulePath = "assets/Blender/Download/uploads_files_2052536_buildings_3X/service_building_1_/service_building_/";
        moduleName = "prod_building_.glb";
        for (let x = -2; x < 3; x++) {
          for (let y = -3; y < 4; y++) {
            this.buildingsMatrix[posX+x][posY+y] = 1;
          }
        }
        break;
      case 3:
        modulePath = "assets/Blender/My/Farm/";
        moduleName = "OrganicPlant.glb";
        for (let x = -4; x < 5; x++) {
          for (let y = -2; y < 3; y++) {
            this.buildingsMatrix[posX+x][posY+y] = 1;
          }
        }
        break;
      case 4:
        modulePath = "assets/Blender/Download/uploads_files_2052536_buildings_3X/Office building/Office building/";
        moduleName = "habitat.glb";
        for (let x = -1; x < 2; x++) {
          for (let y = -2; y < 3; y++) {
            this.buildingsMatrix[posX+x][posY+y] = 1;
          }
        }
        break;
    }
    BABYLON.SceneLoader.ImportMesh("", modulePath, moduleName, scene, (newMeshes) => {
      newMeshes[0].position.x = posX;
      newMeshes[0].position.z = posY;
      newMeshes[0].position.y = matrix[posX][posY]+0.05;
      newMeshes[0].metadata = moduleName;
    });
  }

  public setupPlacedModules(listBuild: number [][], scene: BABYLON.Scene, matrix: number[][]) {
    for (let i = 0; i < listBuild.length; i++) {
      this.loadBuilding(listBuild[i][0], listBuild[i][1], scene, matrix, i);
    }
  }

}
