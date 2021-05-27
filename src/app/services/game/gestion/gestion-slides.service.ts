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
  private introImage:GUI.Image;
  private introButton:GUI.Button;
  private clickToDismissText:GUI.TextBlock;
  private changeSlideText:GUI.TextBlock;

  constructor(@Inject(Number) private buildIndex: number, private hud:GUI.AdvancedDynamicTexture, private buttonCallback:Function) {

    this.currentSlide = 0;

    switch (this.buildIndex) {
      // Energy
      case 0:
        // Slide 0
        this.slides.push(new GUI.Image("slide0", "assets/gestion/0/0.png"));
        this.setupSlide(this.slides[0]);
        this.slides[0].width = "1600px";
        this.slides[0].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 1
        this.slides.push(new GUI.Image("slide1", "assets/gestion/0/1.jpg"));
        this.setupSlide(this.slides[1]);
        this.slides[1].width = "500px";
        this.slides[1].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 2
        this.slides.push(new GUI.Image("slide2", "assets/gestion/0/2.png"));
        this.setupSlide(this.slides[2]);
        this.slides[2].width = "1200px";
        this.slides[2].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 3
        this.slides.push(new GUI.Image("slide3", "assets/gestion/0/3.jpg"));
        this.setupSlide(this.slides[3]);
        this.slides[3].width = "1200px";
        this.slides[3].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 4
        this.slides.push(new GUI.Image("slide4", "assets/gestion/0/4.jpg"));
        this.setupSlide(this.slides[4]);
        this.slides[4].width = "1600px";
        this.slides[4].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 5
        this.slides.push(new GUI.Image("slide5", "assets/gestion/0/5.png"));
        this.setupSlide(this.slides[5]);
        this.slides[5].width = "1200px";
        this.slides[5].stretch = GUI.Image.STRETCH_UNIFORM;

        break;

      // Industry
      case 1:
        // Slide 0
        this.slides.push(new GUI.Image("slide0", "assets/gestion/1/0.png"));
        this.setupSlide(this.slides[0]);
        this.slides[0].width = "1600px";
        this.slides[0].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 1
        this.slides.push(new GUI.Image("slide1", "assets/gestion/1/1.png"));
        this.setupSlide(this.slides[1]);
        this.slides[1].width = "1000px";
        this.slides[1].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 2
        this.slides.push(new GUI.Image("slide2", "assets/gestion/1/2.png"));
        this.setupSlide(this.slides[2]);
        this.slides[2].width = "1000px";
        this.slides[2].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 3
        this.slides.push(new GUI.Image("slide3", "assets/gestion/1/3.jpg"));
        this.setupSlide(this.slides[3]);
        this.slides[3].width = "1280px";
        this.slides[3].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 4
        this.slides.push(new GUI.Image("slide4", "assets/gestion/1/4.png"));
        this.setupSlide(this.slides[4]);
        this.slides[4].width = "1600px";
        this.slides[4].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 5
        this.slides.push(new GUI.Image("slide5", "assets/gestion/1/5.png"));
        this.setupSlide(this.slides[5]);
        this.slides[5].width = "1200px";
        this.slides[5].stretch = GUI.Image.STRETCH_UNIFORM;
        break;

      // Ecosystem
      case 2:
        // Slide 0
        this.slides.push(new GUI.Image("slide0", "assets/gestion/2/0.png"));
        this.setupSlide(this.slides[0]);
        this.slides[0].width = "1600px";
        this.slides[0].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 1
        this.slides.push(new GUI.Image("slide1", "assets/gestion/2/1.png"));
        this.setupSlide(this.slides[1]);
        this.slides[1].width = "1600px";
        this.slides[1].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 2
        this.slides.push(new GUI.Image("slide2", "assets/gestion/2/2.png"));
        this.setupSlide(this.slides[2]);
        this.slides[2].width = "600px";
        this.slides[2].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 3
        this.slides.push(new GUI.Image("slide3", "assets/gestion/2/3.png"));
        this.setupSlide(this.slides[3]);
        this.slides[3].width = "1200px";
        this.slides[3].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 4
        this.slides.push(new GUI.Image("slide4", "assets/gestion/2/4.png"));
        this.setupSlide(this.slides[4]);
        this.slides[4].width = "1000px";
        this.slides[4].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 5
        this.slides.push(new GUI.Image("slide5", "assets/gestion/2/5.png"));
        this.setupSlide(this.slides[5]);
        this.slides[5].width = "800px";
        this.slides[5].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 6
        this.slides.push(new GUI.Image("slide6", "assets/gestion/2/6.png"));
        this.setupSlide(this.slides[6]);
        this.slides[6].width = "1400px";
        this.slides[6].stretch = GUI.Image.STRETCH_UNIFORM;
        break;

      // Social
      case 3:
        // Slide 0
        this.slides.push(new GUI.Image("slide0", "assets/gestion/3/0.png"));
        this.setupSlide(this.slides[0]);
        this.slides[0].width = "1600px";
        this.slides[0].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 1
        this.slides.push(new GUI.Image("slide1", "assets/gestion/3/1.jpg"));
        this.setupSlide(this.slides[1]);
        this.slides[1].width = "1600px";
        this.slides[1].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 2
        this.slides.push(new GUI.Image("slide2", "assets/gestion/3/2.jpg"));
        this.setupSlide(this.slides[2]);
        this.slides[2].width = "1200px";
        this.slides[2].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 3
        this.slides.push(new GUI.Image("slide3", "assets/gestion/3/3.jpg"));
        this.setupSlide(this.slides[3]);
        this.slides[3].width = "700px";
        this.slides[3].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 4
        this.slides.push(new GUI.Image("slide4", "assets/gestion/3/4.jpg"));
        this.setupSlide(this.slides[4]);
        this.slides[4].width = "700px";
        this.slides[4].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 5
        this.slides.push(new GUI.Image("slide5", "assets/gestion/3/5.jpg"));
        this.setupSlide(this.slides[5]);
        this.slides[5].width = "900px";
        this.slides[5].stretch = GUI.Image.STRETCH_UNIFORM;
        // Slide 6
        this.slides.push(new GUI.Image("slide6", "assets/gestion/3/6.png"));
        this.setupSlide(this.slides[6]);
        this.slides[6].width = "900px";
        this.slides[6].stretch = GUI.Image.STRETCH_UNIFORM;
        break;
    }

    this.introImage = new GUI.Image("introImage", "assets/gestion/landingMessage.png");
    this.introImage.shadowBlur = 1;
    this.introImage.shadowColor = "black";
    this.introImage.shadowOffsetX = 1;
    this.introImage.shadowOffsetY = 1;
    this.introImage.width = "1600px";
    this.introImage.stretch = GUI.Image.STRETCH_UNIFORM;
    this.introButton = GUI.Button.CreateSimpleButton("introButton", "");
    this.introImage.width = "1600px";
    this.introImage.height = "1120px";

    this.clickToDismissText = new GUI.TextBlock("clickToDismiss", "click to dismiss...");
    this.clickToDismissText.textVerticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    this.clickToDismissText.top = "-30px";
    this.clickToDismissText.color = "#00f954";
    this.clickToDismissText.fontSizeInPixels = 20;

    this.changeSlideText = new GUI.TextBlock("changeSlide", "Q <-> D");
    this.changeSlideText.verticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    this.changeSlideText.textVerticalAlignment = GUI.TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
    this.changeSlideText.height = "50px";
    this.changeSlideText.top = "-35px";
    this.changeSlideText.color = "#00f954";
    this.changeSlideText.fontSizeInPixels = 20;
    this.changeSlideText.zIndex = 1;

    this.playButton = GUI.Button.CreateImageWithCenterTextButton("playButton", "Look for the resource crate!", "assets/menu/buttonGradient.png");
    this.playButton.width = "500px";
    this.playButton.height = "60px";
    this.playButton.color = "white";
    this.playButton.fontFamily = "DooM";
    this.playButton.background = "green";
    this.playButton.shadowBlur = 1;
    this.playButton.shadowColor = "black";
    this.playButton.shadowOffsetX = 1;
    this.playButton.shadowOffsetY = 1;
    this.playButton.onPointerClickObservable.add(() => {
      this.buttonCallback();
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
   * @param onEnd function to call when the slides are exited
   */
  public displaySlides(scene:BABYLON.Scene) {
    // Keyboard event to detect a next slide call
    let keyboardEvent = (kbInfo:BABYLON.KeyboardInfo) => {
      kbInfo.event.preventDefault();
      switch (kbInfo.type) {
        /* One time trigger events */
        case BABYLON.KeyboardEventTypes.KEYUP:
          switch (kbInfo.event.code) {
            case "KeyD":
              // go to the next slide
              if (this.currentSlide + 1 < this.slides.length) {
                this.hud.addControl(this.slides[++this.currentSlide]);
                this.hud.removeControl(this.slides[this.currentSlide - 1]);
              // if the last slide was reached display a button
              } else if (this.currentSlide + 1 == this.slides.length) {
                this.hud.removeControl(this.slides[this.currentSlide++]);
                this.hud.addControl(this.playButton);
              }
              break;
            case "KeyA":
              // go to the prev slide
              if (this.currentSlide > 0) {
                this.hud.addControl(this.slides[--this.currentSlide]);
                this.hud.removeControl(this.slides[this.currentSlide + 1]);
              // go to the last slide and remove button
              } else if (this.currentSlide == this.slides.length) {
                if (this.buildIndex < 5)
                  this.hud.addControl(this.slides[--this.currentSlide]);
                this.hud.removeControl(this.playButton);
              }
              break;
          }
      }
    };

    /* Add the keyboard events */
    scene.onKeyboardObservable.add(keyboardEvent);

    this.hud.addControl(this.slides[0]);
    this.hud.addControl(this.changeSlideText);

  }



  /**
   * Display the intro message 
   */
  public displayIntro() {

    // On click dismiss
    this.introButton.onPointerClickObservable.add(() => {
      this.hud.removeControl(this.introImage);
      this.hud.removeControl(this.introButton);
      this.hud.removeControl(this.clickToDismissText);
    })
    this.hud.addControl(this.introImage);
    this.hud.addControl(this.clickToDismissText);
    this.hud.addControl(this.introButton);
  }

}
