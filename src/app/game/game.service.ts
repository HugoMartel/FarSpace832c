//TODO: change the cone to a realy player model ?
//TODO: add a player class ?
//TODO: creates IA (aled)
//TODO: change and import imp sprite FIX ITs
//TODO: change camera borders cause it looks like a fatass rn

//TODO: add weapon
//TODO: add a way to the enemy to talk

import { WindowRefService } from './../services/window-ref.service';
import { ElementRef, Injectable, NgZone } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
//services
import {GameLevelService} from '../services/game/fps/game-level.service';
//importing enemy
import {GameImpService} from '../services/game/fps/enemy/game-imp.service'
import { GameEnemyService } from '../services/game/fps/game-enemy.service';

@Injectable({ providedIn: 'root' })
export class GameService {
  private canvas!: HTMLCanvasElement;
  private engine!: BABYLON.Engine;
  private camera!: BABYLON.FreeCamera;
  private scene!: BABYLON.Scene;
  private light!: BABYLON.Light;

  private sphere!: BABYLON.Mesh;
  private ground!: BABYLON.Mesh;

  public constructor(
    private ngZone: NgZone,
    private windowRef: WindowRefService
  ) {}

  public createScene(canvas: ElementRef<HTMLCanvasElement>, level: GameLevelService): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);

    // create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    this.camera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 1, -3), this.scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 1, 1));

    // attach the camera to the canvas and adding a few controls
    this.camera.attachControl(this.canvas, false);
    this.camera.keysUp = [90, 38]; // Z or UP Arrow
    this.camera.keysDown = [83, 40]; // S or DOWN ARROW
    this.camera.keysLeft = [81]; // Q or LEFT ARROW
    this.camera.keysRight = [68]; // D or RIGHT ARROW
    //Add attachment controls
    //slowing down the camera speed
    this.camera.speed = 0.3;
    // create a basic light, aiming 0,1,0 - meaning, to the sky
    this.light = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    //adding a ground so we can walk on something
    this.ground = BABYLON.MeshBuilder.CreateGround("ground", {width:100, height:100});
    //ground depending of envi:
    let groundMat = new BABYLON.StandardMaterial('groundMat', this.scene);
    switch(level.envi){
      case 1:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/ground.jpeg", this.scene);
        break;
      default:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
    }
    this.ground.material = groundMat;
    // create a built-in "sphere" shape; its constructor takes 4 params: name, subdivisions, radius, scene
    this.sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, this.scene);

    // create the material with its texture for the sphere and assign it to the sphere
    const spherMaterial = new BABYLON.StandardMaterial('sun_surface', this.scene);
    spherMaterial.diffuseTexture = new BABYLON.Texture(
      'assets/textures/sun.jpg',
      this.scene
    );
    this.sphere.material = spherMaterial;

    //creating the walls:
    let boxx = BABYLON.MeshBuilder.CreateBox("box", {size :1, height: 3}, this.scene);
    let walls = [];
    for(let i = 0; i < level.walls.length; ++i){
      let box = boxx.clone();
      box.position.x = level.walls[i][0];
      box.position.z = level.walls[i][1];
      box.position.y = 0.5;
      box.checkCollisions = true;
      box.material = spherMaterial;
      walls.push(box);
    }
    //removing the base mesh
    boxx.dispose();
    
    //creating the enemy:
    //TODO: create sprite 
    for(let i = 0; i < level.enemy.length; ++i){
      level.enemy[i].init(this.scene);
    }

    // move the sphere upward 1/2 of its height
    this.sphere.position.y = 1;

    //Gravity and Collisions Enabled
    this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    this.scene.collisionsEnabled = true;
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.ground.checkCollisions = true;
    this.sphere.checkCollisions = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1.3, 1, 1.3);
    this.camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0); 
    // generates the world x-y-z axis for better understanding
    this.showWorldAxis(8);
    
    this.scene.registerBeforeRender(() => {
      //locking the camera on x axis (ghetto way)
      this.camera.rotation.x = 0;
      //todo add a check if the enemy is in the good state
      //TODO: fix this shit
      //for(let i = 0; i < level.enemy.length; ++i) level.enemy[i].moveThorwardPlayer([this.camera.position.x, this.camera.position.z]);
    });
    this.scene.registerAfterRender(() => {
      // simple rotation along the y axis
      this.sphere.rotate(new BABYLON.Vector3(0, 1, 0), 0.02, BABYLON.Space.LOCAL);
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
