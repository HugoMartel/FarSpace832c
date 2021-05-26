import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GestionMeshLoaderService } from './gestion-mesh-loader.service';
import { GestionSlidesService } from './gestion-slides.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMousePickerService {

  private isPlacable: boolean = false;
  private lastPosX: number = 0;
  private lastPosY: number = 0;

  constructor(private gesMeLoadService: GestionMeshLoaderService, private gesSlidesService: GestionSlidesService) { }

  public addMouseListener(scene:BABYLON.Scene, matrix: number[][], buildList: number[][]) {

    /* Mouse event callback */
    let mouseEventCallback:(eventData: BABYLON.PointerInfo, eventState: BABYLON.EventState) => void;

    mouseEventCallback = (ptInfo:BABYLON.PointerInfo) => {
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
          this.gesMeLoadService.currentLevelMesh[0].position.x = this.lastPosX;
          this.gesMeLoadService.currentLevelMesh[0].position.z = this.lastPosY;
          this.gesMeLoadService.currentLevelMesh[0].position.y = matrix[this.lastPosX][this.lastPosY]+0.05;

          // Test if the module is placable at this position
          this.isPlacable = true;

          let dx:number = 0;
          let fx:number = 0;
          let dy:number = 0;
          let fy:number = 0;

          switch (buildList.length) {
            case 0:
              dx = -1;
              fx = 2;
              dy = -1;
              fy = 2;
              break;
            case 1:
              dx = -1;
              fx = 2;
              dy = -1;
              fy = 2;
              break;
            case 2:
              dx = -2;
              fx = 3;
              dy = -3;
              fy = 4;
              break;
            case 3:
              dx = -4;
              fx = 5;
              dy = -2;
              fy = 3;
              break;
            case 4:
              dx = -1;
              fx = 2;
              dy = -2;
              fy = 3;
              break;
          }

          for (let x = dx; x < fx; x++) {
            for (let y = dy; y < fy; y++) {
              if (this.lastPosX+x >= 0 && this.lastPosX+x < matrix.length && this.lastPosY+y >= 0 && this.lastPosY+y < matrix[0].length) {
                if (matrix[this.lastPosX][this.lastPosY] != matrix[this.lastPosX+x][this.lastPosY+y] || this.gesMeLoadService.buildingsMatrix[this.lastPosX+x][this.lastPosY+y]) {
                  this.isPlacable = false;
                }
              } else {
                this.isPlacable = false;
              }
            }
          }

          // Change the module color relative to its pacability
          let placableColor = new BABYLON.StandardMaterial("isPlacable", scene);
          this.isPlacable ? placableColor.ambientColor = new BABYLON.Color3(0, 1, 0) : placableColor.ambientColor = new BABYLON.Color3(1, 0, 0);

          this.gesMeLoadService.currentLevelMesh[0].getChildMeshes().forEach((element: any) => {
            console.log(typeof(element));
            element.isVisible = true;
            element.material = placableColor;
          });
        } else {
          this.gesMeLoadService.currentLevelMesh[0].getChildMeshes().forEach((element: any) => {
            element.isVisible = false;
          });
        }

      // Detect right click to place a module
      // ptInfo.event.button == 0   ----->    LeftClick
      //                        1   ----->    MiddleClick
      //                        2   ----->    RightClick
      } else if (ptInfo.type === BABYLON.PointerEventTypes.POINTERUP && ptInfo.event.button == 2) {
        if (this.isPlacable) {
          this.gesMeLoadService.loadBuilding(this.lastPosX, this.lastPosY, scene, matrix, buildList.length);
          if (buildList.length < 5)
            buildList.push([this.lastPosX, this.lastPosY]);

          scene.onPointerObservable.removeCallback(mouseEventCallback);
          this.gesSlidesService.displaySlides(scene);

          this.isPlacable = false;
        }

      }
    };

    /* Add the pointer event */
    scene.onPointerObservable.add(mouseEventCallback);

  }


  public buildingPlaced(scene:BABYLON.Scene) {
    // Show the slides
    this.gesSlidesService.displaySlides(scene);

    // remove the pointer event

  }

}
