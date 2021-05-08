import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';

import { GameUIService } from '../game-ui.service';

//TODO: add imunty & bersek
//TODO: add a function to end the the game when no health 
@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {
  health: number;
  armor: number;
  lastArmor: number;
  hasBackPack: boolean;
  onBerserk : boolean;
  isImmune: boolean;
  frameSinceImmune: number;
  weaponList: Array<boolean>;
  equipedWeapon: number;
  //note: we're using the camera position as player coord
  camera!:BABYLON.FreeCamera;
  sphere!: BABYLON.Mesh;
  inventory: Array<boolean>; //keys
  ammos: Array<number>;
  lockRotation: Function;
  shoot: Function;
  addGunSight: Function;
  applyDamage: Function;
  gameUIService:GameUIService;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement){ 
    this.gameUIService = new GameUIService;

    this.health = 100;
    this.hasBackPack = false;
    this.onBerserk = false;
    this.isImmune = false;
    this.frameSinceImmune = 0;
    this.armor = 0;
    this.lastArmor = 0;
    /*
    * +------------------+----------+
    * | weaponlist Index |  weapon  |
    * +------------------+----------+
    * |                0 | fist     |
    * |                1 | pistol   |
    * |                2 | shotgun  |
    * |                3 | ssg      |
    * |                4 | chaingun |
    * |                5 | rocket   |
    * |                6 | plasma   |
    * |                7 | BFG9K    |
    * |                8 | chainsaw |
    * +------------------+----------+
    */
    this.weaponList = [true, true, false, false, false, false, false, false, false];
    /*
    * +-----------+---------+
    * | lastArmor |  armor  |
    * +-----------+---------+
    * |         0 | nothing |
    * |         1 | green   |
    * |         2 | blue    |
    * +-----------+---------+
    */
    this.equipedWeapon = 1;
    //the player has no keys at the begining
    this.inventory = [false, false, false];
    /*
    * +-------+-----------+
    * | index | key color |
    * +-------+-----------+
    * |     0 | Red       |
    * |     1 | Blue      |
    * |     2 | Yellow    |
    * +-------+-----------+
    */
    //weapons:
    /*
    * +-------+---------------+----------+---------------+
    * | index |    weapon     | ammoPool | used per shot |
    * +-------+---------------+----------+---------------+
    * |     0 | fist          |        0 |             0 |
    * |     1 | pistol        |        1 |             1 |
    * |     2 | shotgun       |        2 |             1 |
    * |     3 | super shotgun |        2 |             2 |
    * |     4 | chaingun      |        1 |             1 |
    * |     5 | rocket        |        3 |             1 |
    * |     6 | plasma        |        4 |             1 |
    * |     7 | BFG ??        |        4 |            60 |
    * |     8 | chainsaw      |        0 |             0 |
    * +-------+---------------+----------+---------------+

    * +----------+----------+--------------+-------------------+
    * | ammoName | ammoPool | max Capacity | max with backpack |
    * +----------+----------+--------------+-------------------+
    * | hands    |        0 | INF          | INF               |
    * | bullets  |        1 | 200          | 400               |
    * | shells   |        2 | 50           | 100               |
    * | rockets  |        3 | 50           | 100               |
    * | plasma   |        4 | 300          | 600               |
    * +----------+----------+--------------+-------------------+
    */
    this.ammos = [127, 20, 0, 0, 0];
    this.camera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 1, -3), scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 1, 1));
    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    // attach the camera to the canvas and adding a few controls
    this.camera.attachControl(canvas, false);
    this.camera.keysUp = [90, 38]; // Z or UP Arrow
    this.camera.keysDown = [83, 40]; // S or DOWN ARROW
    this.camera.keysLeft = [81]; // Q or LEFT ARROW
    this.camera.keysRight = [68]; // D or RIGHT ARROW
    //Add attachment controls
    //slowing down the camera speed
    this.camera.speed = 0.3;
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1.3, 1, 1.3);
    this.camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);

    this.sphere = BABYLON.MeshBuilder.CreateSphere("player", {diameterX: 0.5, diameterY: 1, diameterZ: 0.5});
    this.sphere.position.x = this.camera.position.x;
    this.sphere.position.z = this.camera.position.z;
    this.sphere.position.y = 0.5;
    this.sphere.isPickable = true;
    this.sphere.setEnabled(false);
    // Add the camera to the active cameras
    if (scene.activeCameras !== null) {
      scene.activeCameras.push(this.camera);
    }


    /******    UI   ******/
    this.gameUIService.displayUI(scene, this.camera, 1);

    /******FUNCTIONS******/
    //locking the ability to look up
    this.lockRotation = () => {
      this.camera.rotation.x = 0;
      this.sphere.position.x = this.camera.position.x;
      this.sphere.position.y = this.camera.position.y;
      this.sphere.position.z = this.camera.position.z;
      return;
    }

    this.applyDamage = (damage: number) => {
      //checking the armor
      if(this.armor > 0){
        //if green or only pickups, it absorbds 1/3 of the damage
        if(this.lastArmor == 0 || this.lastArmor == 1){
          this.armor -= 1/3 * damage;
          this.health -= 2/3 * damage;
        }
        else{
          //else mega armor
          this.armor -= 1/2 * damage;
          this.health -= 1/2 * damage;
        }
      }
      else{
        this.health -= damage;
      }
    }

    //FUNCTION  to add a crosshair in the middle of the camera
    this.addGunSight = () => {
      if (scene.activeCameras === null) {
        console.log('Cameras aren\'t active...');
        return;
      }

      //we create a second camera on top of the first one where we will see only the crosshair
      let crosshairCamera = new BABYLON.FreeCamera("GunSightCamera", new BABYLON.Vector3(0, 0, -50), scene);
      crosshairCamera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
      crosshairCamera.layerMask = 0x20000000;
    
      //Pushing the second camera on the scene
      scene.activeCameras.push(crosshairCamera);

      //this meshes is for us to display the crosshair it will take every parts of the crosshair
      let meshes = [];
      let h = 250;
      let w = 250;

      let y = BABYLON.Mesh.CreateBox("y", h * 0.2, scene);
      y.scaling = new BABYLON.Vector3(0.05, 0.5, 0.5);
      y.position = new BABYLON.Vector3(0, 0, 0);
      meshes.push(y);

      let x = BABYLON.Mesh.CreateBox("x", h * 0.2, scene);
      x.scaling = new BABYLON.Vector3(0.5, 0.05, 0.5);
      x.position = new BABYLON.Vector3(0, 0, 0);
      meshes.push(x);

      let lineTop = BABYLON.Mesh.CreateBox("lineTop", w * 0.8, scene);
      lineTop.scaling = new BABYLON.Vector3(0.5, 0.005, 0.5);
      lineTop.position = new BABYLON.Vector3(0, h * 0.5, 0);
      meshes.push(lineTop);

      let lineBottom = BABYLON.Mesh.CreateBox("lineBottom", w * 0.8, scene);
      lineBottom.scaling = new BABYLON.Vector3(0.5, 0.005, 0.5);
      lineBottom.position = new BABYLON.Vector3(0, h * -0.5, 0);
      meshes.push(lineBottom);

      let lineLeft = BABYLON.Mesh.CreateBox("lineLeft", h, scene);
      lineLeft.scaling = new BABYLON.Vector3(0.01, 0.5, 0.5);
      lineLeft.position = new BABYLON.Vector3(w * -0.4, 0, 0);
      meshes.push(lineLeft);

      let lineRight = BABYLON.Mesh.CreateBox("lineRight", h, scene);
      lineRight.scaling = new BABYLON.Vector3(0.01, 0.5, 0.5);
      lineRight.position = new BABYLON.Vector3(w * 0.4, 0, 0);
      meshes.push(lineRight);

      //merging all the meshes to create the crosshair
      let gunSight = BABYLON.Mesh.MergeMeshes(meshes) as BABYLON.Mesh;
      gunSight.name = "gunSight";
      //this allow us to display only a crosshair on top of the first camera
      gunSight.layerMask = 0x20000000;
      gunSight.freezeWorldMatrix();

      //adding color for the crosshair
      let mat = new BABYLON.StandardMaterial("emissive mat", scene);
      mat.checkReadyOnlyOnce = true;
      mat.emissiveColor = new BABYLON.Color3(1, 1, 0);
      gunSight.material = mat;

      return;
    }



    //checking if the player can shoot the weapon he's using
    this.shoot = () => {
      //fist/chainsaw
      if(this.equipedWeapon == 0) return true;
      //shooting the pistol or the chaingun
      else if((this.equipedWeapon == 1 || this.equipedWeapon == 3) && this.ammos[1] > 0){ 
        //minus the ammo shooted
        this.ammos[1] -=1;
        //the shoot can be done
        return true;
      }
      //shotgun
      else if(this.equipedWeapon == 2 && this.ammos[2] > 0){
        this.ammos[2] -=1;
        return true;
      }
      //super shotgun
      else if(this.equipedWeapon == 4 && this.ammos[2] > 1){
        this.ammos[2] -=2;
        return true;
      }
      else if(this.equipedWeapon == 5 && this.ammos[3] > 0){
        this.ammos[3] -= 1;
        return true;
      }
      else if(this.equipedWeapon == 6 && this.ammos[4] > 0){
        this.ammos[4] -= 1;
        return true
      }
      else if(this.equipedWeapon == 7 && this.ammos[4] > 59){
        this.ammos[4] -= 60;
        return true
      }
      //can't shoot
      else return false;
    }
  }
}
