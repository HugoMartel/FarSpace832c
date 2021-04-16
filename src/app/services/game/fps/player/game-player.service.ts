import { Inject ,Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';

//TODO: add imunty & bersek

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
  inventory: Array<boolean>; //keys
  ammos: Array<number>;
  lockRotation: Function;
  shoot: Function;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement){ 
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

    /******FUNCTIONS******/
    //locking the ability to look up
    this.lockRotation = () => {
      this.camera.rotation.x = 0;
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
      //shotung
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
