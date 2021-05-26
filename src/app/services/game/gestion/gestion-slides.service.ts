import { Inject, Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

@Injectable({
  providedIn: 'root'
})
export class GestionSlidesService {
  private slides: GUI.Image[] = [];
  private currentSlide: number;
  private playButton:GUI.Button;

  constructor(@Inject(Number) index: number, buttonCallback:Function) {

    this.currentSlide = 0;

    switch (index) {
      // Energy
      case 0:
        // Slide 0
        this.slides.push(new GUI.Image("slide0", "assets/gestion/0/0.png"));
        this.setupSlide(this.slides[0]);
        this.slides[0].width = "1600px";
        // Slide 1
        this.slides.push(new GUI.Image("slide1", "assets/gestion/0/1.jpg"));
        this.setupSlide(this.slides[1]);
        this.slides[1].width = "500px";
        // Slide 2
        this.slides.push(new GUI.Image("slide2", "assets/gestion/0/2.png"));
        this.setupSlide(this.slides[2]);
        this.slides[2].width = "1200px";
        // Slide 3
        this.slides.push(new GUI.Image("slide3", "assets/gestion/0/3.jpg"));
        this.setupSlide(this.slides[3]);
        this.slides[3].width = "1200px";
        // Slide 4
        this.slides.push(new GUI.Image("slide4", "assets/gestion/0/4.jpg"));
        this.setupSlide(this.slides[4]);
        this.slides[4].width = "500px";

        break;

      // Industry
      case 1:
        //TODO
        break;
      // Ecosystem
      case 2:
        //TODO
        break;

      // Social
      case 3:
        //TODO
        break;
    }


    this.playButton = GUI.Button.CreateImageWithCenterTextButton("playButton", "Find the resource crate!", "assets/textures/menu/buttonGradient.png");
    this.playButton.width = "400px";
    this.playButton.height = "40px";
    this.playButton.color = "white";
    this.playButton.fontFamily = "DooM";
    this.playButton.background = "green";
    this.playButton.shadowBlur = 1;
    this.playButton.shadowColor = "black";
    this.playButton.shadowOffsetX = 1;
    this.playButton.shadowOffsetY = 1;
    this.playButton.onPointerClickObservable.add(() => {
      buttonCallback();
    });
  }


  /**
   * Sets the Image with the correct size, and display properties
   * @param slide slide Image to setup (width, shadow)
   */
  private setupSlide(slide:GUI.Image) {
    slide.shadowBlur = 1;
    slide.shadowColor = "black";
    slide.shadowOffsetX = 1;
    slide.shadowOffsetY = 1;
  }

  /**
   * Function to display the information about the last placed module
   * @param scene Babylon scene to display the slides on
   * @param hud HUD to fill the images in
   */
  public displaySlides(scene:BABYLON.Scene, hud:GUI.AdvancedDynamicTexture) {
    // Keyboard event to detect a next slide call
    let keyboardEvent = (kbInfo:BABYLON.KeyboardInfo) => {
      kbInfo.event.preventDefault();
      switch (kbInfo.type) {
        /* One time trigger events */
        case BABYLON.KeyboardEventTypes.KEYUP:
          switch (kbInfo.event.code) {
            case "ArrowRight":
              // go to the next slide
              if (this.currentSlide + 1 < this.slides.length) {
                hud.addControl(this.slides[++this.currentSlide]);
                hud.removeControl(this.slides[this.currentSlide - 1]);
              // if the last slide was reached display a button
              } else if (this.currentSlide + 1 == this.slides.length) {
                hud.addControl(this.playButton);
              }
              break;
            case "ArrowLeft":
              // go to the prev slide
              if (this.currentSlide > 0) {
                hud.addControl(this.slides[--this.currentSlide]);
                hud.removeControl(this.slides[this.currentSlide + 1]);
              // go to the last slide and remove button
              } else if (this.currentSlide == this.slides.length) {
                hud.addControl(this.slides[--this.currentSlide]);
                hud.removeControl(this.playButton);
              }
              break;
          }
      }
    };

    /* Add the keyboard events */
    scene.onKeyboardObservable.add(keyboardEvent);

  }
}
