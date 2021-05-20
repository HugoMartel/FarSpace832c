import { Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import { GamePlayerService } from './player/game-player.service';

import { MenuService } from '../../menu/menu.service';


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

  constructor(menuService: MenuService) {
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

      // font color : gris #969696   rouge #9a0101
      //ammo 
      let ammoWindow:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusCleaar.png");
      ammoWindow.width = "269px";
      ammoWindow.height = "275px";
      ammoWindow.top = "410px";
      ammoWindow.left = "-764px";
      ui.addControl(ammoWindow);
      let ammoPercent:GUI.TextBlock = new GUI.TextBlock("ammotext", "AMMO");
      ammoPercent.width = "269px";
      ammoPercent.height = "275px";
      ammoPercent.top = "460px";
      ammoPercent.left = "-764px";
      ammoPercent.fontFamily = "DooM";
      ammoPercent.color = "#969696";
      ammoPercent.fontSize = "35px";
      menuService.addShadow(ammoPercent);
      ui.addControl(ammoPercent);
      let ammoAmount = !player.equipedWeapon ? "" : (
        player.equipedWeapon == 1 || player.equipedWeapon == 4 ? player.ammos[1].toString() : (
          player.equipedWeapon == 2 || player.equipedWeapon == 3 ? player.ammos[2].toString() :
            player.ammos[4].toString()
        )
      );
      console.log(ammoAmount, player.ammos);
      let ammoValue:GUI.TextBlock = new GUI.TextBlock("armorValue", ammoAmount);
      ammoValue.width = "359px";
      ammoValue.height = "275px";
      ammoValue.top = "350px";
      ammoValue.left = "-764px";
      ammoValue.fontFamily = "DooM";
      ammoValue.color = "#9a0101";
      ammoValue.fontSize = "80px";
      menuService.addShadow(ammoValue);
      ui.addControl(ammoValue);

      //health 
      let healthWindow:GUI.Image = new GUI.Image("ammoWindow", "assets/hud/statusCleaar.png");
      healthWindow.width = "359px";
      healthWindow.height = "275px";
      healthWindow.top = "410px";
      healthWindow.left = "-430px";
      ui.addControl(healthWindow);
      let healthPercent:GUI.TextBlock = new GUI.TextBlock("healthtext", "HEALTH");
      healthPercent.width = "359px";
      healthPercent.height = "275px";
      healthPercent.top = "460px";
      healthPercent.left = "-430px";
      healthPercent.fontFamily = "DooM";
      healthPercent.color = "#969696";
      healthPercent.fontSize = "35px";
      menuService.addShadow(healthPercent);
      ui.addControl(healthPercent);
      let healthValue:GUI.TextBlock = new GUI.TextBlock("healthValue", player.health.toString() + "%");
      healthValue.width = "359px";
      healthValue.height = "275px";
      healthValue.top = "350px";
      healthValue.left = "-430px";
      healthValue.fontFamily = "DooM";
      healthValue.color = "#9a0101";
      healthValue.fontSize = "80px";
      menuService.addShadow(healthValue);
      ui.addControl(healthValue);
      let healthLine:GUI.Image = new GUI.Image("healthLine", "assets/hud/line.png");
      healthLine.width = "20px";
      healthLine.height = "300px";
      healthLine.top = "410px";
      healthLine.left = "-620px";
      ui.addControl(healthLine);

      //weapon selection 
      let weaponWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusCleaar.png");
      weaponWindow.width = "182px";
      weaponWindow.height = "275px";
      weaponWindow.top = "410px";
      weaponWindow.left = "-140px";
      ui.addControl(weaponWindow);
      let weaponSelect:GUI.TextBlock = new GUI.TextBlock("weaponSelct", "ARMS");
      weaponSelect.width = "182px";
      weaponSelect.height = "275px";
      weaponSelect.top = "460px";
      weaponSelect.left = "-140px";
      weaponSelect.fontFamily = "DooM";
      weaponSelect.color = "#969696";
      weaponSelect.fontSize = "35px";
      menuService.addShadow(weaponSelect);
      ui.addControl(weaponSelect);
      let weaponLine:GUI.Image = new GUI.Image("weaponLine", "assets/hud/line.png");
      weaponLine.width = "20px";
      weaponLine.height = "300px";
      weaponLine.top = "410px";
      weaponLine.left = "-241px";
      ui.addControl(weaponLine);

      //robot cam
      let robotWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/robotCam.png");
      robotWindow.width = "179px";
      robotWindow.height = "275px";
      robotWindow.top = "410px";
      robotWindow.left = "60px";
      ui.addControl(robotWindow);
      let robotLine:GUI.Image = new GUI.Image("robotLine", "assets/hud/line.png");
      robotLine.width = "20px";
      robotLine.height = "300px";
      robotLine.top = "410px";
      robotLine.left = "160px";
      ui.addControl(robotLine);
      let robotLine2:GUI.Image = new GUI.Image("robotLine2", "assets/hud/line.png");
      robotLine2.width = "20px";
      robotLine2.height = "300px";
      robotLine2.top = "410px";
      robotLine2.left = "-40px";
      ui.addControl(robotLine2);

      //armor window
      let armorWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusCleaar.png");
      armorWindow.width = "359px";
      armorWindow.height = "275px";
      armorWindow.top = "410px";
      armorWindow.left = "350x";
      ui.addControl(armorWindow);
      let armorPercent:GUI.TextBlock = new GUI.TextBlock("healthtext", "ARMOR");
      armorPercent.width = "359px";
      armorPercent.height = "275px";
      armorPercent.top = "460px";
      armorPercent.left = "350px";
      armorPercent.fontFamily = "DooM";
      armorPercent.color = "#969696";
      armorPercent.fontSize = "35px";
      menuService.addShadow(armorPercent);
      ui.addControl(armorPercent);
      let armorValue:GUI.TextBlock = new GUI.TextBlock("armorValue", player.armor.toString() + "%");
      armorValue.width = "359px";
      armorValue.height = "275px";
      armorValue.top = "350px";
      armorValue.left = "350px";
      armorValue.fontFamily = "DooM";
      armorValue.color = "#9a0101";
      armorValue.fontSize = "80px";
      menuService.addShadow(armorValue);
      ui.addControl(armorValue);
      let armorLine:GUI.Image = new GUI.Image("armorLine", "assets/hud/line.png");
      armorLine.width = "20px";
      armorLine.height = "300px";
      armorLine.top = "410px";
      armorLine.left = "530px";
      ui.addControl(armorLine);

      //inventory window
      let inventoryWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusCleaar.png");
      inventoryWindow.width = "89px";
      inventoryWindow.height = "275px";
      inventoryWindow.top = "410px";
      inventoryWindow.left = "594px";
      ui.addControl(inventoryWindow);
      let inventoryLine:GUI.Image = new GUI.Image("inventoryLine", "assets/hud/line.png");
      inventoryLine.width = "20px";
      inventoryLine.height = "300px";
      inventoryLine.top = "410px";
      inventoryLine.left = "649px";
      ui.addControl(inventoryLine);
      

      //allAmmo window
      let allAmmoWindow:GUI.Image = new GUI.Image("weaponWindow", "assets/hud/statusCleaar.png");
      allAmmoWindow.width = "259px";
      allAmmoWindow.height = "275px";
      allAmmoWindow.top = "410px";
      allAmmoWindow.left = "783px";
      ui.addControl(allAmmoWindow);
      let ammoPool1:GUI.TextBlock = new GUI.TextBlock("ammoPool1", "BULL " + player.ammos[1].toString() + "/" + "200");
      ammoPool1.width = "259px";
      ammoPool1.height = "275px";
      ammoPool1.top = "310px";
      ammoPool1.left = "803px";
      ammoPool1.fontFamily = "DooM";
      ammoPool1.color = "#969696";
      ammoPool1.fontSize = "20px";
      ammoPool1.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      menuService.addShadow(ammoPool1);
      ui.addControl(ammoPool1);
      let ammoPool2:GUI.TextBlock = new GUI.TextBlock("ammoPool2", "SHEL " + player.ammos[2].toString() + "/" + "50");
      ammoPool2.width = "259px";
      ammoPool2.height = "275px";
      ammoPool2.top = "380px";
      ammoPool2.left = "803px";
      ammoPool2.fontFamily = "DooM";
      ammoPool2.color = "#969696";
      ammoPool2.fontSize = "20px";
      ammoPool2.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      menuService.addShadow(ammoPool2);
      ui.addControl(ammoPool2);
      let ammoPool3:GUI.TextBlock = new GUI.TextBlock("ammoPool1", "CELL " + player.ammos[4].toString() + "/" + "300");
      ammoPool3.width = "259px";
      ammoPool3.height = "275px";
      ammoPool3.top = "450px";
      ammoPool3.left = "803px";
      ammoPool3.fontFamily = "DooM";
      ammoPool3.color = "#969696";
      ammoPool3.fontSize = "20px";
      ammoPool3.textHorizontalAlignment = GUI.TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
      menuService.addShadow(ammoPool3);
      ui.addControl(ammoPool3);
      

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

