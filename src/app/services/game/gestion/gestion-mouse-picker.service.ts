import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GestionMeshLoaderService } from './gestion-mesh-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMousePickerService {

  private isPlacable: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  constructor(private gesMeLoadService: GestionMeshLoaderService) { }

  public addMouseListener(scene:BABYLON.Scene, matrix: any[]) {
    /* Add the mouse events */
    scene.onPointerObservable.add((ptInfo:BABYLON.PointerInfo) => {
      ptInfo.event.preventDefault();
      // Detect the event type and if the input is a left click
      //! BABYLON.PointerInput.LeftClick means right click...)
      if (ptInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        this.isPlacable = false;
        let pickInfo:BABYLON.PickingInfo|null = scene.pick(scene.pointerX, scene.pointerY, undefined);
        if (pickInfo !== null && pickInfo.hit && pickInfo.pickedMesh !== null && pickInfo.pickedMesh.metadata == "ground") {

          this.lastPosX = pickInfo.pickedMesh.position.x;
          this.lastPosY = pickInfo.pickedMesh.position.z;

          this.gesMeLoadService.baseMeshes[0].position.x = this.lastPosX;
          this.gesMeLoadService.baseMeshes[0].position.z = this.lastPosY;
          this.gesMeLoadService.baseMeshes[0].position.y = matrix[this.lastPosX][this.lastPosY]+0.05;

          this.isPlacable = true;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              if (matrix[this.lastPosX][this.lastPosY] != matrix[this.lastPosX+x][this.lastPosY+y]) {
                this.isPlacable = false;
              }
            }
          }

          let placableColor = new BABYLON.StandardMaterial("isPlacable", scene);
          this.isPlacable ? placableColor.ambientColor = new BABYLON.Color3(0, 1, 0) : placableColor.ambientColor = new BABYLON.Color3(1, 0, 0);

          this.gesMeLoadService.baseMeshes[0].getChildMeshes().forEach((element: any) => {
            element.isVisible = true;
            element.material = placableColor;
          });
      }else {
        this.gesMeLoadService.baseMeshes[0].getChildMeshes().forEach((element: any) => {
          element.isVisible = false;
        });
      }
    } else if (ptInfo.type === BABYLON.PointerEventTypes.POINTERUP && ptInfo.event.button === 0) {
        if (this.isPlacable) {
          this.gesMeLoadService.load1stQG(this.lastPosX, this.lastPosY, scene, matrix);
          this.isPlacable = false;
        }
      }else {}
    });
  }








}
