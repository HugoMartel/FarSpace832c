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

  public initMeshes(scene: any) {
    BABYLON.SceneLoader.ImportMesh("", "assets/Blender/My/1stQG/", "1stQG.glb", scene, (newMeshes) => {
      newMeshes[0].getChildMeshes().forEach(element => {
        element.isVisible = false;
        element.isPickable = false;
      });
        newMeshes[0].metadata = "base1stQG";
        this.baseMeshes.push(newMeshes[0]);
      });

  }

  public load1stQG(posX: number, posY: number, scene: any, matrix: any[]) {
    BABYLON.SceneLoader.ImportMesh("", "assets/Blender/My/1stQG/", "1stQG.glb", scene, (newMeshes) => {
      newMeshes[0].position.x = posX;
      newMeshes[0].position.z = posY;
      newMeshes[0].position.y = matrix[posX][posY]+0.05;
      newMeshes[0].metadata = "1stQG";
      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          this.buildingsMatrix[posX+x][posY+y] = 1;
        }
      }
    });
  }

}
