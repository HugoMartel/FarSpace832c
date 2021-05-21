import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GestionMeshLoaderService } from './gestion-mesh-loader.service';

@Injectable({
  providedIn: 'root'
})
export class GestionMousePickerService {

  constructor(private gesMeLoadService: GestionMeshLoaderService) { }

  public addMouseListener(scene:BABYLON.Scene, matrix: any[]) {
    /* Add the mouse events */
    scene.onPointerObservable.add((ptInfo:BABYLON.PointerInfo) => {
      ptInfo.event.preventDefault();
      // Detect the event type and if the input is a left click
      //! BABYLON.PointerInput.LeftClick means right click...)
      if (ptInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
        let pickInfo:BABYLON.PickingInfo|null = scene.pick(scene.pointerX, scene.pointerY, undefined);
        if (pickInfo !== null && pickInfo.hit && pickInfo.pickedMesh !== null) {
          //console.log(pickInfo.pickedMesh.position.y*2);
          if (pickInfo.pickedMesh.metadata == "ground") {

            let pasContent = new BABYLON.StandardMaterial("pasContent", scene);
            pasContent.ambientColor = new BABYLON.Color3(1, 0, 0);
            let content = new BABYLON.StandardMaterial("content", scene);
            content.ambientColor = new BABYLON.Color3(0, 1, 0);


            this.gesMeLoadService.baseMeshes[0].position.x = pickInfo.pickedMesh.position.x;
            this.gesMeLoadService.baseMeshes[0].position.z = pickInfo.pickedMesh.position.z;
            this.gesMeLoadService.baseMeshes[0].position.y = matrix[pickInfo.pickedMesh.position.x][pickInfo.pickedMesh.position.z]+0.05;
            this.gesMeLoadService.baseMeshes[0].getChildMeshes().forEach((element: any) => {
              element.isVisible = true;
              element.material = content;
            });

          }else {
            this.gesMeLoadService.baseMeshes[0].getChildMeshes().forEach((element: any) => {
              element.isVisible = false;
            });
          }
        }else {
          this.gesMeLoadService.baseMeshes[0].getChildMeshes().forEach((element: any) => {
            element.isVisible = false;
          });
        }
      } else if (ptInfo.type === BABYLON.PointerEventTypes.POINTERUP && ptInfo.event.button === 0) {

      }
    });
  }








}
