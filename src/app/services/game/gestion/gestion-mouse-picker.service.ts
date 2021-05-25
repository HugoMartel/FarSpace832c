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

  constructor(private gesMeLoadService: GestionMeshLoaderService, onEnd: Function) { }

  public addMouseListener(scene:BABYLON.Scene, matrix: any[], buildList: any[]) {
    /* Add the mouse events */
    scene.onPointerObservable.add((ptInfo:BABYLON.PointerInfo) => {
      ptInfo.event.preventDefault();
      // Detect the event type and if the input is a left click
      //! BABYLON.PointerInput.LeftClick means right click...)
      if (ptInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        this.isPlacable = false;
        let pickInfo:BABYLON.PickingInfo|null = scene.pick(scene.pointerX, scene.pointerY, undefined);
        if (pickInfo !== null && pickInfo.hit && pickInfo.pickedMesh !== null && pickInfo.pickedMesh.metadata == "ground") {

          // Get the last mouse position in memory to load the module in the correct position
          this.lastPosX = pickInfo.pickedMesh.position.x;
          this.lastPosY = pickInfo.pickedMesh.position.z;

          // Save the mouse position for the mesh
          this.gesMeLoadService.baseMeshes[buildList.length].position.x = this.lastPosX;
          this.gesMeLoadService.baseMeshes[buildList.length].position.z = this.lastPosY;
          this.gesMeLoadService.baseMeshes[buildList.length].position.y = matrix[this.lastPosX][this.lastPosY]+0.05;

          // Test if the module is placable at this position
          this.isPlacable = true;
          for (let x = -1; x < 2; x++) {
            for (let y = -1; y < 2; y++) {
              if (matrix[this.lastPosX][this.lastPosY] != matrix[this.lastPosX+x][this.lastPosY+y] || this.gesMeLoadService.buildingsMatrix[this.lastPosX+x][this.lastPosY+y]) {
                this.isPlacable = false;
              }
            }
          }

          // Change the module color relative to its pacability
          let placableColor = new BABYLON.StandardMaterial("isPlacable", scene);
          this.isPlacable ? placableColor.ambientColor = new BABYLON.Color3(0, 1, 0) : placableColor.ambientColor = new BABYLON.Color3(1, 0, 0);

          this.gesMeLoadService.baseMeshes[buildList.length].getChildMeshes().forEach((element: any) => {
            element.isVisible = true;
            element.material = placableColor;
          });
      }else {
        this.gesMeLoadService.baseMeshes[buildList.length].getChildMeshes().forEach((element: any) => {
          element.isVisible = false;
        });
      }

    // Detect right click to place a module
    } else if (ptInfo.type === BABYLON.PointerEventTypes.POINTERUP && ptInfo.event.button === 1) {
        if (this.isPlacable) {
          this.gesMeLoadService.baseMeshes[buildList.length].getChildMeshes().forEach((element: any) => {
            element.isVisible = true;
            element.material = null;
          });
          buildList.push([this.lastPosX, this.lastPosY]);
          if (this.gesMeLoadService.baseMeshes.length <= buildList.length) {
            
            
            //TODO display info on the module you just placed and switch to FPS when the info is done displaying
            /*
            onEnd();
            */



            buildList = [];
          }

          this.isPlacable = false;

        }

      }
    });
  }








}
