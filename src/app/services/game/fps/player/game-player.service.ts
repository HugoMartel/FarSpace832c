import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';

import { GameUIService } from '../game-ui.service';
import { GameLevelService } from '../game-level.service';
import * as stuff from '../randomFunctions/random-functions.service'
import { GameEnemyService } from '../game-enemy.service';

@Injectable({
  providedIn: 'root'
})
export class GamePlayerService {
  health: number;
  dead: boolean;
  armor: number;
  lastArmor: number;
  hasBackPack: boolean;
  onBerserk : boolean;
  isImmune: boolean;
  frameSinceImmune: number;
  weaponList: Array<boolean>;
  equippedWeapon: number;
  fistSound: BABYLON.Sound;
  pistolSound: BABYLON.Sound;
  shotgunSound: BABYLON.Sound;
  ssgSound: BABYLON.Sound;
  plasmaSound: BABYLON.Sound;
  BFGSound: BABYLON.Sound;
  shotPuff: BABYLON.SpriteManager;
  shooting: boolean;
  //note: we're using the camera position as player coord
  camera:BABYLON.FreeCamera;
  sphere: BABYLON.Mesh;
  inventory: Array<boolean>; //keys
  ammos: Array<number>;
  ui: GameUIService;
  lockRotation: Function;
  shoot: Function;
  shootRay: Function;
  applyDamage: Function;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement, gameUIService: GameUIService, spawnCoord: BABYLON.Vector3,onDeath:Function) { 

    this.health = 100;
    this.hasBackPack = false;
    this.onBerserk = false;
    this.isImmune = false;
    this.frameSinceImmune = 0;
    this.armor = 0;
    this.lastArmor = 0;
    this.dead = false;
    /*
    * +------------------+----------+
    * | weaponlist Index |  weapon  |
    * +------------------+----------+
    * |                0 | fist     |
    * |                1 | pistol   |
    * |                2 | shotgun  |
    * |                3 | ssg      |
    * |                4 | chaingun |
    * |                5 | plasma   |
    * |                6 | BFG9K    |
    * |                7 | rocket   |
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
    this.equippedWeapon = 0;
    this.shooting = false;
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
    weapons:
    * +-------+---------------+----------+---------------+
    * | index |    weapon     | ammoPool | used per shot |
    * +-------+---------------+----------+---------------+
    * |     0 | fist          |        0 |             0 |
    * |     1 | pistol        |        1 |             1 |
    * |     2 | shotgun       |        2 |             1 |
    * |     3 | super shotgun |        2 |             2 |
    * |     4 | chaingun      |        1 |             1 |
    * |     5 | plasma        |        4 |             1 |
    * |     6 | BFG ??        |        4 |            60 |
    * |     7 | rocket ??     |        3 |             1 |
    * |     8 | chainsaw ??   |        0 |             0 |
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

    // Sounds
    this.fistSound = new BABYLON.Sound("fistSound", "assets/sound/fps/weapon/fist.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });
    this.pistolSound = new BABYLON.Sound("pistolSound", "assets/sound/fps/weapon/pistol.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });
    this.shotgunSound = new BABYLON.Sound("shotgunSound", "assets/sound/fps/weapon/shotgun.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });
    this.ssgSound = new BABYLON.Sound("ssgSound", "assets/sound/fps/weapon/ssg.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });
    this.plasmaSound = new BABYLON.Sound("plasmaSound", "assets/sound/fps/weapon/plasma.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });
    this.BFGSound = new BABYLON.Sound("BFGSound", "assets/sound/fps/weapon/BFG.wav", scene, null, {
      loop: false,
      autoplay: false,
      volume: .3
    });

    // Weapon particles
    this.shotPuff = new BABYLON.SpriteManager("shotPuffManager", "assets/textures/particles.png", 5, {height: 32, width: 32}, scene);
    this.shotPuff.isPickable = false;
    

    this.camera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(spawnCoord.x, 1, spawnCoord.z), scene);
    this.camera.setTarget(new BABYLON.Vector3(0, 1, 1));
    // create a FreeCamera, and set its position to (x:5, y:10, z:-20 )
    // attach the camera to the canvas and adding a few controls
    this.camera.attachControl(canvas, false);
    this.camera.keysUp = [90, 38]; // Z or UP Arrow
    this.camera.keysDown = [83, 40]; // S or DOWN ARROW
    this.camera.keysLeft = [81, 37]; // Q or LEFT ARROW
    this.camera.keysRight = [68, 39]; // D or RIGHT ARROW
    //Add attachment controls
    //slowing down the camera speed
    this.camera.speed = 0.3;
    this.camera.checkCollisions = true;
    this.camera.applyGravity = true;
    this.camera.ellipsoid = new BABYLON.Vector3(1.3, 1, 1.3);
    this.camera.ellipsoidOffset = new BABYLON.Vector3(0, 1, 0);

    //hitbox mesh
    this.sphere = BABYLON.MeshBuilder.CreateSphere("player", {diameterX: 0.5, diameterY: 1, diameterZ: 0.5});
    this.sphere.position.x = this.camera.position.x;
    this.sphere.position.z = this.camera.position.z;
    this.sphere.position.y = 0.5;
    this.sphere.isPickable = true;
    this.sphere.metadata = "player";
    // Add the camera to the active cameras
    if (scene.activeCameras !== null) {
      scene.activeCameras.push(this.camera);
    }


    /******    UI   ******/
    this.ui = gameUIService;
    this.ui.displayUI(this);

    /******FUNCTIONS******/
    //locking the ability to look up
    this.lockRotation = () => {
      this.camera.rotation.x = 0;
      this.sphere.position.x = this.camera.position.x;
      this.sphere.position.y = this.camera.position.y;
      this.sphere.position.z = this.camera.position.z;
      return;
    }

    this.applyDamage = (damage: number, frame: number) => {
      if (this.dead) {
        return;
      }

      if(this.isImmune){
        if(frame - this.frameSinceImmune > 1000){
          this.isImmune = false;
          this.frameSinceImmune = 0;
        }
        else return;
      }
      //checking the armor
      if(this.armor > 0){
        //if green or only pickups, it absorbds 1/3 of the damage
        if(this.lastArmor == 0 || this.lastArmor == 1){
          this.armor -= Math.floor(damage / 3);
          if (this.armor < 0) 
            this.armor = 0;
          this.health -= Math.floor(2 * damage / 3);
        }
        else{
          //else mega armor
          this.armor -= Math.floor(damage / 2);
          this.health -= Math.floor(damage / 2);
        }
      }
      //else no armor
      else{
        this.health -= Math.floor(damage);
      }
      //if dead
      if(this.health <= 0){ 
        this.dead = true;
        this.health = 0;
      }
      this.ui.updateArmor(this.armor);
      this.ui.updateHealth(this.health);

      if (this.dead)
        onDeath();
    }


    /**
     * Function to use when the player shoots his gun
     * @param scene Babylon scene
     * @param level GameLevelService used to store the current level (especially the enemies)
     * @param canvas HTML Canvas to get the center point to shoot the picking ray
     */
    this.shoot = (scene:BABYLON.Scene, level:GameLevelService, canvas:HTMLCanvasElement, frame: number) => {
      if (gameUIService.hasShot) 
        return false;// The gun is already firing

      let puffAnim = (puff:BABYLON.Sprite, n:number) => {
        puff.playAnimation(0+n*6, 4 + n*6, false, 50, () => puff.dispose());
      }

      //***************
      //*     FIST    *
      //***************
      if (this.equippedWeapon == 0) {
        //the shot is doable
        gameUIService.hasShot = true;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("puff", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the fist can reach
        let hitDistance:number = 3.;


        // Create the ray
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(1,1,1));//White

        // Check if the ray did hit something eventually
        this.shootRay(ray, hitDistance, level.enemy, puff, puffAnim, scene, frame);

        this.fistSound.play();

        return true;
      }
      
      //*******************
      //* PISTOL/CHAINGUN *
      //*******************
      else if ((this.equippedWeapon == 1 || this.equippedWeapon == 4) && this.ammos[1] > 0) { 
        //the shot is doable
        this.ammos[1] -=1;
        gameUIService.hasShot = true;
        this.ui.updateAmmoPool(this.ammos[1], this.ammos[2], this.ammos[4], this.hasBackPack);
        this.ui.updateAmmo(this.ammos[1]);

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("puff", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the pistol/chaingun can reach
        let hitDistance:number = this.equippedWeapon == 1 ? 30. : 50.;
        

        // Create the ray
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0,0,0));//Black

        // Check if the ray did hit something eventually
        this.shootRay(ray, hitDistance, level.enemy, puff, puffAnim, scene, frame);

        this.pistolSound.play();

        return true;
      }

      //***************
      //*   SHOTGUN   *
      //***************
      else if (this.equippedWeapon == 2 && this.ammos[2] > 0){
        //the shot is doable
        this.ammos[2] -=1;
        gameUIService.hasShot = true;
        this.ui.updateAmmoPool(this.ammos[1], this.ammos[2], this.ammos[4], this.hasBackPack);
        this.ui.updateAmmo(this.ammos[2]);

        // Max distance that the shotgun can reach
        let hitDistance:number =  30.;

        // Puff particle
        let puffs:Array<BABYLON.Sprite> = new Array(5);
        for (let i = 0; i < 5; ++i) {
          puffs[i] = new BABYLON.Sprite("puff" + i.toString(), this.shotPuff);
          puffs[i].height = 1.5;
          puffs[i].width = 1.5;
          puffs[i].isPickable = false;
        }


        // Create the 5 shots
        for (let i = 0; i < 5; ++i) {
          // Create the ray
          let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
          let alpha = (- Math.PI / 24) + i * Math.PI / 48;
          ray.direction = new BABYLON.Vector3(
            Math.cos(alpha) * ray.direction.x - Math.sin(alpha) * ray.direction.z,
            ray.direction.y,
            Math.sin(alpha) * ray.direction.x + Math.cos(alpha) * ray.direction.z
          );
          let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
          rayHelper.show(scene, new BABYLON.Color3(1,0,0));//Red

          // Check if the ray did hit something eventually
          this.shootRay(ray, hitDistance, level.enemy, puffs[i], puffAnim, scene, frame);
        }

        this.shotgunSound.play();

        return true;
      }

      //*****************
      //* SUPER SHOTGUN *
      //*****************
      else if (this.equippedWeapon == 3 && this.ammos[2] > 1) {
        //the shot is doable
        this.ammos[2] -=2;
        gameUIService.hasShot = true;
        this.ui.updateAmmoPool(this.ammos[1], this.ammos[2], this.ammos[4], this.hasBackPack);
        this.ui.updateAmmo(this.ammos[2]);

        // Max distance that the SSG can reach
        let hitDistance:number =  20.;
        

        // Puff particle
        let puffs:Array<BABYLON.Sprite> = new Array(5);
        for (let i = 0; i < 5; ++i) {
          puffs[i] = new BABYLON.Sprite("puff" + i.toString(), this.shotPuff);
          puffs[i].height = 1.5;
          puffs[i].width = 1.5;
          puffs[i].isPickable = false;
        }


        // Create the 5 shots
        for (let i = 0; i < 5; ++i) {
          // Create the ray
          let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
          let alpha = (- Math.PI / 48) + i * Math.PI / 96;
          ray.direction = new BABYLON.Vector3(
            Math.cos(alpha) * ray.direction.x - Math.sin(alpha) * ray.direction.z,
            ray.direction.y,
            Math.sin(alpha) * ray.direction.x + Math.cos(alpha) * ray.direction.z
          );
          let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
          rayHelper.show(scene, new BABYLON.Color3(0,1,0));//Green

          // Check if the ray did hit something eventually
          this.shootRay(ray, hitDistance, level.enemy, puffs[i], puffAnim, scene, frame);
        }

        this.ssgSound.play();

        return true;
      }
      /*
      //rocket
      else if (this.equippedWeapon == 7 && this.ammos[3] > 0) {
        //the shot is doable
        this.ammos[3] -= 1;

        return true;
      }
      */
      
      //************
      //*  PLASMA  *
      //************
      else if (this.equippedWeapon == 5 && this.ammos[4] > 0) {
        //the shot is doable
        this.ammos[4] -= 1;
        gameUIService.hasShot = true;
        this.ui.updateAmmoPool(this.ammos[1], this.ammos[2], this.ammos[4], this.hasBackPack);
        this.ui.updateAmmo(this.ammos[4]);

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("puff", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the Plasma can reach
        let hitDistance:number =  30.;


        // Create the ray
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0,0,1));//Blue

        // Check if the ray did hit something eventually
        this.shootRay(ray, hitDistance, level.enemy, puff, puffAnim, scene, frame);

        this.plasmaSound.play();

        return true
      }

      //*************
      //*    BFG    *
      //*************
      else if (this.equippedWeapon == 6 && this.ammos[4] > 59) {
        //the shot is doable
        this.ammos[4] -= 60;
        gameUIService.hasShot = true;
        this.ui.updateAmmoPool(this.ammos[1], this.ammos[2], this.ammos[4], this.hasBackPack);
        this.ui.updateAmmo(this.ammos[4]);

        //TODO - no time I think
        //! Don't put BFG in the levels

        this.BFGSound.play();

        return true
      }
      //no ammo (or unknown weapon (shouldn't happen))
      else {
        return false;
      }
    }


    /**
     * function used to cast a ray and find what got hit
     * @param ray ray to check collisions with
     * @param maxDist max distance where an enemy can be
     * @param enemies level enemies array
     * @param puffSprt puff sprite to display where did the ray hit
     */
    this.shootRay = (ray:BABYLON.Ray, maxDist:number, enemies: Array<GameEnemyService>, puffSprt:BABYLON.Sprite, puffAnim:Function, scene: BABYLON.Scene, frame: number) => {
      let isHittingEnemy:boolean = false;


      let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray", false);
      //console.log(hit?.pickedMesh);//!DEBUG

      //waking up near enemy:
      for(let i of enemies){
        if(stuff.distance(i.mesh.position, this.camera.position) <= 20 && (i.state == 0 || i.state == 1)){
          i.state = 5;
          i.framesSinceHit = frame;
          i.playSound("wakeup", scene);
        }
      }

      // Check if the ray did hit an enemy
      if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
        // Check every enemy if they got hit
        enemies.forEach(enemy => {
          //checking the distance with each enemy to wake up
          if(stuff.distance(enemy.sprt.position, this.camera.position) <= 20 && (enemy.state == 0 || enemy.state == 1)){
            //waking him up
            enemy.state = 5;
            //playing the good sound
            enemy.playSound("wakeup", scene);
            //setting the enemy frames since hit
            enemy.framesSinceHit = frame;
          }
          // Check if the tested enemy is the one that got hit
          if (hit?.pickedMesh === enemy.mesh) {
            isHittingEnemy = true;
            //console.log("Plasma hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
            let hitDistance = stuff.distance(hit.pickedMesh.position, this.camera.position);
            //removing the enemy HP
            let damage = 0;
            /* Dammage are calculated with:
            *http://www.doom2.net/single/weaponfaq.html*/
            switch (this.equippedWeapon){
              //fist;
              case 0:
                //setting up the damage 
                if(this.onBerserk) damage = 130;
                else damage = 10;
                break;
              //pistol:
              case 1:
                damage = 10;
                break;
              //shotgun
              case 2:
                damage = 70/5;
                if (hitDistance >= maxDist / 2){
                  damage *= (1.5 - hitDistance / maxDist);
                }
                break;
              //SSG
              case 3:
                damage = 210/5;
                if (hitDistance >= maxDist / 2){
                  damage *= (1.5 - hitDistance / maxDist);
                }
                break;
              //chaingun
              case 4:
                damage = 10;
                break;
              //plasma:
              case 5:
                damage = 22.5;
                break;
              //BFG 9K
              case 6:
                damage = 3130;
                break;
              //rocket
              case 7:
                damage = 218;
                break;
              //chainsaw
              case 8:
                damage = 480;
                break;
              //in case of mistake happening
              default:
                damage = 0;
                break;
            }
            if(hitDistance >= maxDist) damage = 0;
            enemy.applyDamage(damage, scene);

            // Set the blood puff position slightly in front of the imp
            puffSprt.position = new BABYLON.Vector3(
              enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
              1,
              enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
            //Play the blood puff animation
            puffAnim(puffSprt, 1);
            
          }
        });
      }

     // Particle animation if the shot doesn't hit an enemy
      if (!isHittingEnemy) {
        if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
          // If a wall is hit
          puffSprt.position = new BABYLON.Vector3(
            hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
            1, 
            hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
          );
        } else {
          // If nothing is hit
          puffSprt.position = ray.direction.multiplyByFloats(ray.length, ray.length, ray.length).addInPlace(ray.origin);
        }
        //Play the smoke puff animation
        puffAnim(puffSprt, 0);
      }
    }

  }
}
