import { Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { GamePlayerService } from './player/game-player.service';


@Injectable({
  providedIn: 'root'
})
export class GameUIService {
  currentWeapon:GUI.Image;
  currentWeaponId:number;
  currentWeaponAnimationFrames:number;
  swapSound:BABYLON.Sound;
  hasShot:boolean;
  displayUI:Function;
  changeWeapon:Function;

  constructor(scene: BABYLON.Scene) {
    this.hasShot = false;
    this.currentWeapon = new GUI.Image("weapons", "assets/textures/weapons.png");
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
    this.currentWeapon.cellId = 0;
    this.swapSound = new BABYLON.Sound("swapSound", "assets/sound/fps/weapon/swap.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });


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
        // Fist
        case 0:
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
        // Pistol
        case 1:
          this.currentWeapon.cellId = 10;
          this.currentWeaponAnimationFrames = 5;
          break;
        // Shotgun
        case 2:
          this.currentWeapon.cellId = 20;
          this.currentWeaponAnimationFrames = 5;
          break;
        // SSG
        case 3:
          this.currentWeapon.cellId = 30;
          this.currentWeaponAnimationFrames = 9;
          break;
        // Chaingun
        case 4:
          this.currentWeapon.cellId = 40;
          this.currentWeaponAnimationFrames = 2;
          break;
        // Plasma
        case 5:
          this.currentWeapon.cellId = 50;
          this.currentWeaponAnimationFrames = 2;
          break;
        // BFG
        case 6:
          this.currentWeapon.cellId = 60;
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
    this.changeWeapon = (id:number, player:GamePlayerService) => {
      //select the line in the file we want to display
      this.currentWeaponId = id;
      player.equippedWeapon = id;
      this.currentWeapon.cellId = 10 * id;

      switch (id) {
        case 0:
          this.currentWeaponAnimationFrames = 3;
          break;
        case 1:
          this.currentWeaponAnimationFrames = 5;
          break;
        case 2:
          this.currentWeaponAnimationFrames = 5;
          break;
        case 3:
          this.currentWeaponAnimationFrames = 9;
          break;
        case 4:
          this.currentWeaponAnimationFrames = 2;
          break;
        case 5:
          this.currentWeaponAnimationFrames = 2;
          break;
        case 6:
          this.currentWeaponAnimationFrames = 3;
          break;
        default:
          player.equippedWeapon = 0;
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
      }

    };

  }

}

