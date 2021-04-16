//TODO: change the cone to a realy player model ?
//TODO: add a player class ?
//TODO: creates IA (aled)
//TODO: change and import imp sprite FIX ITs
//TODO: change camera borders cause it looks like a fatass rn
//TODO: check if ground like this isn't breaking everything


//TODO: add weapon
//TODO: add a way to the enemy to talk

import { WindowRefService } from './../services/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';

//services
import {GameLevelService} from '../services/game/fps/game-level.service';
import {GamePlayerService} from '../services/game/fps/player/game-player.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private canvas!: HTMLCanvasElement;
  public engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  public frameCounter: number;
  private ground!: Array<BABYLON.Mesh>;
  public fullscreen !: Function;
  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService
  ) {
    this.frameCounter = 0;
    this.ground = [];
    this.fullscreen = () => {
      //true is to lock the mouse inside
      this.engine.enterFullscreen(true);
    }
  }

  public resetScene(canvas: ElementRef<HTMLCanvasElement>):void {
    this.scene.dispose();
    this.engine.dispose();
    //It seems from the devs that only disposing from the scene leaves some stuff in the memory
  }

  public createMenuScene(canvas: ElementRef<HTMLCanvasElement>):void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // Create the view
    let menuCamera = new BABYLON.ArcRotateCamera("Camera", -Math.PI/2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), this.scene);
    menuCamera.attachControl(this.canvas, true);

    // Create the UI object
    let menuUI = GUI.AdvancedDynamicTexture.CreateFullscreenUI(
      "menuUI", true, this.scene
    );

    /*
    let grid = new GUI.Grid();
    grid.addColumnDefinition(1 / 3);
    grid.addColumnDefinition(1 / 3);
    grid.addColumnDefinition(1 / 3);
    advancedTexture.addControl(grid);
      */

    let image = new GUI.Image("but", "assets/menu/Gliese_832c-ArtistImpression.png");
    image.width = "330px";
    image.height = "330px";
    image.populateNinePatchSlicesFromImage = true;
    image.stretch = GUI.Image.STRETCH_NINE_PATCH;
    menuUI.addControl(image);
    //grid.addControl(image, 0, 0);

    let playButton = GUI.Button.CreateSimpleButton("but", "PLAY");
    playButton.width = 0.2;
    playButton.height = "40px";
    playButton.color = "white";
    playButton.background = "green";
    menuUI.addControl(playButton);

    playButton.onPointerClickObservable.add((evt) => {
      this.resetScene(canvas);
      let enemytest = [
        // [[type], [coordx, coordz, state], etc]
        [[1], [2, 2, 1]]
      ];
      let levelTEST = new GameLevelService([
        [1, 4],
        [1, 3],
        [2, 5],
      ], enemytest,1);
      this.createFPSScene(canvas, levelTEST);
      this.animate();
    });
  }

  public createFPSScene(canvas: ElementRef<HTMLCanvasElement>, level: GameLevelService): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;
    //THANKS INTERNET, Locking the pointer down
    //We start without being locked.
    let isLocked = false;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // On click event, request pointer lock
    this.scene.onPointerDown = (evt) => {
	  	//true/false check if we're locked, faster than checking pointerlock on each single click.
      if (!isLocked) {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock || false;
        if (this.canvas.requestPointerLock) {
          this.canvas.requestPointerLock();
        }
      }
    };

    // Skybox
    let skybox:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/cubemapDebug/", this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    let player = new GamePlayerService(this.scene, this.canvas);

    // Create a basic light, aiming 0,1,0 - meaning, to the sky
    let basicLight = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    // Adding a ground so we can walk on something
    let groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
    switch(level.envi){
      case 1:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/ground.jpeg", this.scene);
        break;
      default:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
    }
    let ground = BABYLON.MeshBuilder.CreateGround("ground", {width:1, height:1});
    ground.material = groundMat;
    for(let i = -20; i <= 20; ++i){
      for(let j = -20; j <= 20; ++j){
        let grouund = ground.clone("ground");
        grouund.position.x = i;
        grouund.position.z = j;
        this.ground.push(grouund);
      }
    }
    ground.dispose();
    //ground depending of envi:

    //creating the walls:
    let boxx = BABYLON.MeshBuilder.CreateBox("box", {size :1, height: 3}, this.scene);
    let walls = [];
    for(let i = 0; i < level.walls.length; ++i){
      let box = boxx.clone();
      box.position.x = level.walls[i][0];
      box.position.z = level.walls[i][1];
      box.position.y = 0.5;
      box.checkCollisions = true;
      let wallMaterial =  new BABYLON.StandardMaterial("boxMat", this.scene);
      //checking env for the texture
      switch(level.envi) {
        case 1:
          wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/wall.png", this.scene);
          break;
        default:
          wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
      }
      box.material = wallMaterial;
      walls.push(box);
    }
    //TODO: check if there are doubled on the border
    for(let i = -20; i < 20; i++) {
      for(let j of [20, -20]){
        let box1 = boxx.clone();
        let box2 = boxx.clone();
        box1.position.x = i;
        box1.position.z = j;
        box1.position.y = 0.5;
        box2.position.x = j;
        box2.position.z = i;
        box2.position.y = 0.5;
        box1.checkCollisions = true;
        box2.checkCollisions = true;
        let wallMaterial =  new BABYLON.StandardMaterial("boxMat", this.scene);
        //checking env for the texture
        switch(level.envi) {
          case 1:
            wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/wall.png", this.scene);
            break;
          default:
            wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
        }
        box1.material = wallMaterial;
        box2.material = wallMaterial;
        walls.push(box1);
        walls.push(box2);
      }
    }

    //removing the base mesh
    boxx.dispose();

    //creating the enemy:
    //TODO: create sprite
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
    this.scene.registerBeforeRender(() => {
      this.frameCounter++;
      //locking the camera on x axis (ghetto way)
      player.lockRotation();
      //TODO: fix this shit
      //for(let i = 0; i < level.enemy.length; ++i) level.enemy[i].moveThorwardPlayer([this.camera.position.x, this.camera.position.z]);
    });
    this.scene.registerAfterRender(() => {
      // simple rotation along the y axis
      //check every enemy if attacked then move the fireball
      for(let i = 0; i < level.enemy.length; ++i){
        //if the enemy fire something, then we move it
        if(level.enemy[i].projectile !== undefined){
          level.enemy[i].projectile.move();
        }
      }
    });
  }

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
