import { Inject, Injectable } from '@angular/core';

import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

@Injectable({
  providedIn: 'root'
})
export class GestionSlidesService {
  private slides: GUI.Image[] = [];

  constructor(@Inject(Number)index: number) { 
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
   * @param hud HUD to fill the images in
   */
  public displaySlides(scene:BABYLON.Scene, hud:GUI.AdvancedDynamicTexture) {
    // Keyboard event to detect a next slide call
    let keyboardEvent = () => {

    };

    /* Add the keyboard events */
    scene.onKeyboardObservable.add(keyboardEvent);

    //TODO

  }
}
