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
import * as stuff from '../services/game/fps/randomFunctions/random-functions.service';

//services Gestion
import { TerrainService } from './../services/game/gestion/terrain.service';
import { GestionMousePickerService } from './../services/game/gestion/gestion-mouse-picker.service';
import { GestionMeshLoaderService } from './../services/game/gestion/gestion-mesh-loader.service';
import { MatrixService } from '../services/game/gestion/matrix.service';
import { GestionHudService } from './../services/game/gestion/gestion-hud.service';
import { GestionSlidesService } from '../services/game/gestion/gestion-slides.service';

@Injectable({ providedIn: 'root' })
export class GameService {

  private size_z: number = 30;
  private terr2Matrix: number[][] = [];
  private buildList: number[][] = [[50, 50]];

  public canvas!: HTMLCanvasElement;
  public engine!: BABYLON.Engine;
  private scene!: BABYLON.Scene;
  public frameCounter: number;
  public weaponMaxFrames: number[];
  private ground!: Array<BABYLON.Mesh>;
  public isFPS: boolean;
  public fullscreen: Function;
  private GroundBoxes!: BABYLON.Mesh;
  public keyPressed: Array<String>;

  public level!: GameLevelService;
  //levels stuff:
  public allWalls: Array<Array<Array<number>>>;
  public allEnemies: Array<Array<Array<Array<number>>>>;
  public allPickups: Array<Array<Array<number>>>;
  public allDoors: Array<Array<Array<number>>>;
  public allSwitches: Array<Array<Array<number>>>;
  public levelNumber: number;
  public allPlayerSpawn: Array<BABYLON.Vector3>;
  public allMapSize: Array<number>;

  public constructor(
    private ngZone: NgZone,
    private menuService: MenuService,
    private windowRef: WindowRefService,
    private terrainService: TerrainService
  ) {
    this.frameCounter = 0;
    this.weaponMaxFrames = [2,1,4,4,1,1,4];
    this.ground = [];
    this.keyPressed = [];
    this.isFPS = false;
    this.fullscreen = () => {
      if (this.engine && !this.engine.isFullscreen)
        this.engine.enterFullscreen(false);
    }
    //defining the levelNumber
    //!NEVER 0: 0 is the debug level
    this.levelNumber = 1;

    //defining the levels var
    this.allWalls = [
      //note: [coordX, coordZ, size, true for x/ false for y]
      //LEVEL TMP
      [

      ],
      //LEVEL 1
      [
        [0, -3, 4, 0], [0, 4, 4, 0], [1, 6, 5, 0], [2, 6, 2, 1], [7, 6, 4, 1], [11, 5, 2, 0], [12, 6, 6, 1], [2, 11, 7, 1], [1, -2, 3, 1], [3, -6, 4, 0], [4, -6, 4, 1], [7, -5, 4, 0], [8, -2, 3, 1], [9, -7, 6, 0], [2, -8, 7, 1], [1, -11, 3, 0], [-8, -10, 9, 1], [-8, -16, 6, 0], [-8, -16, 9, 1], [1, -15, 1, 1], [2, -16, 8, 1], [10, -16, 5, 0], [11, -12, 5, 1], [15, -14, 2, 0], [16, -15, 5, 1], [21, -14, 7, 0], [16, -7, 5, 1], [16, -6, 4, 0], [14, -2, 1, 1], [15, -2, 6, 0], [10, -1, 1, 0], [11, 4, 4, 1], [2, 11, 7, 1], [9, 10, 13, 1], [16, 0, 6, 0], [17, -1, 5, 1], [22, 0, 10, 0], [21, 6, 1, 1], [-11, -4, 11, 1], [-23, -3, 13, 1], [-11, -2, 1, 1], [-11, 2, 2, 0], [-24, -2, 5, 0], [-23, 3, 12, 1], [-12, 4, 14, 0], [-11, 16, 10, 1], [-1, 7, 11, 0], [-8, 11, 1, 1], [-9, 13, 1, 1],
        [-11, 7, 4, 1], [-4, 7, 4, 1], [-14, -2, 2, 0], [-20, 1, 2, 0], [-19, 1, 2, 0], [-5, 1, 2, 0], [-6, 1, 2, 0], [6, -14, 2, 0], [13, -6, 3, 1], [13, -7, 3, 1], [15, -8, 1, 1]
      ],
      //LEVEL 2
      [
        [-3, -1, 11, 1], [-3, -5, 4, 0], [-2, -6, 3, 1], [-3, -13, 7, 0], [4, -6, 4, 1], [8, -9, 5, 0], [8, -16, 4, 0], [9, -5, 5, 1], [13, -4, 3, 0], [11, -1, 9, 1], [17, -5, 4, 0], [18, -5, 2, 1], [20, -16, 11, 0], [20, 0, 16, 0], [7, 0, 16, 0], [8, 16, 12, 1], [1, 13, 3, 0], [-3, 12, 4, 1], [-3, 4, 8, 0], [-14, -3, 7, 0], [-18, -3, 7, 0], [-13, -3, 6, 1], [-6, -17, 27, 1], [-7, -16, 5, 0], [-17, -13, 10, 1], [-20, -17, 3, 1], [-21, -16, 13, 0], [-20, -3, 2, 1], [-13, -3, 6, 1], [-7, -8, 5, 0], [-6, -8, 3, 1], [-13, 3, 10, 1], [-20, 3, 2, 1], [-21, 4, 12, 0], [-20, 16, 11, 1], [-9, 8, 8, 0], [-8, 16, 9, 1], [-17, -16, 3, 0],
        //fioritures
        [15, 8, 5, 0], [12, 10, 3, 1], [12, -11, 3, 1], [15, -13, 5, 0],
      ],
      //LEVEL 3
      [
        [-22,17,44,1], [-22,-18,35,0], [-21,-18,43,1], [21, -17, 34, 0], [-21, 16, 8, 1], [-12, 16, 7, 1], [-13, 14, 2, 0], [-5, 12, 4, 0], [-4, 12, 3, 1], [-2, 13, 3, 0], [-1, 16, 3, 1], [2, 12, 4, 0], [3, 12, 3, 1], [5, 13, 3, 0], [6, 16, 7, 1], [14, 16, 6, 1], [13, 14, 2, 0], [20, -16, 32, 0], [19, 8, 1, 1], [5, 8, 11, 1], [13, 9, 2, 0], [-17, -3, 34, 1], [-5, -2, 11, 0], [-15, 8, 10, 1], [-13, 9, 2, 0], [-21, -16, 32, 0], [-20, 8, 2, 1], [-20, -17, 40, 1], [-15, 1, 6, 1], [-10, 2, 3, 0], [-10, -16, 9, 0], [-4, 5, 3, 1], [-2, 2, 3, 0], [-1, 1, 3, 1], [2, 2, 4, 0], [5, -2, 10, 0], [3, 5, 2, 1], [10, 1, 6, 1], [10, 2, 3, 0], [9, -12, 9, 0], [-4, -13, 7, 0], [3, -13, 7, 0], [-3, -10, 6, 1],
      ],
      //LEVEL 4
      [
        [-20, 16, 40, 1], [-8, 14, 2, 0], [7, 14, 2, 0], [20, -16, 32, 0], [-20, -16, 40, 1], [-21, -16, 32, 0], [-20, 0, 3, 1], [-14, 0, 11, 1], [-4, 1, 7, 0], [-8, 1, 1, 0], [-8, 5, 6, 0], [-7, 7, 3, 1], [-9, -16, 16, 0], [-8, -4, 10, 1], [0, -11, 7, 0], [0, -3, 11, 0], [-3, -1, 3, 1], [0, 7, 7, 1], [7, 6, 8, 1], [5, -4, 7, 1], [7, -3, 9, 0], [6, 8, 3, 0], [6, -9, 9, 1], [15, -4, 5, 1], [18, 6, 2, 1], [-17, -13, 2, 1], [-16, -16, 3, 0], [0, -16, 2, 0],
      ]
    ]
    //all enemy
    this.allEnemies = [
      [
        //LEVEL 0:
        [[1], [4, 4, 0], [5, 5, 0], [-7, -7, 0]],
      ],
      //LEVEL 1
      [
        [[1], [2, 1, 0], [-5, -2, 0], [-7, 5, 0], [-6, 10, 0], [-22, 1, 0], [5, 8, 0], [14, 8, 0], [18, 4, 0], [20, 4, 0], [11, -6, 0], [19, -13, 0], [7, -15, 0]],
      ],
      //LEVEL 2
      [
        [[1], [-16, -9, 0], [-16, -6, 0], [-16, 1, 0], [-17, 12, 0], [-14, 12, 0], [-9, 6, 0], [-6, 14, 0], [-5, -15, 0], [4, -9, 0], [1, -9, 0], [13, -13, 0], [17, -10, 0], [18, 1, 0], [18, 14, 0], [9, 10, 0]],
      ],
      //LEVEL 3
      [
        [[1], [1, -9, 0], [8, 13, 0], [11, 11, 0], [11, 14, 0], [17, 11, 0], [17, 14, 0], [8, 5, 0], [16, 5, 0], [7, 1, 0], [18, 1, 0], [12, -6, 0], [16, -6, 0], [16, -11, 0], [9, -15, 0], [6, -9, 0], [3, -5, 0], [-4, -5, 0], [-1, -13, 0], [-10, -5, 0], [-16, -7, 0], [-19, -12, 0], [-8, 1, 0], [-18, 4, 0], [-8, 6, 0], [-17, 14, 0], [-17, 11, 0], [-11, 11, 0], [-11, 14, 0], [-8, 13, 0], ],
      ],
      //LEVEL 4
      [
        [[1], [-6, 14, 0], [4, 14, 0], [5, 9, 0], [10, 8, 0], [13, 14, 0], [15, 10, 0], [10, 3, 0], [16, 1, 0], [12, -2, 0], [3, -9, 0], [3, -13, 0], [5, -11, 0], [9, -12, 0], [13, -12, 0], [17, -12, 0],[5, -14, 0],[11, -14, 0],[15, -14, 0],[8, -15, 0], [18, -15, 0], [-4, -10, 0], [-4, -14, 0], [-7, -13, 0], [-15, 13, 0], [-15, 9, 0], [-15, 4, 0], [-18, 11, 0], [-18, 3, 0], [-17, 6, 0], [-13, 7, 0], [-12, 12, 0], [-11, 3, 0], [-18, -5, 0], [-14, -5, 0], [-16, -10, 0], [-12, -13, 0],]
      ]
      
    ];
    //all pickups:
    this.allPickups = [
      [
        //LEVEL 0
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
      ],
      [
        //LEVEL 1
        //red key:
        [25, -21, 0],
        //blue key
        [26, 19, 1],
        //yellow key
        [27, 18, -13],
        //shotgun
        [16 ,-6, 15],
        //some shells
        [9, 0, -11], [9, 0, -15],
        //health
        [2, 20, 1], [2, -22, -1], [2, -3, -13], [2, 2, -9],
        //some armor pickups
        [1, 5, 0], [1, 5, 1], [1, 5, 2], [1, 0, 5], [1, 0, 6], [1, 1, 6],
        [1, -12, 1], [1, -12, 2], [1, -13, 2], [1, -14, 2],
        //some health pickups
        [0, 10, 5], [0, 10, 4], [0, 9, 5], [0, -11, 8], [0, -9, 8], [0, -10, 8],
        [0, -15, 2], [0, -16, 2], [0, -17, 2], [0, -17, 1], [0, 2, -10], [0, 3, -9],
        //some clips
        [7, 14, 3], [1, 7, 11], [1, 8, 11], [7, 14, -3], [7, 15, -3], [7, 14, -4],
        //one green armor
        [3, 19, 2],
      ],
      [
        //level 2
        //yellow key
        [27, 18, 10],
        //blue key
        [26, 15, -3],
        //some health pickups
        [0, 13, 9], [0, 14, 9], [0, 13, 8], [0, 13, 9], [0, 6, -7], [0, 7, -8], [0, 7, -15], [0, 6, -16], [0, -20, 5], [0, -19, 4], [0, -20, 14], [0, -19, 15],
        //some armor pickups
        [1, -19, -12], [1, -19, -11], [1, -19, -10], [1, -19, -9], [1, -19, -8], [1, -18, -8], [1, -17, -8], [1, -16, -8], 
        [1, -16, -7], [1, -16, -6], [1, -16, -5], [1, -16, -4], [1, -15, -8], [1, -14, -8], [1, -13, -8], [1, -13, -9], [1, -13, -10], [1, -12, -10],
        [1, -11, -10], [1, -10, -10], [1, -9, -10], [1, -8, -10], [1, -10, 14], [1, -11, 15],
        //medipack
        [2, 7, -16], [2, 19, 0], [2, -20, 15], [2, -10, -15],
        //one soul sphere
        [5, 14, -10],
        //one berserk
        [22, -16, 5],
        //one green armor
        [3, -2, -7],
        //Shotgun
        [16, -19, -12],
        //some shells
        [9, -20, -4], [9, -8, -4], [9, -14, 12], [9, -16, -1], [9, -5, -10], [9, 7, -7], [9, -20, 4], [9, -4, 4], [9, -15, 9], [9, -15, 11],
        //bullet box
        [8, 14, 12], [8, 13, 11],
        //Clips
        [7, -14, 9], [7, -16, 9], [7, -16, 11], [7, -14, 11],
        //chaingun
        [18, 14, 11],
      ],
      [
        //LEVEL 3
        //blue key:
        [26, 12, 3],
        //red key
        [25, -12, 3],
        //shotgun
        [16, 0, 13],
        //shells 
        [10, 0, 11], [9, 7, 9], [9, 8, 9], [9, 15, -4], [9, 14, -4], 
        //chaingun
        [18, -1, 11],
        //SSG
        [17, 14, -9],
        //bullet
        [8, 11, 9], [8, 3, 11], [7, 4, 11], [7, 4, 10], [7, 12, 9], [7, 12, 10], [8, 14, 3], [7, 15, 3],
        //backpack
        [24, 3, 7],
        //health pick up
        [0, -2, 6], [0, -3, 6], [0, -4, 6], [0, -2, 7], [0, -3, 7], [0, -4, 7], [0, -2, 8], [0, -3, 8], [0, -4, 8], [0, -11, 2], [0, -12, 2], [0, -9, -10], [0, -8, -10], [0, -7, -10], [0, -9, -11], [0, -8, -11], [0, -7, -11], [0, -9, -12], [0, -8, -12], [0, -7, -12], 
        //medikit
        [2, 6, -2], [2, -6, -2], [2, -20, -16], 
        //armor
        [1, -12, 9], [1, -11, 9], [1, -10, 9], [1, -9, 9], [1, -8, 9], [1, -7, 9], [1, -12, 10], [1, -12, 14], [1, -12, 15], [1, -11, 15], [1, -10, 15], [1, -9, 15], [1, -8, 15], [1, -7, 15], [1, -6, 15], [1, -6, 14], [1, -6, 13], [1, -6, 12], 
        //blue armor
        [4, 7, -5],
      ],
      [
        //LEVEL 4
        //blue key
        [26, 3, 4],
        //red key
        [25, -19, -15],
        //yellow key
        [27, -5, -6],
        //shotgun
        [16, -2, 1],
        //SSG
        [17, -2, 1],
        //chaingun
        [18, -2, 1],
        //plasma
        [20, 1, -2],
        //immunity
        [23, 15, -3],
        //megasphere
        [6, 6 , -3],
        //backpack
        [24, -2, 1],
        //bullet box
        [10, -2, 1],
        //box of shells
        [8, -2, 1],
        //energy pack
        [14, 1, -3],
        //health pickup
        [0, -7, 8], [0, -7, 8], [0, -6, 9], [0, 5, 8], [0, 6, 8], [0, 6, 9], [0, 8, 7], [0, 9, 7], [0, 10, 7], [0, 11, 7], [0, 12, 7], [0, 13, 7], [0, 14, 7], [0, -20, 1], [0, -19, 1], [0, -18, 1], 
        //armor pickup
        [1, 5, 15], [1, 6, 15], [1, 6, 14], [1, 18, 7], [1, 19, 7], [1, 19, 8], [1, 19, 9], [1, 19, 10], [1, -14, 1], [1, -13, 1], [1, -12, 1], [1, -11, 1], [1, -10, 1], [1, -9, 1], 
        //medikit
        [2, -19, 2],
        //bullet Box
        [8, 8, 14], [8, 8, -2], [8, -18, 15], [8, 8, -1],
        //box of shells
        [10, 8, 15], [10, 9, 15], [10, 8, -3], [10, 9, -3], [10, -20, 15], [10, -19, 15], 

      ]
    ];
    //all doors
    this.allDoors = [
      [
        //LEVEL 0 
        //note:
        //CoordX, coordZ, key, rotation
        //rotation 0 = parallele a abs
        [14, 13, 2, 0], 
        [-14, -13, 1, 1]
      ],
      [
        //LEVEL 1
        //needing nothing
        [5, -2, -1, 0],
        [-11, 0, -1, 1],
        //needing a red key
        [5, 6, 0, 0],
        [19, 6, 0, 0],
        //needing a blue key
        [12, -2, 1, 0],
        [15, -10, 1, 1],
        //needing a yellow key
        [1, -13, 2, 1],
      ],
      [
        //LEVEL 2
        //no key needed
        [2, -6, -1, 0],
        [8, -11, -1, 1],
        [15, -5, -1, 0],
        [-7, -10, -1, 1],
        [-19, -13, -1, 0],
        [-3, 14, -1, 1],
        //needing  a blue key
        [9, -1, 1, 0],
        [-16, -3, 1, 0],
        //needing a yellow key
        [-16, 3, 2, 0],
      ],
      [
        //LEVEL 3
        //no key needed
        [0, 12, -1, 0],
        [5, 10, -1, 1],
        [13, 12, -1, 1],
        [17, 8, -1, 0],
        [18, -3, -1, 0],
        [-5, 10, -1, 1],
        [-17, 8, -1, 0],
        //needing a blue key
        [-19, -3, 1, 0],
        //needing a red key
        [-13, 12, 0, 1],
        [0, 5, 0, 0],
      ],
      [
        //LEVEL 4
        //no key needed
        [-2, 3, -1, 0],
        [7, 12, -1, 1],
        [16, 6, -1, 0],
        [13, -4, -1, 0],
        [3, -4, -1, 0],
        //needing a blue key
        [-8, 12, 1, 1],
        [-16, 0, 1, 0],
        [-19, -13, 1, 0],
        //needing a red key
        [0, -13, 0, 1],
        //needing a yellow key
        [-8, 3, 2, 1],
      ],
    ];
    //all switches
    this.allSwitches = [
      [
        //level 0
        [11, 11, 0],
      ],
      [
        //level 1
        [-5 ,-13, 0],
      ],
      [
        //level 2
        [-1, 14, 0],
      ],
      [
        //level 3
        [0, 3, 0],
      ],
      [
        //LEVEL 4
        [-6, 3, 0],
      ]
    ];
    //setting spawns:
    this.allPlayerSpawn = [
      //level 0
      new BABYLON.Vector3(0, 0, 0),
      //level 1
      new BABYLON.Vector3(5, 0, -4),
      //level 2
      new BABYLON.Vector3(-19, 0, -15),
      //level 3
      new BABYLON.Vector3(0, 0, 14),
      //LEVEL 4
      new BABYLON.Vector3(-2, 0, 1),

    ]
    //setting the map sizes:
    this.allMapSize = [
      //level 0:
      40,
      //level 1:
      46,
      //level 2:
      42,
      //level 3:
      42,
      //LEVEL 4
      42,
    ]
  }


  //==================================================================================================================================================
  //**********************
  //*       Reset        *
  //**********************
  public async resetScene() {
    this.engine.stopRenderLoop();
    this.scene.dispose();
    while (this.engine.getLoadedTexturesCache().length > 0) {
      this.engine._releaseTexture(this.engine.getLoadedTexturesCache()[0]);
  }
    this.engine.dispose();
    //It appears from the devs that only disposing from the scene leaves some stuff in the memory
  }


  //==================================================================================================================================================
  //**********************
  //*       Menu         *
  //**********************
  public async createMenuScene(canvas: ElementRef<HTMLCanvasElement>) {
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
    let planet:GUI.Image = new GUI.Image("planetImage", "assets/FarSpace832c.png");
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
        this.createPlanetScene(canvas, false);
      }

      introVideo.addEventListener('ended', (event:Event) => {
        event.preventDefault();
        videoContainer?.removeChild(introVideo);
        canvas.nativeElement.style.display = "block";
      });

    });
  }


  //==================================================================================================================================================
  //**********************
  //*      Shooter       *
  //**********************
  public async createFPSScene(canvas: ElementRef<HTMLCanvasElement>) {
    this.isFPS = true;

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Create the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);
    this.engine.enterPointerlock();
    this.engine.displayLoadingUI();
    let animationFrameSkipper = 0;

    // Create a basic BJS Scene object
    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);


    //**********************
    //*       SKYBOX       *
    //**********************
    let skybox:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
      "assets/textures/skybox/skyboxRedNebulaeNormalSun/", 
      this.scene, 
      ["right.png","top.png","front.png","left.png","bottom.png","back.png"]
    );
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // INIT SERVICES
    let uiService = new GameUIService(this.scene, this.menuService);
    let player = new GamePlayerService(this.scene, this.canvas, uiService, this.allPlayerSpawn[this.levelNumber],() => {
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

        this.createFPSScene(canvas);
      });
      //stopping the render loop and releasing the pointer
      this.engine.exitPointerlock();
      //this.engine.stopRenderLoop();//! if fullscreen is exited or entered, the game will not show up
    });
    //creating the level:
    //Create the FPS Levels
    this.level = new GameLevelService(
      this.allWalls[this.levelNumber],
      this.allEnemies[this.levelNumber],
      this.allPickups[this.levelNumber],
      this.allDoors[this.levelNumber],
      this.allSwitches[this.levelNumber],
      1,
      () => {
        ++this.levelNumber;
        this.resetScene();
        this.createPlanetScene(new ElementRef<HTMLCanvasElement>(this.canvas), true);
        this.animate();
      }
    );
    
    //DEBUG
    //Add the camera, to be shown as a cone and surrounding collision volume
    /*let viewCamera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 8, -2), this.scene);
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
        player.shoot(this.scene, this.level, this.canvas, this.frameCounter);
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


    /* Add the mouse events */
    this.scene.onPointerObservable.add(mouseEvent);

    /* Add the keyboard events */
    this.scene.onKeyboardObservable.add(keyboardEvent);

    // On click event, request pointer lock
    this.canvas.addEventListener('pointerup', (evt:Event) => {
      evt.preventDefault();
	  	//true/false check if we're locked, faster than checking pointerlock on each single click.
      if (this.isFPS && document.pointerLockElement !== this.canvas) {
        this.canvas.requestPointerLock = this.canvas.requestPointerLock || this.canvas.msRequestPointerLock || this.canvas.mozRequestPointerLock || this.canvas.webkitRequestPointerLock || false;
        this.canvas.requestPointerLock();
        this.engine.enterPointerlock();
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
    switch(this.level.envi){
      case 1:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/ground.jpeg", this.scene);
        break;
      default:
        groundMat.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
    }
    // WALL
    let wallMaterial =  new BABYLON.StandardMaterial("wallMat", this.scene);
    //checking env for the texture
    switch(this.level.envi) {
      case 1:
        wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/Env1/wall.png", this.scene);
        break;
      default:
        wallMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/error.jpg", this.scene);
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

    for (let i = 0; i < this.allWalls[this.levelNumber].length; ++i) {
      for(let j = 0; j < this.allWalls[this.levelNumber][i][2]; ++j){
        let wallInstance:BABYLON.InstancedMesh = wallMesh.createInstance("wallInstance"+i);
        wallInstance.metadata = "wall";
        //going on x+
        if(this.allWalls[this.levelNumber][i][3] == 1){
          wallInstance.position.x = this.level.walls[i][0] + j;
          wallInstance.position.z = this.level.walls[i][1];
        }
        else{
          wallInstance.position.x = this.level.walls[i][0];
          wallInstance.position.z = this.level.walls[i][1] + j;
        }
        wallInstance.position.y = 1;
        wallInstance.alwaysSelectAsActiveMesh = true;
        wallInstance.checkCollisions = true;
        wallInstance.isPickable = true;
      }
    }
    wallMesh.freezeWorldMatrix();
    /*
    //OLD: creating some walls arround the map
    for(let i = -this.allMapSize[this.levelNumber]/2; i < this.allMapSize[this.levelNumber]/2; ++i){
      for(let j of [-this.allMapSize[this.levelNumber]/2, this.allMapSize[this.levelNumber]/2]){
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
    */

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

    for(let i = -this.allMapSize[this.levelNumber]/2; i <= 1/2 * this.allMapSize[this.levelNumber]; ++i){
      for(let j = -this.allMapSize[this.levelNumber]/2; j <= this.allMapSize[this.levelNumber]/2; ++j){
        //adding the ground
        let groundInstance:BABYLON.InstancedMesh = groundMesh.createInstance("groundInstance"+i);
        groundInstance.position.x = i;
        groundInstance.position.z = j;
        groundInstance.isVisible = true;
        groundInstance.isPickable = false;
        groundInstance.checkCollisions = true;
        groundInstance.alwaysSelectAsActiveMesh = false;
      }
    }



    //adding the pickeable items:
    for(let i of this.level.pickups) i.init();
    //adding the doors
    for(let i of this.level.doors) i.init(this.scene, -1);
    //adding the switches
    for(let i of this.level.switches) i.init(this.scene);

    //creating the enemy:
    for(let i = 0; i < this.level.enemy.length; ++i){
      this.level.enemy[i].init(this.scene);
    }

    //Gravity and Collisions Enabled
    this.scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
    this.scene.collisionsEnabled = true;
    for(let i = 0; i < this.ground.length; ++i) this.ground[i].checkCollisions = true;

    //**************************
    //* REGISTER BEFORE RENDER *
    //**************************
    this.scene.registerBeforeRender(() => {
      this.frameCounter++;
      //* Player actions
      //locking the camera on x axis (ghetto way)
      player.lockRotation();
      //checking if a pickup has to be removed:
      this.level.pickups.filter(pick => !pick.remove);

      //checking if sprinting:
      if (this.keyPressed.includes('Shift'))
        player.camera.speed = 0.5;
      else
        player.camera.speed = 0.3;


      //* Pathfinding
      for(let i of this.level.enemy) i.IA(player, this.scene, this.frameCounter, this.level.doors);

      //* checking if e is pressed:
      if (this.keyPressed.includes('e')) {
        //shooting a ray
        let ray = player.camera.getForwardRay(3);
        let hit = this.scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray", false);
        for (let i of this.level.doors) {
          if (i.mesh == hit?.pickedMesh) {
            i.open(player.camera.position, player.inventory, this.scene, uiService);
            break;
          }
        }
        for (let i of this.level.switches) {
          if (i.mesh == hit?.pickedMesh || i.topMesh == hit?.pickedMesh) {
            i.on();
            break;
          }
        }
      }

      //* Checking to open or close doors
      for (let i of this.level.doors){
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
            for(let j of this.level.enemy){
              if (stuff.distance(i.mesh.position, j.mesh.position) <= 3 && j.state != 2) isAyoneUnderTheDoor = true;
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
      for(let i = 0; i < this.level.enemy.length; ++i){
        //if the enemy fire something, then we move it
        if(this.level.enemy[i].projectile !== undefined){
          this.level.enemy[i].projectile.move(this.scene, player, this.frameCounter);
        }
      }
      //checking if player taking pickup
      for(let i of this.level.pickups){
        i.check(player, this.scene, this.frameCounter);
      }

      // Slow down the animations
      if (animationFrameSkipper != this.weaponMaxFrames[player.equippedWeapon])
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
              player.shoot(this.scene, this.level, this.canvas, this.frameCounter);// Shoot again then
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


  //==================================================================================================================================================
  //********************
  //*     Terrain      *
  //********************
  public async createPlanetScene(canvas: ElementRef<HTMLCanvasElement>, isGenerated: boolean) {
    this.isFPS = false;

    if (!isGenerated)
      this.terr2Matrix = this.terrainService.generateTerrain(this.size_z, 15, 100, 100);

    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    // Then, load the Babylon 3D engine:
    this.engine = new BABYLON.Engine(this.canvas, true);//? if too laggy disable antialiasing
    this.engine.exitPointerlock();

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
    aboveCamera.attachControl(this.canvas, false, );
    //locking the camera
    aboveCamera.upperBetaLimit = 1.2;
    aboveCamera.lowerRadiusLimit = 15;
    aboveCamera.upperRadiusLimit = 125;
    aboveCamera.panningDistanceLimit = 0.1;

    // Init Services
    let hudService = new GestionHudService(this.levelNumber-1);
    hudService.displayGoal(this.scene);
    let matrixService: MatrixService = new MatrixService;
    let gesMeLoadService: GestionMeshLoaderService = new GestionMeshLoaderService(matrixService);
    let gesSlidesService: GestionSlidesService = new GestionSlidesService(this.levelNumber-1, hudService.hud, () => {
      // FPS transition
      this.resetScene();
      this.createFPSScene(new ElementRef<HTMLCanvasElement>(this.canvas));
    });
    let gesMoPickService: GestionMousePickerService = new GestionMousePickerService(gesMeLoadService, gesSlidesService);

    // create a basic light, aiming 0,1,0 - meaning, to the sky
    let hemisphericLight:BABYLON.HemisphericLight = new BABYLON.HemisphericLight(
      'light1',
      new BABYLON.Vector3(50, 50, 50),
      this.scene
    );
    this.scene.ambientColor = new BABYLON.Color3(1, 1, 1);

    //**********************
    //*       SKYBOX       *
    //**********************
    let skybox:BABYLON.Mesh = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    let skyboxMaterial:BABYLON.StandardMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("assets/textures/skybox/skyboxRedNebulaeNormalSun/", this.scene, ["right.png","top.png","front.png","left.png","bottom.png","back.png"]);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;


    this.GroundBoxes = BABYLON.MeshBuilder.CreateBox("GroundBoxes", {width: 1, height: 1, depth: 1}, this.scene);

    let testMat: BABYLON.StandardMaterial = new BABYLON.StandardMaterial("testMat", this.scene);
    testMat.diffuseColor = new BABYLON.Color3(1, 1, 1);

    this.GroundBoxes.material = testMat;

    this.GroundBoxes.registerInstancedBuffer("color", 4);
    this.GroundBoxes.instancedBuffers.color = new BABYLON.Color4(0, 0, 0, 1);

    // Generate the color palette of our ground (green -> white)
    let colorPaletteRed: number[] = [];
    let colorPaletteGreen: number[] = [];
    let colorPaletteBlue: number[] = [];
    for (let i = 0; i < this.size_z; i++) {
      let tmp: number = (30*(i+1)/(this.size_z+1));
      colorPaletteRed[i] = ((0.0000272718*tmp**5)-(0.00200717*tmp**4)+(0.0503205*tmp**3)-(0.466441*tmp**2)+(1.38804*tmp)+6.6)/25.6;
      colorPaletteGreen[i] = ( Math.exp(((5.1282*i + 2.9744) / this.size_z) - 2.6298) + 13 ) / 25.6;
      colorPaletteBlue[i] = ((0.000167911*tmp**4)-(0.00955384*tmp**3)+(0.169536*tmp**2)-(0.307887*tmp)+2.6)/25.6;
    }


    // Create instances of meshes to display the ground
    for (let x = 0; x < this.terr2Matrix.length; x++) {
      for (let y = 0; y < this.terr2Matrix[x].length; y++) {
        let instanceTest:BABYLON.InstancedMesh = this.GroundBoxes.createInstance("tplane " + (x*y+y));
        instanceTest.position.x = x;
        instanceTest.position.z = y;

        // Make the outer border lower than the actual bottom to optimize meshes and geometry
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

    this.GroundBoxes.freezeWorldMatrix();

    // Load the 3D models in the scene
    gesMeLoadService.initMeshes(this.scene, this.levelNumber, () => {
      gesMeLoadService.initBuildingMatrix(this.terr2Matrix.length, this.terr2Matrix[0].length);
      gesMeLoadService.setupPlacedModules(this.buildList, this.scene, this.terr2Matrix);
      gesMoPickService.addMouseListener(this.scene, this.terr2Matrix, this.buildList, hudService);

      let ambianceMusic = new BABYLON.Sound("music", "assets/sound/music/ambiance.wav", this.scene, () => { ambianceMusic.play(); }, { volume: .3, loop: true, });
      if (this.levelNumber == 1)
        gesSlidesService.displayIntro();

      this.animate();
    });

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
}
