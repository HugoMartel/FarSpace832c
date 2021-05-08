import { Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import { Scene } from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';


@Injectable({
  providedIn: 'root'
})
export class GameUIService {
  displayUI:Function;
  displayPistol:Function;

  constructor() { 

    this.displayUI = (scene: BABYLON.Scene, camera: BABYLON.Camera, weaponId: number) => {
      let ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      //this will display the chosen weapon
      //TODO: add the texture for all weapon and create display function
      switch (weaponId) {
        /*
        case 0:
          this.displayFist(scene, camera, ui);
          break;
          */
        case 1:
          this.displayPistol(scene, camera, ui);
          break;
          /*
        case 2:
          this.displayShotgun(scene, camera, ui);
          break;
        case 3:
          this.displaySuperShotgun(scene, camera, ui);
          break;
        case 4:
          this.displayChaingun(scene, camera, ui);
          break;
        case 5:
          this.displayRocket(scene, camera, ui);
          break;
        case 6:
          this.displayPlasma(scene, camera, ui);
          break;
        case 7:
          this.displayBFG(scene, camera, ui);
          break;
        case 8:
          this.displayPlasma(scene, camera, ui);
          break;

        default:
          this.displayFist(scene, camera, ui);
          break;
          */
      }
    } 

    // function to display the pistol need to create a new one for every weapon in particular for one handed weapon and two handed weapon
    this.displayPistol = (scene : BABYLON.Scene, camera: BABYLON.Camera, ui: GUI.AdvancedDynamicTexture) => {
      let pistol = new GUI.Image("but", "assets/textures/weapons/firstPistol.png");
      //width and height of the sprite
      pistol.width = "350px";
      pistol.height = "350px";
      //postion on the screen (don't forget that a part of the hand is under the interface)
      pistol.top = "20%";
      pistol.left = "10%";
      //select the cell in the animation we want to display when not shooting
      pistol.cellId = 0;
      //setting the height and width of cells (usually in 128 px)
      pistol.cellHeight = 128;
      pistol.cellWidth = 128;

      //add the pistol to the ui
      ui.addControl(pistol);

      //This fonction is to play animation 
      /*  
      scene.registerBeforeRender(() => {
        if (pistol.cellId < 5) pistol.cellId++;
        else pistol.cellId = 0;
      })*/
    }
  }

}

