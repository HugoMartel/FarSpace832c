import { Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';


@Injectable({
  providedIn: 'root'
})
export class GameUIService {
  currentWeapon:GUI.Image;
  currentWeaponId:number;
  currentWeaponAnimationFrames:number;
  hasShot:boolean;
  displayUI:Function;
  changeWeapon:Function;

  constructor() {
    this.hasShot = false;
    this.currentWeapon = new GUI.Image("but", "assets/textures/weapons.png");
    //width and height of the sprite
    this.currentWeapon.width = "700px";
    this.currentWeapon.height = "350px";
    //postion on the screen (don't forget that a part of the hand is under the interface)
    this.currentWeapon.top = "10%";
    //setting the height and width of cells height:192 width:384
    this.currentWeapon.cellHeight = 192;
    this.currentWeapon.cellWidth = 384;

    this.currentWeaponId = 0;
    this.currentWeaponAnimationFrames = 3;
    //select the cell in the animation we want to display when not shooting
    this.currentWeapon.cellId = this.currentWeaponId * 18;


    /**
     * Display the UI on the 3D scene
     */
    this.displayUI = () => {
      let ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true);
      ui.idealWidth = 1795;
      ui.idealHeight = 897;

      // Init crosshair
      let crosshairVerticalRect:GUI.Rectangle = new GUI.Rectangle("crosshairVerticalRect");
      crosshairVerticalRect.width = "4px";
      crosshairVerticalRect.height = "24px";
      crosshairVerticalRect.color = "#30cc48";
      crosshairVerticalRect.background = "#30cc48";
      ui.addControl(crosshairVerticalRect);
      let crosshairHorizontalRect:GUI.Rectangle = new GUI.Rectangle("crosshairHorizontalRect");
      crosshairHorizontalRect.width = "24px";
      crosshairHorizontalRect.height = "4px";
      crosshairHorizontalRect.color = "#30cc48";
      crosshairHorizontalRect.background = "#30cc48";
      ui.addControl(crosshairHorizontalRect);


      // Init life and ammo
      //TODO

      // Init robot cam
      //? TODO

      //this will init the chosen weapon
      //TODO: add the texture for all weapon and create display function
      switch (this.currentWeaponId) {
        case 0:
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
        case 1:
          this.currentWeapon.cellId = 18;
          this.currentWeaponAnimationFrames = 5;
          break;
        case 2:
          this.currentWeapon.cellId = 36;
          this.currentWeaponAnimationFrames = 5;
          break;
        case 3:
          this.currentWeapon.cellId = 54;
          this.currentWeaponAnimationFrames = 9;
          break;
        case 4:
          this.currentWeapon.cellId = 72;
          this.currentWeaponAnimationFrames = 2;
          break;
        case 5:
          this.currentWeapon.cellId = 90;
          this.currentWeaponAnimationFrames = 2;
          break;
        case 6:
          this.currentWeapon.cellId = 108;
          this.currentWeaponAnimationFrames = 3;
          break;
        default:
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
      }

      //add the weapon to the ui
      ui.addControl(this.currentWeapon);
    } 

    /**
     * function to display the pistol need to create a new one for every weapon in particular for one handed weapon and two handed weapon
     * @param id weapon id to change to
     */
    this.changeWeapon = (id:number) => {
      //select the line in the file we want to display
      this.currentWeaponId = id;
      switch (id) {
        /*
        case 0:
          this.displayFist(scene, camera, ui);
          break;
          */
        case 1:
          this.currentWeapon.cellId = 0;//! Will be replaced by width*weaponId
          this.currentWeaponAnimationFrames = 5;
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

    };

  }

}

