import { Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';

import { GameUIService } from '../game-ui.service';
import { GameLevelService } from '../game-level.service';
import { Vector2 } from '@babylonjs/core';

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
  camera!:BABYLON.FreeCamera;
  sphere!: BABYLON.Mesh;
  inventory: Array<boolean>; //keys
  ammos: Array<number>;
  lockRotation: Function;
  shoot: Function;
  applyDamage: Function;

  constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement, gameUIService: GameUIService){ 

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
    * |                5 | plasma   |
    * |                6 | BFG9K   |
    * |                7 | rocket    |
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
    this.shotPuff = new BABYLON.SpriteManager("shotPuffManager", "assets/textures/particles.png", 1, {height: 32, width: 32}, scene);
    this.shotPuff.isPickable = false;
    

    this.camera = new BABYLON.UniversalCamera("viewCamera", new BABYLON.Vector3(0, 1, -3), scene);
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
    gameUIService.displayUI();

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


    /**
     * Function to use when the player shoots his gun
     * @param scene Babylon scene
     * @param level GameLevelService used to store the current level (especially the enemies)
     * @param canvas HTML Canvas to get the center point to shoot the picking ray
     */
    this.shoot = (scene:BABYLON.Scene, level:GameLevelService, canvas:HTMLCanvasElement) => {
      if (gameUIService.hasShot) 
        return false;// The gun is already firing


      //***************
      //*     FIST    *
      //***************
      if (this.equippedWeapon == 0) {
        //the shot is doable
        gameUIService.hasShot = true;
        //TODO update the HUD ammo

        let isHittingEnemy:boolean = false;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("enemy", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the fist can reach
        let hitDistance:number = 3.;
        

        //Check if the shot did hit something eventually
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(1,1,1));//White

        let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray");
        console.log(hit?.pickedMesh);//!DEBUG
        
        // Check if the ray did hit something eventually
        if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
          // Check every enemy if they got hit
          level.enemy.forEach(enemy => {
            // Check if the tested enemy is the one that got hit
            if (
              hit?.pickedMesh === enemy.mesh && 
              Math.hypot(enemy.sprt.position.x - scene.cameras[0].position.x, enemy.sprt.position.z - scene.cameras[0].position.z) <= hitDistance
            ) {
                  isHittingEnemy = true;
              console.log("Fist hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
              /*
              TODO: Enemy logic 
                - Remove the appropriate health to the enemy, 
                - Reduce damage by distance ? (linearly with Math.hypot result above ?)
                - Trigger pain state of the enemy
                - Maybe change the ray hit to rough hitbox since the imps' hitbox seem a little thin
              */

              // Set the blood puff position slightly in front of the imp
              puff.position = new BABYLON.Vector3(
                enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
                1,
                enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
              );
              //Play the blood puff animation
              puff.playAnimation(6, 10, false, 50, () => puff.dispose());
              
            }
          });
        }

        // Particle animation if the shot doesn't hit an enemy
        if (!isHittingEnemy) {
          if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
            // If a wall is hit
            puff.position = new BABYLON.Vector3(
              hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
              1, 
              hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
          } else {
            // If nothing is hit
            puff.position = this.camera.getFrontPosition(hitDistance);
          }
          //Play the smoke puff animation
          puff.playAnimation(0, 5, false, 50, () => puff.dispose());
        }

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
        //TODO update the HUD ammo

        let isHittingEnemy:boolean = false;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("enemy", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the pistol/chaingun can reach
        let hitDistance:number = this.equippedWeapon == 1 ? 30. : 50.;
        

        //Check if the shot did hit something eventually
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0,0,0));//Black

        let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray");
        console.log(hit?.pickedMesh);//!DEBUG
        
        // Check if the ray did hit something eventually
        if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
          // Check every enemy if they got hit
          level.enemy.forEach(enemy => {
            // Check if the tested enemy is the one that got hit
            if (
              hit?.pickedMesh === enemy.mesh && 
              Math.hypot(enemy.sprt.position.x - scene.cameras[0].position.x, enemy.sprt.position.z - scene.cameras[0].position.z) <= hitDistance
            ) {
                  isHittingEnemy = true;
              console.log((this.equippedWeapon == 1?"Pistol":"Chaigun") + " hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
              /*
              TODO: Enemy logic 
                - Remove the appropriate health to the enemy, 
                - Reduce damage by distance ? (linearly with Math.hypot result above ?)
                - Trigger pain state of the enemy
                - Maybe change the ray hit to rough hitbox since the imps' hitbox seem a little thin
              */

              // Set the blood puff position slightly in front of the imp
              puff.position = new BABYLON.Vector3(
                enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
                1,
                enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
              );
              //Play the blood puff animation
              puff.playAnimation(6, 10, false, 50, () => puff.dispose());
              
            }
          });
        }

        // Particle animation if the shot doesn't hit an enemy
        if (!isHittingEnemy) {
          if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
            // If a wall is hit
            puff.position = new BABYLON.Vector3(
              hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
              1, 
              hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
          } else {
            // If nothing is hit
            puff.position = this.camera.getFrontPosition(hitDistance);
          }
          //Play the smoke puff animation
          puff.playAnimation(0, 5, false, 50, () => puff.dispose());
        }

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
        //TODO update the HUD ammo

        let isHittingEnemy:boolean = false;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("enemy", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the shotgun can reach
        let hitDistance:number =  30.;
        

        //Check if the shot did hit something eventually
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(1,0,0));//Red

        let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray");
        console.log(hit?.pickedMesh);//!DEBUG

        //TODO create 4 other shots coming out of the barrel in a line : * * * * *
        
        // Check if the ray did hit something eventually
        if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
          // Check every enemy if they got hit
          level.enemy.forEach(enemy => {
            // Check if the tested enemy is the one that got hit
            if (
              hit?.pickedMesh === enemy.mesh && 
              Math.hypot(enemy.sprt.position.x - scene.cameras[0].position.x, enemy.sprt.position.z - scene.cameras[0].position.z) <= hitDistance
            ) {
                  isHittingEnemy = true;
              console.log("Shotgun hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
              /*
              TODO: Enemy logic 
                - Remove the appropriate health to the enemy, 
                - Reduce damage by distance ? (linearly with Math.hypot result above ?)
                - Trigger pain state of the enemy
                - Maybe change the ray hit to rough hitbox since the imps' hitbox seem a little thin
              */

              // Set the blood puff position slightly in front of the imp
              puff.position = new BABYLON.Vector3(
                enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
                1,
                enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
              );
              //Play the blood puff animation
              puff.playAnimation(6, 10, false, 50, () => puff.dispose());
              
            }
          });
        }

        // Particle animation if the shot doesn't hit an enemy
        if (!isHittingEnemy) {
          if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
            // If a wall is hit
            puff.position = new BABYLON.Vector3(
              hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
              1, 
              hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
          } else {
            // If nothing is hit
            puff.position = this.camera.getFrontPosition(hitDistance);
          }
          //Play the smoke puff animation
          puff.playAnimation(0, 5, false, 50, () => puff.dispose());
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
        //TODO update the HUD ammo

        let isHittingEnemy:boolean = false;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("enemy", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the shotgun can reach
        let hitDistance:number =  20.;
        

        //Check if the shot did hit something eventually
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0,1,0));//Green

        let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray");
        console.log(hit?.pickedMesh);//!DEBUG

        //TODO create 4 other shots coming out of the barrel in a square : 
        /* 
          *   * 
            *
          *   *
        */
        
        // Check if the ray did hit something eventually
        if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
          // Check every enemy if they got hit
          level.enemy.forEach(enemy => {
            // Check if the tested enemy is the one that got hit
            if (
              hit?.pickedMesh === enemy.mesh && 
              Math.hypot(enemy.sprt.position.x - scene.cameras[0].position.x, enemy.sprt.position.z - scene.cameras[0].position.z) <= hitDistance
            ) {
                  isHittingEnemy = true;
              console.log("SSG hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
              /*
              TODO: Enemy logic 
                - Remove the appropriate health to the enemy, 
                - Reduce damage by distance ? (linearly with Math.hypot result above ?)
                - Trigger pain state of the enemy
                - Maybe change the ray hit to rough hitbox since the imps' hitbox seem a little thin
              */

              // Set the blood puff position slightly in front of the imp
              puff.position = new BABYLON.Vector3(
                enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
                1,
                enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
              );
              //Play the blood puff animation
              puff.playAnimation(6, 10, false, 50, () => puff.dispose());
              
            }
          });
        }

        // Particle animation if the shot doesn't hit an enemy
        if (!isHittingEnemy) {
          if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
            // If a wall is hit
            puff.position = new BABYLON.Vector3(
              hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
              1, 
              hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
          } else {
            // If nothing is hit
            puff.position = this.camera.getFrontPosition(hitDistance);
          }
          //Play the smoke puff animation
          puff.playAnimation(0, 5, false, 50, () => puff.dispose());
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
        //TODO update the HUD ammo

        let isHittingEnemy:boolean = false;

        // Puff particle
        let puff:BABYLON.Sprite = new BABYLON.Sprite("enemy", this.shotPuff);
        puff.height = 1.5;
        puff.width = 1.5;
        puff.isPickable = false;

        // Max distance that the shotgun can reach
        let hitDistance:number =  30.;


        //Check if the shot did hit something eventually
        let ray:BABYLON.Ray = this.camera.getForwardRay(hitDistance);
        let rayHelper:BABYLON.RayHelper = new BABYLON.RayHelper(ray);
        rayHelper.show(scene, new BABYLON.Color3(0,0,1));//Blue

        let hit:BABYLON.PickingInfo|null = scene.pickWithRay(ray, (mesh:BABYLON.AbstractMesh) => mesh.metadata !== "player" && mesh.id !== "ray");
        console.log(hit?.pickedMesh);//!DEBUG


        // Check if the ray did hit something eventually
        if (hit !== null && hit.pickedMesh !== null && hit.pickedMesh.metadata === "enemy") {
          // Check every enemy if they got hit
          level.enemy.forEach(enemy => {
            // Check if the tested enemy is the one that got hit
            if (
              hit?.pickedMesh === enemy.mesh && 
              Math.hypot(enemy.sprt.position.x - scene.cameras[0].position.x, enemy.sprt.position.z - scene.cameras[0].position.z) <= hitDistance
            ) {
                  isHittingEnemy = true;
              console.log("Plasma hit at " + enemy.sprtMng.name + "(" + enemy.coord + "), hp: " + enemy.health);//! DEBUG
              /*
              TODO: Enemy logic 
                - Remove the appropriate health to the enemy, 
                - Reduce damage by distance ? (linearly with Math.hypot result above ?)
                - Trigger pain state of the enemy
                - Maybe change the ray hit to rough hitbox since the imps' hitbox seem a little thin
              */
            
              // Set the blood puff position slightly in front of the imp
              puff.position = new BABYLON.Vector3(
                enemy.sprt.position.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x),
                1,
                enemy.sprt.position.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
              );
              //Play the blood puff animation
              puff.playAnimation(6, 10, false, 50, () => puff.dispose());
              
            }
          });
        }

        // Particle animation if the shot doesn't hit an enemy
        if (!isHittingEnemy) {
          if (hit !== null && hit.pickedMesh !== null && hit.pickedPoint !== null && (hit.pickedMesh.metadata === "wall" || hit.pickedMesh.metadata === "door")) {
            // If a wall is hit
            puff.position = new BABYLON.Vector3(
              hit.pickedPoint.x - (this.camera.getFrontPosition(.2).x - this.camera.position.x), 
              1, 
              hit.pickedPoint.z - (this.camera.getFrontPosition(.2).z - this.camera.position.z)
            );
          } else {
            // If nothing is hit
            puff.position = this.camera.getFrontPosition(hitDistance);
          }
          //Play the smoke puff animation
          puff.playAnimation(0, 5, false, 50, () => puff.dispose());
        }

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

        //TODO

        this.BFGSound.play();

        return true
      }
      //no ammo (or unknown weapon (shouldn't happen))
      else {
        //TODO: play click sound (no bullets)
        return false;
      }
    }
  }
}
