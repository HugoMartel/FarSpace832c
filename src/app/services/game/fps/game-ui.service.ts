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
  hasShot:boolean;
  displayUI:Function;
  changeWeapon:Function;

  constructor() {
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
    this.currentWeapon.stretch = GUI.Image.STRETCH_UNIFORM;

    this.currentWeaponId = 0;
    this.currentWeaponAnimationFrames = 3;
    //select the cell in the animation we want to display when not shooting
    this.currentWeapon.cellId = this.currentWeaponId * 10;


    /**
     * Display the UI on the 3D scene
     */
    this.displayUI = (player: GamePlayerService) => {
      let ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true);
      ui.idealWidth = 1795;
      ui.idealHeight = 1009;

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

      // Init life and ammo
      //TODO

      //first layer of hud
      let hudWindow:GUI.Image = new GUI.Image("hudWindow", "assets/hud/statusBackground.png");
      hudWindow.width = "250px";
      hudWindow.height = "300px";
      hudWindow.top = "410px";
      hudWindow.left = "773px";
      ui.addControl(hudWindow);
      let hudWindow2:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow2.width = "250px";
      hudWindow2.height = "300px";
      hudWindow2.top = "410px";
      hudWindow2.left = "524px";
      ui.addControl(hudWindow2);
      let hudWindow3:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow3.width = "250px";
      hudWindow3.height = "300px";
      hudWindow3.top = "410px";
      hudWindow3.left = "275px";
      ui.addControl(hudWindow3);
      let hudWindow4:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow4.width = "250px";
      hudWindow4.height = "300px";
      hudWindow4.top = "410px";
      hudWindow4.left = "26px";
      ui.addControl(hudWindow4);
      let hudWindow5:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow5.width = "250px";
      hudWindow5.height = "300px";
      hudWindow5.top = "410px";
      hudWindow5.left = "-223px";
      ui.addControl(hudWindow5);
      let hudWindow6:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow6.width = "250px";
      hudWindow6.height = "300px";
      hudWindow6.top = "410px";
      hudWindow6.left = "-472px";
      ui.addControl(hudWindow6);
      let hudWindow7:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow7.width = "250px";
      hudWindow7.height = "300px";
      hudWindow7.top = "410px";
      hudWindow7.left = "-721px";
      ui.addControl(hudWindow7);
      let hudWindow8:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusBackground.png");
      hudWindow8.width = "250px";
      hudWindow8.height = "300px";
      hudWindow8.top = "410px";
      hudWindow8.left = "-970px";
      ui.addControl(hudWindow8);

      //ammo 
      let ammoWindow:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusClear.png");
      ammoWindow.width = "269px";
      ammoWindow.height = "275px";
      ammoWindow.top = "410px";
      ammoWindow.left = "-764px";
      ui.addControl(ammoWindow);
      let ammoPercent:GUI.TextBlock = new GUI.TextBlock("ammotext", "AMMO");
      ammoPercent.width = "269px";
      ammoPercent.height = "275px";
      ammoPercent.top = "410px";
      ammoPercent.left = "-764px";
      ammoPercent.fontFamily = "DooM";
      ammoPercent.color = "#e10101";
      ammoPercent.fontSize = "45px";
      ui.addControl(ammoPercent);

      //health 
      let healthWindow:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusClear.png");
      healthWindow.width = "359px";
      healthWindow.height = "275px";
      healthWindow.top = "410px";
      healthWindow.left = "-430px";
      ui.addControl(healthWindow);
      let healthPercent:GUI.TextBlock = new GUI.TextBlock("healthtext", "HEALTH");
      healthPercent.width = "359px";
      healthPercent.height = "275px";
      healthPercent.top = "410px";
      healthPercent.left = "-430px";
      healthPercent.fontFamily = "DooM";
      healthPercent.color = "#e10101";
      healthPercent.fontSize = "45px";
      ui.addControl(healthPercent);

      //weapon selection 
      let weaponWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusClear.png");
      weaponWindow.width = "179px";
      weaponWindow.height = "275px";
      weaponWindow.top = "410px";
      weaponWindow.left = "-140px";
      ui.addControl(weaponWindow);

      //robot cam
      let robotWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/robotCam.png");
      robotWindow.width = "179px";
      robotWindow.height = "275px";
      robotWindow.top = "410px";
      robotWindow.left = "60px";
      ui.addControl(robotWindow);

      //armor window
      let armorWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusClear.png");
      armorWindow.width = "359px";
      armorWindow.height = "275px";
      armorWindow.top = "410px";
      armorWindow.left = "350x";
      ui.addControl(armorWindow);
      let armorPercent:GUI.TextBlock = new GUI.TextBlock("healthtext", "ARMOR");
      armorPercent.width = "359px";
      armorPercent.height = "275px";
      armorPercent.top = "410px";
      armorPercent.left = "350px";
      armorPercent.fontFamily = "DooM";
      armorPercent.color = "#e10101";
      armorPercent.fontSize = "45px";
      ui.addControl(armorPercent);

      //inventory window
      let inventoryWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusClear.png");
      inventoryWindow.width = "89px";
      inventoryWindow.height = "275px";
      inventoryWindow.top = "410px";
      inventoryWindow.left = "594px";
      ui.addControl(inventoryWindow);

      //amo window
      let amoWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusClear.png");
      amoWindow.width = "359px";
      amoWindow.height = "275px";
      amoWindow.top = "410px";
      amoWindow.left = "838px";
      ui.addControl(amoWindow);
      

    }

    /**
     * function to display the pistol need to create a new one for every weapon in particular for one handed weapon and two handed weapon
     * @param id weapon id to change to
     */
    this.changeWeapon = (id:number) => {
      //select the line in the file we want to display
      this.currentWeaponId = id;
      switch (id) {
        case 0:
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
        case 1:
          this.currentWeapon.cellId = 10;
          this.currentWeaponAnimationFrames = 5;
          break;
        case 2:
          this.currentWeapon.cellId = 20;
          this.currentWeaponAnimationFrames = 5;
          break;
        case 3:
          this.currentWeapon.cellId = 30;
          this.currentWeaponAnimationFrames = 9;
          break;
        case 4:
          this.currentWeapon.cellId = 40;
          this.currentWeaponAnimationFrames = 2;
          break;
        case 5:
          this.currentWeapon.cellId = 50;
          this.currentWeaponAnimationFrames = 2;
          break;
        case 6:
          this.currentWeapon.cellId = 60;
          this.currentWeaponAnimationFrames = 3;
          break;
        default:
          this.currentWeapon.cellId = 0;
          this.currentWeaponAnimationFrames = 3;
          break;
      }

    };

  }

}

