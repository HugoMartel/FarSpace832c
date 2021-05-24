//TODO: change the cone to a realy player model ?
//TODO: change camera borders cause it looks like a fatass rn
//TODO ++++: add player death check
//TODO: add a way to the enemy to talk


import { WindowRefService } from './../services/window-ref.service';

import { MenuService } from './../services/menu/menu.service';

import { ElementRef, Injectable, NgZone, HostListener } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders/glTF"; //don't forget to npm install --save-dev @babylonjs/core @babylonjs/loaders

//services FPS
import { GameLevelService } from '../services/game/fps/game-level.service';
import { GamePlayerService } from '../services/game/fps/player/game-player.service';
import { GameUIService } from '../services/game/fps/game-ui.service';
import * as stuff from '../services/game/fps/randomFunctions/random-functions.service'

// Types defines
type enemyArray = Array<Array<Array<number>>>;
type pickupArray = Array<Array<number>>;
type wallArray = Array<Array<number>>;
type doorArray = Array<Array<number>>;

//services Gestion
import { TerrainService } from './../services/game/gestion/terrain.service';
import { GestionMousePickerService } from './../services/game/gestion/gestion-mouse-picker.service';
import { GestionMeshLoaderService } from './../services/game/gestion/gestion-mesh-loader.service';
import { MatrixService } from '../services/game/gestion/matrix.service';
import { GestionHudService } from './../services/game/gestion/gestion-hud.service';

@Injectable({ providedIn: 'root' })
export class GameService {

  private size_z: number = 30;
  private terr2Matrix: any[] = [];

  public canvas!: HTMLCanvasElement;
  public engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  public frameCounter: number;
  private ground!: Array<BABYLON.Mesh>;
  public fullscreen: Function;
  private GroundBoxes!: BABYLON.Mesh;
  public keyPressed: Array<String>;
  public levels: GameLevelService[] = [];

  public constructor(
    private ngZone: NgZone,
    private menuService: MenuService,
    private windowRef: WindowRefService,
    private terrainService: TerrainService
  ) {
    // Create the FPS Levels
    let enemyTMP:enemyArray = [
      // [[type], [coordx, coordz, state], etc]
      [[1], [4, 4, 0], [5, 5, 0], [-7, -7, 0]]
    ];
    let objectsTMP:pickupArray = [
      // [type, coordx, coordz]
      [8, 7, 7], 
      [8, 5, 5],
      [10, 6, 7],
      [14, 7, 6],
      [8, 7, 8],
      [16, 8, 7], 
      [17, 9, 5],
      [18, 10, 7],
      [20, 7, 10],
      [21, 7, 9],
      [23, -7, -7],
      [22, -12, 4],
    ];
    let doorTMP:doorArray = [
      // coordX, coordZ, key Needed (-1, 0, 1, 2), rotate (0 or 1), switchNeeded (0 or 1)
      [14, 13, 2, 0, 0], 
      [-14, -13, 1, 0, 1]
    ];
    let wallTMP:wallArray = [
      // coordX, coordZ
      [1, 4],
      [1, 3],
      [1, 5],
      [2, 5],
      [3, 5],
      [12, 13],
      [12, 14],[12, 15], [12, 16], [12, 17], [12, 18], [12, 19],
      [16, 13], [16, 14], [16, 15], [16, 16], [16, 17], [16, 18], [16, 19],
    ];

    let switchesTMP = [
      [11, 11, 0]
    ];

    this.levels.push(new GameLevelService(
      wallTMP,
      enemyTMP,
      objectsTMP,
      doorTMP,
      switchesTMP,
      1,
      () => {
        this.resetScene();
        //TODO Win screen (BABYLON GUI ?)
        this.createPlanetScene(new ElementRef<HTMLCanvasElement>(this.canvas));//! will need to adjust the args
        this.animate();
      }
    ));

    this.frameCounter = 0;
    this.ground = [];
    this.keyPressed = [];
    this.fullscreen = () => {
      //true is to lock the mouse inside
      this.engine.enterFullscreen(true);
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock || false;
        this.canvas.requestPointerLock();
      }
    }
  }


  //**********************
  //*       Reset        *
  //**********************
  public resetScene():void {
    this.scene.dispose();
    this.engine.dispose();
    //It appears from the devs that only disposing from the scene leaves some stuff in the memory
  }


  //**********************
  //*       Menu         *
  //**********************
  public createMenuScene(canvas: ElementRef<HTMLCanvasElement>):void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // Create the view
    let menuCamera:BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), this.scene);
    menuCamera.attachControl(this.canvas, true);

    // Create the UI object
    let menuUI:GUI.AdvancedDynamicTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "menuUI", true, this.scene
    );
    menuUI.idealWidth = 1795;
    menuUI.idealHeight = 1009;
    menuUI.background = "teal";

    // Create the Grid object
    let mainGrid:GUI.Grid = new GUI.Grid();
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.1);
    mainGrid.addRowDefinition(.4);// Empty part
    mainGrid.addColumnDefinition(.08);
    mainGrid.addColumnDefinition(.92);// Empty part
    menuUI.addControl(mainGrid);

    //******************
    //*  FAKE TASKBAR  *
    //******************
    // Taskbar background
    let taskbarRectLeft:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarRectLeft.background = "#c0c0c0";
    taskbarRectLeft.width = 100;
    taskbarRectLeft.height= "50px";
    taskbarRectLeft.top = 1;
    taskbarRectLeft.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarRectLeft, 6, 0);
    let taskbarRectRight:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarRectRight.background = "#c0c0c0";
    taskbarRectRight.width = 100;
    taskbarRectRight.height= "50px";
    taskbarRectRight.top = 1;
    taskbarRectRight.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarRectRight, 6, 1);

    // Start button
    let windowsButton:GUI.Button = GUI.Button.CreateImageButton("windowsButton", "Start", "assets/menu/windows.ico");
    windowsButton.width = "100px";
    windowsButton.height = "40px";
    if (windowsButton.image) {
      windowsButton.image.height = "40px";
      windowsButton.image.width = "40px";
      windowsButton.image.left = "5px";
    }
    if (windowsButton.textBlock) {
      windowsButton.textBlock.left = "12px";
      windowsButton.textBlock.color = "black";
    }
    windowsButton.thickness = 1;
    this.menuService.addShadow(windowsButton);
    windowsButton.fontFamily = "Pixelated MS Sans Serif";
    windowsButton.fontSize = "20px";
    windowsButton.fontWeight = "bold";
    windowsButton.color = "white";
    windowsButton.background = "#c0c0c0";
    windowsButton.top = "-4px";
    windowsButton.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    windowsButton.left = "6px";
    windowsButton.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    mainGrid.addControl(windowsButton, 6);

    // Taskbar Separators 0
    let taskbarSeparator1:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarSeparator1.background = "#c0c0c0";
    taskbarSeparator1.width = "5px";
    taskbarSeparator1.height= "40px";
    taskbarSeparator1.top = "-5px";
    taskbarSeparator1.left = "55px";
    taskbarSeparator1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.menuService.addReverseShadow(taskbarSeparator1);
    mainGrid.addControl(taskbarSeparator1, 6, 0);
    let taskbarSeparator2:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarSeparator2.background = "black";
    taskbarSeparator2.thickness = 0;
    taskbarSeparator2.width = "2px";
    taskbarSeparator2.height= "50px";
    taskbarSeparator2.left = "43px";
    taskbarSeparator2.top = "1px";
    taskbarSeparator2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarSeparator2, 6, 0);


    //**************************
    //*   FAKE TASKBAR ICONS   *
    //**************************
    let taskbarIcon0:GUI.Image = new GUI.Image("desktopIcon", "assets/menu/desktop.ico");
    taskbarIcon0.width = "30px";
    taskbarIcon0.height = "30px";
    taskbarIcon0.top = "-8px";
    taskbarIcon0.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarIcon0.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarIcon0.stretch = GUI.Image.STRETCH_UNIFORM;
    this.menuService.addShadow(taskbarIcon0);
    mainGrid.addControl(taskbarIcon0, 6, 1);

    let taskbarIcon1:GUI.Image = new GUI.Image("ieIcon", "assets/menu/ie.ico");
    taskbarIcon1.width = "30px";
    taskbarIcon1.height = "30px";
    taskbarIcon1.top = "-8px";
    taskbarIcon1.left = "40px";
    taskbarIcon1.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarIcon1.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarIcon1.stretch = GUI.Image.STRETCH_UNIFORM;
    this.menuService.addShadow(taskbarIcon1);
    mainGrid.addControl(taskbarIcon1, 6, 1);

    let taskbarIcon2:GUI.Image = new GUI.Image("mailIcon", "assets/menu/mail.ico");
    taskbarIcon2.width = "30px";
    taskbarIcon2.height = "30px";
    taskbarIcon2.top = "-8px";
    taskbarIcon2.left = "80px";
    taskbarIcon2.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarIcon2.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarIcon2.stretch = GUI.Image.STRETCH_UNIFORM;
    this.menuService.addShadow(taskbarIcon2);
    mainGrid.addControl(taskbarIcon2, 6, 1);

    // Taskbar Separators 1
    let taskbarSeparator3:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarSeparator3.background = "#c0c0c0";
    taskbarSeparator3.width = "5px";
    taskbarSeparator3.height= "40px";
    taskbarSeparator3.top = "-5px";
    taskbarSeparator3.left = "120px";
    taskbarSeparator3.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarSeparator3.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    this.menuService.addReverseShadow(taskbarSeparator3);
    mainGrid.addControl(taskbarSeparator3, 6, 1);
    let taskbarSeparator4:GUI.Rectangle = new GUI.Rectangle("taskbarRect");
    taskbarSeparator4.background = "black";
    taskbarSeparator4.thickness = 0;
    taskbarSeparator4.width = "2px";
    taskbarSeparator4.height= "50px";
    taskbarSeparator4.left = "135px";
    taskbarSeparator4.top = "1px";
    taskbarSeparator4.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarSeparator4.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarSeparator4, 6, 1);

    //**************************
    //*    FAKE TASKBAR APPS   *
    //**************************
    // Game window
    let taskbarGameWindowRect:GUI.Rectangle = new GUI.Rectangle("taskbarGameWindowRect");
    taskbarGameWindowRect.background = "#cecece";
    taskbarGameWindowRect.thickness = 0;
    taskbarGameWindowRect.width = "300px";
    taskbarGameWindowRect.height= "38px";
    taskbarGameWindowRect.top = "-5px";
    taskbarGameWindowRect.left = "150px";
    taskbarGameWindowRect.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarGameWindowRect.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarGameWindowRect.shadowColor = "black";
    this.menuService.addReverseShadow(taskbarGameWindowRect);
    mainGrid.addControl(taskbarGameWindowRect, 6, 1);
    let taskbarGameBackgroundImage:GUI.Image = new GUI.Image("taskbarGameBackgroundImage", "assets/menu/selectedWindowBackground.png");
    taskbarGameBackgroundImage.width = "290px";
    taskbarGameBackgroundImage.height= "34px";
    taskbarGameBackgroundImage.top = "-7px";
    taskbarGameBackgroundImage.left = "155px";
    taskbarGameBackgroundImage.stretch = GUI.Image.STRETCH_NONE;
    taskbarGameBackgroundImage.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarGameBackgroundImage.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarGameBackgroundImage, 6, 1);
    let taskbarGameIcon:GUI.Image = new GUI.Image("taskbarGameBackgroundImage", "assets/menu/Gliese_832c-ArtistImpression.png");
    taskbarGameIcon.width = "30px";
    taskbarGameIcon.height= "30px";
    taskbarGameIcon.top = "-9px";
    taskbarGameIcon.left = "160px";
    taskbarGameIcon.stretch = GUI.Image.STRETCH_NONE;
    taskbarGameIcon.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarGameIcon.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarGameIcon, 6, 1);
    let taskbarGameText:GUI.TextBlock = new GUI.TextBlock("taskbarGameText", "FarSpace832c.exe");
    taskbarGameText.color = "black";
    taskbarGameText.width = "300px";
    taskbarGameText.height = "30px";
    taskbarGameText.top = "-9px";
    taskbarGameText.left = "200px";
    taskbarGameText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarGameText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarGameText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarGameText.fontFamily = "Pixelated  MS Sans Serif";
    taskbarGameText.fontSize = "15px";
    mainGrid.addControl(taskbarGameText, 6, 1);

    // Word window
    let taskbarWordWindowRect:GUI.Rectangle = new GUI.Rectangle("taskbarWordWindowRect");
    taskbarWordWindowRect.background = "#cecece";
    taskbarWordWindowRect.thickness = 0;
    taskbarWordWindowRect.width = "300px";
    taskbarWordWindowRect.height= "38px";
    taskbarWordWindowRect.top = "-5px";
    taskbarWordWindowRect.left = "460px";
    taskbarWordWindowRect.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarWordWindowRect.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarWordWindowRect.shadowColor = "black";
    taskbarWordWindowRect.shadowOffsetX = 1;
    taskbarWordWindowRect.shadowOffsetY = 1;
    taskbarWordWindowRect.shadowBlur = 1;
    mainGrid.addControl(taskbarWordWindowRect, 6, 1);
    let taskbarWordIcon:GUI.Image = new GUI.Image("taskbarGameBackgroundImage", "assets/menu/MSWord.ico");
    taskbarWordIcon.width = "30px";
    taskbarWordIcon.height= "30px";
    taskbarWordIcon.top = "-9px";
    taskbarWordIcon.left = "470px";
    taskbarWordIcon.stretch = GUI.Image.STRETCH_NONE;
    taskbarWordIcon.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarWordIcon.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    mainGrid.addControl(taskbarWordIcon, 6, 1);
    let taskbarWordText:GUI.TextBlock = new GUI.TextBlock("taskbarGameText", "Document 1 - Microsoft Word");
    taskbarWordText.color = "black";
    taskbarWordText.width = "300px";
    taskbarWordText.height = "30px";
    taskbarWordText.top = "-9px";
    taskbarWordText.left = "510px";
    taskbarWordText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarWordText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    taskbarWordText.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    taskbarWordText.fontFamily = "Pixelated  MS Sans Serif";
    taskbarWordText.fontSize = "15px";
    mainGrid.addControl(taskbarWordText, 6, 1);


    //**************************
    //*   FAKE DESKTOP ICONS   *
    //**************************
    // 0 - Computer
    let icon0:GUI.Image = new GUI.Image("computerIcon", "assets/menu/computer_explorer.ico");
    this.menuService.setupMenuIcon(icon0);
    mainGrid.addControl(icon0, 0, 0);
    let text0:GUI.TextBlock = new GUI.TextBlock("computerText", "My Computer");
    this.menuService.setupMenuText(text0);
    mainGrid.addControl(text0, 0, 0);

    // 1 - Trash
    let icon1:GUI.Image = new GUI.Image("trashIcon", "assets/menu/recycle_bin_file.ico");
    this.menuService.setupMenuIcon(icon1);
    mainGrid.addControl(icon1, 1, 0);
    let text1:GUI.TextBlock = new GUI.TextBlock("trashText", "Recycle Bin");
    this.menuService.setupMenuText(text1);
    mainGrid.addControl(text1, 1, 0);

    // 2 - Netscape
    let icon2:GUI.Image = new GUI.Image("netscapeIcon", "assets/menu/netscape.ico");
    this.menuService.setupMenuIcon(icon2);
    mainGrid.addControl(icon2, 2, 0);
    let text2:GUI.TextBlock = new GUI.TextBlock("netscapeText", "Netscape");
    this.menuService.setupMenuText(text2);
    mainGrid.addControl(text2, 2, 0);

    // 3 - Mail
    let icon3:GUI.Image = new GUI.Image("mailIcon", "assets/menu/mail.ico");
    this.menuService.setupMenuIcon(icon3);
    mainGrid.addControl(icon3, 3, 0);
    let text3:GUI.TextBlock = new GUI.TextBlock("mailText", "Mail");
    this.menuService.setupMenuText(text3);
    mainGrid.addControl(text3, 3, 0);

    // 4 - MS Word
    let icon4:GUI.Image = new GUI.Image("wordIcon", "assets/menu/MSWord.ico");
    this.menuService.setupMenuIcon(icon4);
    mainGrid.addControl(icon4, 4, 0);
    let text4:GUI.TextBlock = new GUI.TextBlock("wordText", "MS Word");
    this.menuService.setupMenuText(text4);
    mainGrid.addControl(text4, 4, 0);

    // 5 - Notepad
    let icon5:GUI.Image = new GUI.Image("notepadIcon", "assets/menu/notepad.ico");
    this.menuService.setupMenuIcon(icon5);
    mainGrid.addControl(icon5, 5, 0);
    let text5:GUI.TextBlock = new GUI.TextBlock("notepadText", "Notepad");
    this.menuService.setupMenuText(text5);
    mainGrid.addControl(text5, 5, 0);


    //******************
    //*    FAKE WORD   *
    //******************
    let wordWindow:GUI.Image = new GUI.Image("wordWindow", "assets/menu/wordExample.png");
    wordWindow.width = "550px";
    wordWindow.height = "576px";
    wordWindow.left = "600px";
    wordWindow.top = "100px";
    this.menuService.addShadow(wordWindow);
    menuUI.addControl(wordWindow);

    

    //******************
    //*  PLAY WINDOW   *
    //******************
    // Background window
    let window:GUI.Image = new GUI.Image("window", "assets/menu/gameBackground.png");
    window.width = "503px";
    window.height = "542px";
    window.top = "-100px";
    window.stretch = GUI.Image.STRETCH_UNIFORM;
    this.menuService.addShadow(window);
    menuUI.addControl(window);

    // Planet Image
    let planet:GUI.Image = new GUI.Image("planetImage", "assets/menu/Gliese_832c-ArtistImpression.png");
    planet.width = "300px";
    planet.height = "300px";
    planet.top = "-100px";
    this.menuService.addShadow(planet);
    planet.stretch = GUI.Image.STRETCH_UNIFORM;
    menuUI.addControl(planet);

    // PLAY button
    let playButton:GUI.Button = GUI.Button.CreateImageWithCenterTextButton("playButton", "PLAY", "assets/menu/buttonGradient.png");
    playButton.width = "240px";
    playButton.height = "80px";
    playButton.top = "100px";
    playButton.fontFamily = "Pixelated MS Sans Serif";
    playButton.fontSize = "35px";
    playButton.color = "white";
    this.menuService.addShadow(playButton);
    menuUI.addControl(playButton);

    playButton.onPointerClickObservable.add((eventData: GUI.Vector2WithInfo, eventState: BABYLON.EventState):void => {
      this.resetScene();

      //************************************************************************
      //*                           FPS or Gestion                             *
      //************************************************************************

      ///*
      this.createFPSScene(canvas, this.levels[0]);//! will not be used in the future
      //*/

      /*
      let introVideo:HTMLVideoElement = document.createElement("video");
      introVideo.width = canvas.nativeElement.width;
      introVideo.height = canvas.nativeElement.height;
      introVideo.autoplay = true;
      introVideo.loop = false;
      introVideo.muted = false;
      introVideo.controls = true;
      introVideo.textContent = "Sorry, your browser doesn't support embedded videos.";
      let introSource:HTMLSourceElement = document.createElement("source");
      introSource.src = "assets/videos/intro.mp4";
      introSource.type = "video/mp4";
      introVideo.appendChild(introSource);

      let videoContainer = document.getElementById("gameWindowBody");
      if (videoContainer !== null) {
        videoContainer.prepend(introVideo);
        canvas.nativeElement.style.display = "none";
        this.createPlanetScene(canvas);
      }

      introVideo.addEventListener('ended', (event:Event) => {
        event.preventDefault();
        videoContainer?.removeChild(introVideo);
        canvas.nativeElement.style.display = "block";

        this.animate();
      });
      */
    });
  }


  //**********************
  //*      Shooter       *
  //**********************
  public createFPSScene(canvas: ElementRef<HTMLCanvasElement>, level: GameLevelService): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Create the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.displayLoadingUI();
    let animationFrameSkipper = 0;

    // Create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    let uiService = new GameUIService(this.scene, this.menuService);
    let player = new GamePlayerService(this.scene, this.canvas, uiService, () => {
      //adding a background
      let guiDeath = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
      let rect1 = new GUI.Rectangle();
      rect1.width = this.canvas.width;
      rect1.height = this.canvas.height;
      rect1.cornerRadius = 20;
      rect1.color = "#f1fc59";
      rect1.alpha = 0.75;
      rect1.thickness = 4;
      rect1.background = "#9a0101";
      guiDeath.addControl(rect1);
      //adding the textbox
      let text:string = "You're dead, restart ?";
      let doorDisplay = new GUI.TextBlock("", text);
      doorDisplay.color = "black";
      doorDisplay.fontFamily = "DooM";
      doorDisplay.top = "-350px";
      doorDisplay.fontSize = "40px";
      doorDisplay.shadowColor = "white";
      doorDisplay.shadowOffsetX = 1;
      doorDisplay.shadowOffsetY = 1;
      doorDisplay.shadowBlur = 1;
      guiDeath.addControl(doorDisplay);
      //adding the button
      let button = GUI.Button.CreateSimpleButton("resetButton", "Restart");
      button.width = 0.2;
      button.cornerRadius = 20;
      button.fontFamily = "DooM";
      button.height = "100px";
      button.fontSize = "35px";
      button.color = "#9a0101";
      button.background = "black";
      guiDeath.addControl(button);
      //on reset
      button.onPointerClickObservable.add(() => {
        this.resetScene();
        //TODO: change this line in the future
        this.createFPSScene(canvas, this.levels[0]);
      });
    });

    //Add the camera, to be shown as a cone and surrounding collision volume
    /*var viewCamera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 8, -2), this.scene);
    viewCamera.parent = player.camera;
    viewCamera.setTarget(new BABYLON.Vector3(0, -0.0001, 1));
    if(this.scene != null && this.scene.activeCameras != null){
      this.scene.activeCameras.push(viewCamera);
      this.scene.activeCameras.push(player.camera);
    }
    viewCamera.viewport = new BABYLON.Viewport(0, 0.5, 1.0, 0.5);
    player.camera.viewport = new BABYLON.Viewport(0, 0, 1.0, 0.5);*/

    //**********************
    //*       EVENTS       *
    //**********************
    let mouseEvent = (ptInfo:BABYLON.PointerInfo) => {
      ptInfo.event.preventDefault();

      // Detect the event type and if the input is a left click
      //! BABYLON.PointerInput.LeftClick means right click...)
      if (ptInfo.type === BABYLON.PointerEventTypes.POINTERDOWN && ptInfo.event.button === 0) {
        player.shooting = true;
        player.shoot(this.scene, level, this.canvas, this.frameCounter);
      } else if (ptInfo.type === BABYLON.PointerEventTypes.POINTERUP && ptInfo.event.button === 0) {
        player.shooting = false;
      }
    };
    
    let keyboardEvent = (kbInfo:BABYLON.KeyboardInfo) => {
      kbInfo.event.preventDefault();
      switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
          switch (kbInfo.event.code) {  
            case "KeyE":
              this.keyPressed.push("e");
              break;
            case 'ShiftLeft':
              this.keyPressed.push('Shift');
              break;
          }
          break;

        /* One time trigger events */
        case BABYLON.KeyboardEventTypes.KEYUP:
          switch (kbInfo.event.code) {
            case "KeyE":
              if (this.keyPressed.includes('e')) 
                this.keyPressed = this.keyPressed.filter(l => l !== 'e');
              break;
            case 'ShiftLeft':
              if (this.keyPressed.includes('Shift')) 
                this.keyPressed = this.keyPressed.filter(l => l !== 'Shift');
              break;
            case 'Digit1':
              if (!uiService.hasShot && uiService.currentWeaponId !== 0) {
                uiService.changeWeapon(0, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit2':
              if (!uiService.hasShot && uiService.currentWeaponId !== 1) {
                uiService.changeWeapon(1, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit3':
              if (!uiService.hasShot && player.weaponList[2] && uiService.currentWeaponId !== 2) {
                uiService.changeWeapon(2, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit4':
              if (!uiService.hasShot && player.weaponList[3] && uiService.currentWeaponId !== 3) {
                uiService.changeWeapon(3, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit5':
              if (!uiService.hasShot && player.weaponList[4] && uiService.currentWeaponId !== 4) {
                uiService.changeWeapon(4, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit6':
              if (!uiService.hasShot && player.weaponList[5] && uiService.currentWeaponId !== 5) {
                uiService.changeWeapon(5, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
            case 'Digit7':
              if (!uiService.hasShot && player.weaponList[6] && uiService.currentWeaponId !== 6) {
                uiService.changeWeapon(6, player);
                uiService.swapSound.stop();
                uiService.swapSound.play();
              }
              break;
          }
      }
    };

    // On click event, request pointer lock
    this.canvas.addEventListener('pointerdown', (evt:Event) => {
      evt.preventDefault();
	  	//true/false check if we're locked, faster than checking pointerlock on each single click.
      if (document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock || false;
        this.canvas.requestPointerLock();

        /* Add the mouse events */
        this.scene.onPointerObservable.add(mouseEvent);

        /* Add the keyboard events */
        this.scene.onKeyboardObservable.add(keyboardEvent);

      }
    });
    
    //**********************
    //*       MUSIC        *
    //**********************
    //playing both music
    let startMusic = new BABYLON.Sound("music", "assets/sound/music/fpsStart.wav", this.scene, () => {
      startMusic.play();
    }, {
      volume: 3,
      loop: false,
    });
    startMusic.onended = () => {
      let secondMusic = new BABYLON.Sound("music", "assets/sound/music/fpsLoop.wav", this.scene, () => {
        secondMusic.play();
      }, {
        volume: 3,
        loop: true,
      });
    };
    //**********************
    //*       SKYBOX       *
    //**********************
    let skybox:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/cubemapDebug/", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    let hemisphericLight:BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );

    //**********************
    //*     MATERIALS      *
    //**********************
    // GROUND
    let groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
    //checking env for the texture
    switch(level.envi){
      case 1:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/ground.jpeg", this.scene);
        break;
      default:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
    }
    // WALL
    let wallMaterial =  new BABYLON.StandardMaterial("wallMat", this.scene);
    //checking env for the texture
    switch(level.envi) {
      case 1:
        wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/wall.png", this.scene);
        break;
      default:
        wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
    }

    //**********************
    //*       GROUND       *
    //**********************
    // Adding a ground so we can walk on something
    let groundMesh = BABYLON.MeshBuilder.CreateGround("ground", {width:1, height:1});
    groundMesh.material = groundMat;
    groundMesh.isVisible = false;
    groundMesh.isPickable = false;
    groundMesh.checkCollisions = true;
    groundMesh.alwaysSelectAsActiveMesh = true;

    for(let i = -20; i <= 20; ++i){
      for(let j = -20; j <= 20; ++j){
        let groundInstance:BABYLON.InstancedMesh = groundMesh.createInstance("groundInstance"+i);
        groundInstance.position.x = i;
        groundInstance.position.z = j;
        groundInstance.isVisible = true;
        groundInstance.isPickable = false;
        groundInstance.checkCollisions = true;
        groundInstance.alwaysSelectAsActiveMesh = false;
      }
    }

    //**********************
    //*       WALLS        *
    //**********************
    let wallMesh = BABYLON.MeshBuilder.CreateBox("wall", {size :1, height: 3}, this.scene);
    wallMesh.metadata = "wall";
    wallMesh.material = wallMaterial;

    wallMesh.isVisible = false;
    wallMesh.isPickable = true;
    wallMesh.checkCollisions = false;
    wallMesh.alwaysSelectAsActiveMesh = false;

    for (let i = 0; i < level.walls.length; ++i) {
      let wallInstance:BABYLON.InstancedMesh = wallMesh.createInstance("wallInstance"+i);
      wallInstance.metadata = "wall";
      wallInstance.position.x = level.walls[i][0];
      wallInstance.position.z = level.walls[i][1];
      wallInstance.position.y = 1;
      wallInstance.alwaysSelectAsActiveMesh = true;
      wallInstance.checkCollisions = true;
      wallInstance.isPickable = true;
    }

    for(let i = -20; i < 20; i++) {
      for(let j of [20, -20]){
        let wall1:BABYLON.InstancedMesh = wallMesh.createInstance("box1");
        let wall2:BABYLON.InstancedMesh = wallMesh.createInstance("box2");
        wall1.metadata = "wall";
        wall2.metadata = "wall";
        wall1.position.x = i;
        wall1.position.z = j;
        wall1.position.y = 1;
        wall2.position.x = j;
        wall2.position.z = i;
        wall2.position.y = 1;
        wall1.isPickable = true;
        wall2.isPickable = true;
        wall1.checkCollisions = true;
        wall2.checkCollisions = true;
      }
    }



    //adding the pickeable items:
    for(let i of level.pickups) i.init();
    //adding the doors
    for(let i of level.doors) i.init(this.scene, -1);
    //adding the switches
    for(let i of level.switches) i.init(this.scene);

    //creating the enemy:
    //TODO: move the animation into init
    for(let i = 0; i < level.enemy.length; ++i){
      level.enemy[i].init(this.scene);
      level.enemy[i].playAnimation();
    }

    //Gravity and Collisions Enabled
    this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    this.scene.collisionsEnabled = true;
    for(let i = 0; i < this.ground.length; ++i) this.ground[i].checkCollisions = true;
    // generates the world x-y-z axis for better understanding
    this.showWorldAxis(8);

    //**************************
    //* REGISTER BEFORE RENDER *
    //**************************
    this.scene.registerBeforeRender(() => {
      this.frameCounter++;
      //* Player actions
      //locking the camera on x axis (ghetto way)
      player.lockRotation();
      //checking if a pickup has to be removed:
      level.pickups.filter(pick => !pick.remove);

      //checking if sprinting:
      if (this.keyPressed.includes('Shift')) 
        player.camera.speed = 0.5;
      else 
        player.camera.speed = 0.3;


      //* Pathfinding
      for(let i of level.enemy) i.IA(player, this.scene, this.frameCounter, level.doors);

      //* checking if e is pressed:
      if (this.keyPressed.includes('e')) {
        //shooting a ray
        let ray = player.camera.getForwardRay(5)
        let hit = this.scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray", false);
        for (let i of level.doors) {
          if (i.mesh == hit?.pickedMesh) {
            i.open(player.camera.position, player.inventory, this.scene, uiService);
            break;
          } 
        }
        for (let i of level.switches) {
          if (i.mesh == hit?.pickedMesh || i.topMesh == hit?.pickedMesh) {
            i.on();
            break; 
          }
        }
      }

      //* Checking to open or close doors
      for (let i of level.doors){
        if (i.toOpen){
          if (i.mesh.position.y == 1 && !i.state && i.toOpen) i.openSound(this.scene, player);
          if (i.mesh.position.y <= 4) i.mesh.position.y += 0.1;
          else { 
            i.toOpen = false;
            i.state = true;
            i.mesh.position.y = 4;
            i.counterSinceOpened = this.frameCounter;
          }
        }
        else{
          let isAyoneUnderTheDoor = false;
          if (!i.toClose && i.state && this.frameCounter - i.counterSinceOpened >= 300){
            for(let j of level.enemy){
              if(stuff.distance(i.mesh.position, j.mesh.position) <= 3) isAyoneUnderTheDoor = true; 
            }
            if(3 >= stuff.distance(i.mesh.position, player.camera.position)) isAyoneUnderTheDoor = true;
            if(!isAyoneUnderTheDoor){
              i.closeSound(this.scene, player);
              i.toClose = true;
            }
          }
          else if(i.toClose){
            if(i.mesh.position.y >= 1) i.mesh.position.y -= 0.1;
            else{
              i.toClose = false;
              i.state = false;
              i.mesh.position.y = 1;
              i.counterSinceOpened = 0;
            }
          }
        }
      }

      //* check every enemy if attacked then move the fireball
      for(let i = 0; i < level.enemy.length; ++i){
        //if the enemy fire something, then we move it
        if(level.enemy[i].projectile !== undefined){
          level.enemy[i].projectile.move(this.scene, player, this.frameCounter);
        }
      }
      //checking if player taking pickup
      for(let i of level.pickups){
        i.check(player, this.scene, this.frameCounter);
      }

      // Slow down the animations
      if (animationFrameSkipper != 4)
        ++animationFrameSkipper;
      else {
        //* Weapon firing checks (a weapon has a maximum of 10 animation frames)
        if (uiService.hasShot && 
          uiService.currentWeapon.cellId <= uiService.currentWeaponAnimationFrames + uiService.currentWeaponId * 10
          ) {
          // Check if the animation is done
          if (uiService.currentWeapon.cellId + 1 > uiService.currentWeaponAnimationFrames + uiService.currentWeaponId * 10) {
            uiService.currentWeapon.cellId = uiService.currentWeaponId * 10;
            uiService.hasShot = false;// Shot is done
            // Is the playing still pressing the shoot button ?
            if (player.shooting) {
              player.shoot(this.scene, level, this.canvas);// Shoot again then
            }
          } else 
            ++uiService.currentWeapon.cellId;// If the animation isn't done yet

          animationFrameSkipper = 0;//Reset the timer if the animation is triggered
        }
      }
    });

    this.engine.hideLoadingUI();

    this.animate();
  }


  //********************
  //*     Terrain      *
  //********************
  public createPlanetScene(canvas: ElementRef<HTMLCanvasElement>): void {

    let matrixService: MatrixService = new MatrixService;
    let gesMeLoadService: GestionMeshLoaderService = new GestionMeshLoaderService(matrixService)
    let gesMoPickService: GestionMousePickerService = new GestionMousePickerService(gesMeLoadService, () => {
      // FPS transition
      this.resetScene();
      //TODO Transition screen (BABYLON GUI ?)
      this.createFPSScene(
        new ElementRef<HTMLCanvasElement>(this.canvas), 
        this.levels[0]
      );
      this.animate();
    });

    this.terr2Matrix = this.terrainService.generateTerrain(this.size_z, 15, 100, 100);

    let hudService = new GestionHudService;

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.displayLoadingUI();

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    
    // create a ArcRotateCamera, and set its position to (x:5, y:10, z:-20 )
    let aboveCamera = new BABYLON.ArcRotateCamera(
      'camera1',
      -Math.PI / 4,
      -Math.PI / 2,
      12,
      new BABYLON.Vector3(50, 30, 50),
      this.scene
    );
    aboveCamera.position = new BABYLON.Vector3(0, 70, 0)

    // attach the camera to the canvas
    aboveCamera.attachControl(this.canvas, false);
    //locking the camera
    aboveCamera.upperBetaLimit = 1.2;
    aboveCamera.lowerRadiusLimit = 15;
    aboveCamera.upperRadiusLimit = 125;
    aboveCamera.panningDistanceLimit = 0.1;

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    let hemisphericLight:BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(50, 50, 50),
      this.scene
    );
    this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    //create gestion hud
    hudService.displayGoal(this.scene);

    //this.plane = BABYLON.Mesh.CreatePlane("plane", 1, this.scene, true);
    //this.plane.rotation.x = Math.PI/2;
    this.GroundBoxes = BABYLON.MeshBuilder.CreateBox("GroundBoxes", {width: 1, height: 1, depth: 1}, this.scene);

    let testMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("testMat", this.scene);
    testMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    //this.plane.material = testMat;
    this.GroundBoxes.material = testMat;

    //this.plane.registerInstancedBuffer("color", 4);
    //this.plane.instancedBuffers.color = new BABYLON.Color4(0, 0, 0, 1);
    this.GroundBoxes.registerInstancedBuffer("color", 4);
    this.GroundBoxes.instancedBuffers.color = new BABYLON.Color4(0, 0, 0, 1);

    let colorPaletteRed: number[] = [];
    let colorPaletteGreen: number[] = [];
    let colorPaletteBlue: number[] = [];
    for (let i = 0; i < this.size_z; i++) {
      let tmp: number = (30*(i+1)/(this.size_z+1));
      colorPaletteRed[i] = ((0.0000272718*tmp**5)-(0.00200717*tmp**4)+(0.0503205*tmp**3)-(0.466441*tmp**2)+(1.38804*tmp)+6.6)/25.6;
      colorPaletteGreen[i] = ( Math.exp(((5.1282*i + 2.9744) / this.size_z) - 2.6298) + 13 ) / 25.6;
      colorPaletteBlue[i] = ((0.000167911*tmp**4)-(0.00955384*tmp**3)+(0.169536*tmp**2)-(0.307887*tmp)+2.6)/25.6;
    }
    //console.log(colorPaletteRed, colorPaletteGreen, colorPaletteBlue);

    //console.log(testColorPalette);
    for (let x = 0; x < this.terr2Matrix.length; x++) {
      for (let y = 0; y < this.terr2Matrix[x].length; y++) {
        //let instanceTest:BABYLON.InstancedMesh = this.plane.createInstance("tplane " + (x*y+y));
        let instanceTest:BABYLON.InstancedMesh = this.GroundBoxes.createInstance("tplane " + (x*y+y));
        instanceTest.position.x = x;
        instanceTest.position.z = y;
        //instanceTest.position.y = this.terr2Matrix[x][y];
        if (x == 0 || x == 99 || y == 0 || y == 99) {
          instanceTest.scaling.y = this.terr2Matrix[x][y]*2 + 0.1;
        } else {
          instanceTest.scaling.y = this.terr2Matrix[x][y] + 0.05;
          instanceTest.position.y = this.terr2Matrix[x][y]/2 + 0.025;
        }
        instanceTest.metadata = "ground";
        let tmp: number = this.terr2Matrix[x][y];
        instanceTest.instancedBuffers.color = new BABYLON.Color4(colorPaletteRed[tmp], colorPaletteGreen[tmp], colorPaletteBlue[tmp]);
      }
    }

    gesMeLoadService.initMeshes(this.scene);
    gesMeLoadService.initBuildingMatrix(this.terr2Matrix.length, this.terr2Matrix[0].length);
    gesMeLoadService.load1stQG(50, 50, this.scene, this.terr2Matrix);
    gesMoPickService.addMouseListener(this.scene, this.terr2Matrix);

    //**********************
    //*       SKYBOX       *
    //**********************
    let skybox:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/cubemapDebug/", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    this.engine.hideLoadingUI();

  }

  //**********************
  //*    Render Loop     *
  //**********************
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      const rendererLoopCallback = () => {
        this.scene.render();
      };
      if (this.windowRef.document.readyState !== 'loading') {
        this.engine.runRenderLoop(rendererLoopCallback);
      } else {
        this.windowRef.window.addEventListener('DOMContentLoaded', () => {
          this.engine.runRenderLoop(rendererLoopCallback);
        });
      }

      this.windowRef.window.addEventListener('resize', () => {
        this.engine.resize();
      });
    });
  }

  //**********************
  //*       Debug        *
  //**********************
  /**
   * creates the world axes
   *
   * Source: https://doc.babylonjs.com/snippets/world_axes
   *
   * @param size number
   */
  public showWorldAxis(size: number): void {
    const makeTextPlane = (text: string, color: string, textSize: number) => {
      const dynamicTexture = new BABYLON.DynamicTexture(
        'DynamicTexture',
        50,
        this.scene,
        true
      );
      dynamicTexture.hasAlpha = true;
      dynamicTexture.drawText(
        text,
        5,
        40,
        'bold 36px Arial',
        color,
        'transparent',
        true
      );
      const plane = BABYLON.Mesh.CreatePlane('TextPlane', textSize, this.scene, true);
      const material = new BABYLON.StandardMaterial('TextPlaneMaterial', this.scene);
      material.backFaceCulling = false;
      material.specularColor = new BABYLON.Color3(0, 0, 0);
      material.diffuseTexture = dynamicTexture;
      plane.material = material;

      return plane;
    };

    const axisX = BABYLON.Mesh.CreateLines(
      'axisX',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0),
      ],
      this.scene
    );

    axisX.color = new BABYLON.Color3(1, 0, 0);
    const xChar = makeTextPlane('X', 'red', size / 10);
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0);

    const axisY = BABYLON.Mesh.CreateLines(
      'axisY',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0),
      ],
      this.scene
    );

    axisY.color = new BABYLON.Color3(0, 1, 0);
    const yChar = makeTextPlane('Y', 'green', size / 10);
    yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);

    const axisZ = BABYLON.Mesh.CreateLines(
      'axisZ',
      [
        BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95),
      ],
      this.scene
    );

    axisZ.color = new BABYLON.Color3(0, 0, 1);
    const zChar = makeTextPlane('Z', 'blue', size / 10);
    zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    }
}
