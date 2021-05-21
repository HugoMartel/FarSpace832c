//TODO: change the cone to a realy player model ?
//TODO: creates IA (aled)
//TODO: change camera borders cause it looks like a fatass rn
//TODO ++++: add player death check
//TODO: add a way to the enemy to talk

//TODO: check if the doors are in the right place

import { WindowRefService } from './../services/window-ref.service';

import { ElementRef, Injectable, NgZone, HostListener } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import * as GUI from '@babylonjs/gui';
import "@babylonjs/loaders/glTF"; //don't forget to npm install --save-dev @babylonjs/core @babylonjs/loaders

//services FPS
import { GameLevelService } from '../services/game/fps/game-level.service';
import { GamePlayerService } from '../services/game/fps/player/game-player.service';

//services Gestion
import { TerrainService } from './../services/game/gestion/terrain.service';
import { GestionMousePickerService } from './../services/game/gestion/gestion-mouse-picker.service';
import { GestionMeshLoaderService } from './../services/game/gestion/gestion-mesh-loader.service';

@Injectable({ providedIn: 'root' })
export class GameService {

  private size_z: number = 30;
  private terr2Matrix: any[] = [];

  private canvas!: HTMLCanvasElement;
  public engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  public frameCounter: number;
  private ground!: Array<BABYLON.Mesh>;
  public fullscreen !: Function;
  private plane!: BABYLON.Mesh;
  private GroundBoxes!: BABYLON.Mesh;
  public keyPressed: Array<String>;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService,
    private terrainService: TerrainService,
    private gesMoPickService: GestionMousePickerService,
    private gesMeLoadService: GestionMeshLoaderService
  ) {
    this.frameCounter = 0;
    this.ground = [];
    this.keyPressed = [];
    this.fullscreen = () => {
      //true is to lock the mouse inside
      this.engine.enterFullscreen(true);
    }
  }


  //**********************
  //*       Reset        *
  //**********************
  public resetScene():void {
    this.scene.dispose();
    this.engine.dispose();
    //It seems from the devs that only disposing from the scene leaves some stuff in the memory
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

    let image = new GUI.Image("planetImage", "assets/menu/Gliese_832c-ArtistImpression.png");
    image.width = "330px";
    image.height = "330px";
    image.top = -this.canvas.height / 4;
    image.populateNinePatchSlicesFromImage = true;
    image.stretch = GUI.Image.STRETCH_NINE_PATCH;
    menuUI.addControl(image);
    //grid.addControl(image, 0, 0);

    let playButton = GUI.Button.CreateImageWithCenterTextButton("playButton", "PLAY", "assets/menu/buttonGradient.png");
    playButton.width = 0.2;
    playButton.height = "40px";
    playButton.fontFamily = "Pixelated MS Sans Serif"

    playButton.color = "white";
    menuUI.addControl(playButton);

    playButton.onPointerClickObservable.add((evt) => {
      this.resetScene();
      let enemyTEST = [
        // [[type], [coordx, coordz, state], etc]
        [[1], [2, 2, 1]]
      ];

      let objectsTEST = [[22, 7, 7], [17, 5, 5]];
      let doorTEST = [[14, 13, -1, 0, 0], [-14, -13, -1, 0, 1]];
      let levelTEST = new GameLevelService(
        [
          [1, 4],
          [1, 3],
          [2, 5],
          [12, 13],
          [16, 13]
        ],
        enemyTEST,
        objectsTEST,
        doorTEST,
        1
      );

      //************************************************************************
      //                            FPS or Gestion
      //************************************************************************

      //this.createFPSScene(canvas, levelTEST);
      this.createPlanetScene(canvas);

      this.animate();
    });
  }


  //**********************
  //*      Shooter       *
  //**********************
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
      this.scene.onKeyboardObservable.add((kbInfo) => {
        switch (kbInfo.type) {
        case BABYLON.KeyboardEventTypes.KEYDOWN:
            switch (kbInfo.event.key) {
              case "e":
                this.keyPressed.push("e");
                break;
              case 'Shift':
                this.keyPressed.push('Shift');
                break;
            }
            break;

        case BABYLON.KeyboardEventTypes.KEYUP:
            switch (kbInfo.event.key) {
              case "e":
                  if(this.keyPressed.includes('e')) this.keyPressed = this.keyPressed.filter(l => l !== 'e');
                  break;
              case 'Shift':
                if(this.keyPressed.includes('Shift')) this.keyPressed = this.keyPressed.filter(l => l !== 'Shift');
                break;
            }
        }
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

    let player = new GamePlayerService(this.scene, this.canvas);

    // Add the crosshair to the player camera
    player.addGunSight();

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    let hemisphericLight = new BABYLON.HemisphericLight(
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
    wallMesh.material = wallMaterial;

    wallMesh.isVisible = false;
    wallMesh.isPickable = false;
    wallMesh.checkCollisions = false;
    wallMesh.alwaysSelectAsActiveMesh = false;

    for(let i = 0; i < level.walls.length; ++i){
      let wallInstance:BABYLON.InstancedMesh = wallMesh.createInstance("wallInstance"+i);
      wallInstance.position.x = level.walls[i][0];
      wallInstance.position.z = level.walls[i][1];
      wallInstance.position.y = 1;
      wallInstance.alwaysSelectAsActiveMesh = true;
      wallInstance.checkCollisions = true;
    }

    //TODO: check if there are doubled on the border
    for(let i = -20; i < 20; i++) {
      for(let j of [20, -20]){
        let wall1:BABYLON.InstancedMesh = wallMesh.createInstance("box1");
        let wall2:BABYLON.InstancedMesh = wallMesh.createInstance("box2");
        wall1.position.x = i;
        wall1.position.z = j;
        wall1.position.y = 1;
        wall2.position.x = j;
        wall2.position.z = i;
        wall2.position.y = 1;
        wall1.checkCollisions = true;
        wall2.checkCollisions = true;
      }
    }



    //adding the pickeable items:
    for(let i of level.pickups) i.init();
    //adding the doors
    for(let i of level.doors) i.init(this.scene, -1);

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
    this.scene.registerBeforeRender(() => {
      this.frameCounter++;
      //locking the camera on x axis (ghetto way)
      player.lockRotation();
      //checking if a pickup has to be removed:
      level.pickups.filter(pick => !pick.remove);
      //checking if sprinting:
      if(this.keyPressed.includes('Shift')) player.camera.speed = 0.5;
      else player.camera.speed = 0.3;
      //TODO: fix this shit
      //for(let i = 0; i < level.enemy.length; ++i) level.enemy[i].moveThorwardPlayer([this.camera.position.x, this.camera.position.z]);
      //checking if e is pressed:
      if(this.keyPressed.includes('e')){
        //shooting a ray
        let ray = this.scene.createPickingRay(this.scene.pointerX, this.scene.pointerY, BABYLON.Matrix.Identity(), player.camera);
        let hit = this.scene.pickWithRay(ray);
        //TODO: add switches too
        for(let i of level.doors){
          if(i.mesh == hit?.pickedMesh){
            i.open(player, this.scene);
            break;
          }
        }
      }
      //checking to open or close doors
      for(let i of level.doors){
        if(i.toOpen){
          if(i.mesh.position.y == 1 && !i.state && i.toOpen) i.openSound(this.scene);
          if(i.mesh.position.y <= 4) i.mesh.position.y += 0.1;
          else{
            i.toOpen = false;
            i.state = true;
            i.mesh.position.y = 4;
            i.counterSinceOpened = this.frameCounter;
          }
        }
        else if(!i.toClose && i.state && this.frameCounter - i.counterSinceOpened >= 500 && 3 > (Math.sqrt(Math.pow(i.mesh.position.x - player.camera.position.x, 2) + Math.pow(i.mesh.position.z - player.camera.position.z , 2)))){
          i.closeSound(this.scene);
          i.toClose = true;
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
      //checking if player taking pickup
      for(let i of level.pickups){
        i.check(player, this.scene);
      }
    });
  }


  //********************
  //*     Terrain      *
  //********************
  public createPlanetScene(canvas: ElementRef<HTMLCanvasElement>): void {

    this.terr2Matrix = this.terrainService.generateTerrain(this.size_z, 15, 100, 100);

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    let aboveCamera:BABYLON.FreeCamera = new BABYLON.FreeCamera(
      'camera1',
      new BABYLON.Vector3(0, 55, 10),
      this.scene
    );

    // target the camera to scene origin
    aboveCamera.setTarget(BABYLON.Vector3.Zero());

    // attach the camera to the canvas
    aboveCamera.attachControl(this.canvas, false);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    let hemisphericLight:BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(50, 50, 50),
      this.scene
    );

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

    let testColorPalette: number[] = [];
    for (let i = 0; i < this.size_z; i++) {
      testColorPalette[i] = (i)/(this.size_z-1);
    }
    //console.log(testColorPalette);
    for (let x = 0; x < this.terr2Matrix.length; x++) {
      for (let y = 0; y < this.terr2Matrix[x].length; y++) {
        //let instanceTest:BABYLON.InstancedMesh = this.plane.createInstance("tplane " + (x*y+y));
        let instanceTest:BABYLON.InstancedMesh = this.GroundBoxes.createInstance("tplane " + (x*y+y));
        instanceTest.position.x = x;
        instanceTest.position.z = y;
        //instanceTest.position.y = this.terr2Matrix[x][y];
        instanceTest.scaling.y = this.terr2Matrix[x][y]*2 + 0.1;
        instanceTest.instancedBuffers.color = new BABYLON.Color4(testColorPalette[this.terr2Matrix[x][y]], 0, testColorPalette[this.size_z-1-this.terr2Matrix[x][y]]);
      }
    }

    this.gesMeLoadService.load1stQG(50, 50, this.scene, this.terr2Matrix);
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
