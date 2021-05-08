import { Injectable } from '@angular/core';

import { Image, TextBlock, Control } from '@babylonjs/gui';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor() { }

  setupMenuIcon(icon:Image):void {
    icon.width = "40px";
    icon.height = "40px";
    icon.top = "-5px";
    icon.left = "40px";
    icon.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    icon.stretch = Image.STRETCH_UNIFORM;
  }

  setupMenuText(text:TextBlock):void {
    text.color = "white";
    text.width = "80px";
    text.top = "30px";
    text.left = "20px";
    text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    text.fontFamily = "Pixelated  MS Sans Serif";
    text.fontSize = "13px";
  }

  addShadow(element:Control) {
    element.shadowColor = "black";
    element.shadowOffsetX = 1;
    element.shadowOffsetY = 1;
    element.shadowBlur = 1;
  }

  addReverseShadow(element:Control) {
    element.shadowColor = "black";
    element.shadowOffsetX = -1;
    element.shadowOffsetY = -1;
    element.shadowBlur = 1;
  }
}
