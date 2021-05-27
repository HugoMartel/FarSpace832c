import { Inject, Injectable } from '@angular/core';

import * as GUI from '@babylonjs/gui';
import * as BABYLON from '@babylonjs/core';

@Injectable({
  providedIn: 'root'
})
export class GestionHudService {

  hud!: GUI.AdvancedDynamicTexture;
  objectivTracker0: GUI.Image;
  objectivTracker1: GUI.Image;
  objectivTracker2: GUI.Image;
  objectivTracker3: GUI.Image;
  objectivTracker4: GUI.Image;
  energyObj: GUI.Image;
  ecosystemObj: GUI.Image;
  habitationObj: GUI.Image;
  socialObj: GUI.Image;
  techObj: GUI.Image;

  constructor(@Inject(Number) completedAmount: number) {

    this.objectivTracker0 = new GUI.Image("objectivTracker0");
    this.objectivTracker0.width = "150px";
    this.objectivTracker0.height = "35px";
    this.objectivTracker0.top = "-470px";
    this.objectivTracker0.left = "800px";
    this.objectivTracker0.source = completedAmount > 0 ? "assets/gestionHud/completedObj.png" : "assets/gestionHud/uncompletedObj.png";


    this.objectivTracker1 = new GUI.Image("objectivTracker1", "assets/gestionHud/uncompletedObj.png");
    this.objectivTracker1.width = "150px";
    this.objectivTracker1.height = "35px";
    this.objectivTracker1.top = "-415px";
    this.objectivTracker1.left = "800px";
    this.objectivTracker1.source = completedAmount > 2 ? "assets/gestionHud/completedObj.png" : "assets/gestionHud/uncompletedObj.png";

    this.objectivTracker2 = new GUI.Image("objectivTracker2", "assets/gestionHud/uncompletedObj.png");
    this.objectivTracker2.width = "150px";
    this.objectivTracker2.height = "35px";
    this.objectivTracker2.top = "-360px";
    this.objectivTracker2.left = "800px";
    this.objectivTracker2.source = completedAmount > 3 ? "assets/gestionHud/completedObj.png" : "assets/gestionHud/uncompletedObj.png";

    this.objectivTracker3 = new GUI.Image("objectivTracker3", "assets/gestionHud/uncompletedObj.png");
    this.objectivTracker3.width = "150px";
    this.objectivTracker3.height = "35px";
    this.objectivTracker3.top = "-305px";
    this.objectivTracker3.left = "800px";
    this.objectivTracker3.source = completedAmount > 4 ? "assets/gestionHud/completedObj.png" : "assets/gestionHud/uncompletedObj.png";

    this.objectivTracker4 = new GUI.Image("objectivTracker4", "assets/gestionHud/uncompletedObj.png");
    this.objectivTracker4.width = "150px";
    this.objectivTracker4.height = "35px";
    this.objectivTracker4.top = "-250px";
    this.objectivTracker4.left = "800px";
    this.objectivTracker4.source = completedAmount > 1 ? "assets/gestionHud/completedObj.png" : "assets/gestionHud/uncompletedObj.png";

    this.energyObj = new GUI.Image("energyObj", "assets/gestionHud/energyIcon.png");
    this.energyObj.width = "35px";
    this.energyObj.height = "35px";
    this.energyObj.top = "-470px";
    this.energyObj.left = "695px";
    this.energyObj.shadowColor = "black";
    this.energyObj.shadowOffsetX = 1;
    this.energyObj.shadowOffsetY = 1;
    this.energyObj.shadowBlur = 1;

    this.ecosystemObj = new GUI.Image("ecosystemObj", "assets/gestionHud/ecosystemIcon.png");
    this.ecosystemObj.width = "35px";
    this.ecosystemObj.height = "35px";
    this.ecosystemObj.top = "-415px";
    this.ecosystemObj.left = "695px";
    this.ecosystemObj.shadowColor = "black";
    this.ecosystemObj.shadowOffsetX = 1;
    this.ecosystemObj.shadowOffsetY = 1;
    this.ecosystemObj.shadowBlur = 1;

    this.habitationObj = new GUI.Image("habitationObj", "assets/gestionHud/habitationIcon.png");
    this.habitationObj.width = "35px";
    this.habitationObj.height = "35px";
    this.habitationObj.top = "-360px";
    this.habitationObj.left = "695px";
    this.habitationObj.shadowColor = "black";
    this.habitationObj.shadowOffsetX = 1;
    this.habitationObj.shadowOffsetY = 1;
    this.habitationObj.shadowBlur = 1;

    this.socialObj = new GUI.Image("socialObj", "assets/gestionHud/socialIcon.png");
    this.socialObj.width = "35px";
    this.socialObj.height = "35px";
    this.socialObj.top = "-305px";
    this.socialObj.left = "695px";
    this.socialObj.shadowColor = "black";
    this.socialObj.shadowOffsetX = 1;
    this.socialObj.shadowOffsetY = 1;
    this.socialObj.shadowBlur = 1;

    this.techObj = new GUI.Image("techObj", "assets/gestionHud/techIcon.png");
    this.techObj.width = "35px";
    this.techObj.height = "35px";
    this.techObj.top = "-250px";
    this.techObj.left = "695px";
    this.techObj.shadowColor = "black";
    this.techObj.shadowOffsetX = 1;
    this.techObj.shadowOffsetY = 1;
    this.techObj.shadowBlur = 1;

  }

  /**
   * Function used to display the status bars
   * @param scene 
   */
  public displayGoal(scene: BABYLON.Scene) {

    this.hud = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    this.hud.idealWidth = 1795;
    this.hud.idealHeight = 1009;

    this.hud.addControl(this.objectivTracker0);
    this.hud.addControl(this.objectivTracker1);
    this.hud.addControl(this.objectivTracker2);
    this.hud.addControl(this.objectivTracker3);
    this.hud.addControl(this.objectivTracker4);

    this.hud.addControl(this.energyObj);
    this.hud.addControl(this.ecosystemObj);
    this.hud.addControl(this.habitationObj);
    this.hud.addControl(this.socialObj);
    this.hud.addControl(this.techObj);

  }

  /**
   * function to change the state of an objective
   */
  public updateObj0() {
    this.objectivTracker0.source = "assets/gestionHud/completedObj.png";
  }

  /**
   * function to change the state of an objective
   */
  public updateObj1() {
    this.objectivTracker1.source = "assets/gestionHud/completedObj.png";
  }

  /**
   * function to change the state of an objective
   */
  public updateObj2() {
    this.objectivTracker2.source = "assets/gestionHud/completedObj.png";
  }

  /**
   * function to change the state of an objective
   */
  public updateObj3() {
    this.objectivTracker3.source = "assets/gestionHud/completedObj.png";
  };

  /**
   * function to change the state of an objective
   */
  public updateObj4() {
    this.objectivTracker4.source = "assets/gestionHud/completedObj.png";
  };

}