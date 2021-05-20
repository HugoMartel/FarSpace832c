import { Inject, Injectable } from '@angular/core';
import {GameFireballService} from '../fps/attacks/game-fireball.service';

import * as BABYLON from '@babylonjs/core';
import { GamePlayerService } from './player/game-player.service';
import * as stuff from './randomFunctions/random-functions.service'
import { GameDoorsService } from "./levelEnv/game-doors.service"
@Injectable({ providedIn: 'root' })

//TODO: maybe try to see if we have some problems with the doors

//TODO: when enemy is ded we need to remove the mesh

//TODO: add a way to check enemy collision when near, cause rn they're doing shit

export class GameEnemyService {
  coord: Array<number>;
  health: number;
  type: number;
  speed: number;
  state: number;
  angle: number;
  frameSinceFarAttack: number;
  framesinceNearAttack: number;
  framesSinceOldAngle: number;
  oldAngle: number;
  sprtMng!: BABYLON.SpriteManager;
  sprt !: BABYLON.Sprite;
  mesh!: BABYLON.Mesh;
  //add some stuff here if we do more fireball
  projectile!: GameFireballService;
  init: Function;
  setup: Function;
  stateFrames!: Array<Array<number>>;
  playAnimation : Function;
  attackNear : Function;
  attackFar: Function;
  IA: Function;

  constructor(position: Array<number>, @Inject(Number) private healthbar: number, @Inject(Number) private typeEnemy: number, @Inject(Number) private status: number) { 
    this.coord = position;
    this.frameSinceFarAttack = 0;
    this.framesinceNearAttack = 0;
    this.health = healthbar;
    this.type = typeEnemy;
    this.oldAngle = -1;
    this.angle = 0;
    this.speed = 0.01;
    this.framesSinceOldAngle = 0;
    //STATE: 0 = sleep
    //       1 = ambush
    //       2 = death
    //       3 = attack missil
    //       4 = attack near
    //       5 = chasing

    this.state = status;
    this.setup = (scene: BABYLON.Scene) => {
      this.mesh = BABYLON.MeshBuilder.CreateBox("body", {size: 1, width: 1, height: 1}, scene);
      this.sprtMng = new BABYLON.SpriteManager("imp", "assets/textures/error.jpg", 3, {height: 64, width: 40}, scene);
      this.sprtMng.isPickable = true;
    }
    /**
    * Function to add the enemy to the scene, and initialize it
    * @param scene Babylon scene associated with the game
    */
    this.init = (scene : BABYLON.Scene) => {
      //setting up the mesh
      this.setup(scene);
      if(this.mesh !== undefined && this.sprtMng !== undefined){
        let enemyMat1 = new BABYLON.StandardMaterial("Emat", scene);
        enemyMat1.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
        enemyMat1.specularPower = 128;
        enemyMat1.alpha = 0;
        this.mesh.position = new BABYLON.Vector3(this.coord[0], 0.75, this.coord[1]);
        this.mesh.metadata = "enemy";
        this.mesh.checkCollisions = true;
        this.mesh.material = enemyMat1;
        this.sprt = new BABYLON.Sprite("enemy", this.sprtMng);
        this.sprt.position = this.mesh.position;
        this.sprt.height = 1.5;
        this.sprt.width = 1.5;
        this.sprt.isPickable = true;
        this.mesh.checkCollisions = true;
        this.mesh.material = enemyMat1;
      }
    }
    /**
    * Function called at every render loop to make the enemy less useless
    * @param player: the player in the scene
    * @param scene Babylon scene associated with the game
    * @param frames: the frame number (found in the render loop)
    * @param doors: the array of GameDoorsServices of the level
    */
   //TODO: add a ray when moving 90 degree (while)
    this.IA = (player: GamePlayerService, scene: BABYLON.Scene, frames: number, doors: Array<GameDoorsService>) => {
      //if the mob is dead then return
      if(this.state == 2) return;
      let distanceFromPlayer = stuff.distance(player.camera.position, this.sprt.position);
      //if the enemy is too far away then put it to sleep
      if(distanceFromPlayer >= 20){
        this.state = 0;
        this.sprt.stopAnimation();
        this.playAnimation();
      }
      //setting the lowest distance from a front facing mesh to infinity
      let minimumMeshDistance = 999999999;
      this.mesh.isPickable = false;
      //if the player is near the enemy and the enemy is sleeping then wake up;
      if((this.state == 0 || this.state == 1) && stuff.distance(player.camera.position, this.sprt.position) < 5) this.state = 5;
      //shooting a ray to see what's in front / getting it's coordinates
      /*
      *We're shooting 3 rays so that we can avoir everything in front 
      *Using 2 next to the center one to avoid the walls and not clipping inside then
      *it looks like nothing but it has been a hell lot of problem to create this
      */
      this.angle = stuff.computeAngle(this.sprt.position, player.camera.position);
      let direction = new BABYLON.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
      let rayCenter = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x, 0.5, this.sprt.position.z) ,direction, 1000);
      let rayLeft = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 *Math.cos(this.angle - Math.PI / 2), 0.5, this.sprt.position.z +  1/2 * Math.sin(this.angle - Math.PI / 2)) ,direction, 1000);
      let rayRight = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 * Math.cos(this.angle + Math.PI / 2), 0.5, this.sprt.position.z + 1/2 * Math.sin(this.angle + Math.PI / 2)) ,direction, 1000);
      let hitCenter = scene.pickWithRay(rayLeft);
      let hitLeft = scene.pickWithRay(rayCenter);
      let hitRight = scene.pickWithRay(rayRight);
      let hitArray = [hitLeft, hitRight, hitCenter];
      let hitBool = false;
      let nothingBool = true;
      let mainHit;
      for(let i of hitArray){
        if (i != null && i.pickedMesh != undefined && i.pickedMesh.metadata != "player" && (i.pickedMesh.metadata == "enemy" || i.pickedMesh.metadata == "door" || i.pickedMesh.metadata == "switch" || i.pickedMesh.metadata == "wall")){
          hitBool = true;
          if (stuff.distance(this.sprt.position, i.pickedMesh.position) < minimumMeshDistance){
            minimumMeshDistance = stuff.distance(this.sprt.position, i.pickedMesh.position);
            mainHit = i;
          }
          else{
            nothingBool = true;
          }
        }
      }
      //if a wall or something else is picken the player and the awaken enemy
      if(hitBool && mainHit != null && mainHit.pickedMesh != undefined){
        //if nothing stands between the player and the enemy
        if(distanceFromPlayer < minimumMeshDistance && (frames - this.framesSinceOldAngle > 250 || (distanceFromPlayer < 1.5))){
          //if the distance is inferior to 2.5: then near attack
          if(distanceFromPlayer <= 2.5){
            if(frames - this.framesinceNearAttack >= 100){
              this.framesinceNearAttack = frames;
              this.state = 4;
              this.attackNear(player, scene);
              this.sprt.stopAnimation();
              this.playAnimation();
            }
          }
          else{
            if(frames - this.frameSinceFarAttack < 150){
              this.sprt.position.x += this.speed * Math.cos(this.angle);
              this.mesh.position.x += this.speed * Math.cos(this.angle);
              this.coord[0] += this.speed * Math.cos(this.angle); 
              this.sprt.position.z += this.speed * Math.sin(this.angle);
              this.mesh.position.z += this.speed * Math.sin(this.angle);
              this.coord[1] += this.speed * Math.sin(this.angle);
            }
            else if (this.attackFar(player, scene)){
              this.frameSinceFarAttack = frames;
              //attack far;
              this.state = 3;
              this.sprt.stopAnimation();
              this.playAnimation();
            }
          }
        }
        //if mesh is before the player
        else{
          //if mesh near
          if (minimumMeshDistance < 1.5){
            //checking if this mesh is a door
            if(mainHit.pickedMesh.metadata == "door"){
              for(let i of doors){
                if(mainHit.pickedMesh == i.mesh){
                  //if it's a door then the enemy will try to open it (but he doesn't has any key)
                  i.open(this.sprt.position, [false, false, false], scene);
                }
              }
            }
            //checking the old angle
            else{
              //if the old angle is undefined, the we're setting it up
              if(this.oldAngle == -1) this.oldAngle = this.angle + Math.PI / 2;
              //if the angle hasn't been changed since a long time then we're updating it
              else if(frames - this.framesSinceOldAngle > 250){
                this.framesSinceOldAngle = frames;
                this.oldAngle += Math.PI / 5;
                this.oldAngle %= 2 * Math.PI;
              }
              //shooting 3 new rays in the new direction of the enemy
              let directionBis = new BABYLON.Vector3(Math.cos(this.oldAngle), 0, Math.sin(this.oldAngle));
              let checkRayCenter = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x, 0.5, this.sprt.position.z) ,directionBis, 1000);
              let checkRayLeft = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 * Math.cos(this.oldAngle - Math.PI / 2), 0.5, this.sprt.position.z +  1/2 * Math.sin(this.oldAngle - Math.PI / 2)) ,directionBis, 1000);
              let checkRayRight = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 * Math.cos(this.oldAngle + Math.PI / 2), 0.5, this.sprt.position.z + 1/2 * Math.sin(this.oldAngle + Math.PI / 2)) ,directionBis, 1000);
              let checkingHitCenter = scene.pickWithRay(checkRayCenter);
              let checkingHitLeft = scene.pickWithRay(checkRayLeft);
              let checkingHitRight = scene.pickWithRay(checkRayRight);
              let hitCheckArray = [checkingHitRight, checkingHitLeft, checkingHitCenter];
              let rotationMinDistance = 999999999;
              let mainCheckHit;
              //getting the nearest mesh hitted by those rays
              for(let i of hitCheckArray){
                //checking if we are getting a valid mesh
                if (i != null && i.pickedMesh != undefined && i.pickedMesh.metadata != "player" && (/*i.pickedMesh.metadata == "enemy" ||*/ i.pickedMesh.metadata == "door" || i.pickedMesh.metadata == "switch" || i.pickedMesh.metadata == "wall"))
                  if (stuff.distance(this.sprt.position, i.pickedMesh.position) < rotationMinDistance){
                    //if this one is the nearest
                    rotationMinDistance = stuff.distance(this.sprt.position, i.pickedMesh.position);
                    mainCheckHit = i;
                }
              }
              //if it's a door then opening it
              if(mainCheckHit != null && mainCheckHit.pickedMesh != undefined && mainCheckHit.pickedMesh.metadata == "door"){
                for(let i of doors){
                  if(mainCheckHit.pickedMesh == i.mesh){
                    //if it's a door then the enemy will try to open it (but he doesn't has any key)
                    i.open(this.sprt.position, [false, false, false], scene);
                  }
                }
              }
              //if this direction isn't right, then we need to find a new one 
              if(rotationMinDistance < 1.5 && rotationMinDistance != 999999){
                //while the enemy can't move in this direction we are looking for a new one shooting again 3 rays
                while(rotationMinDistance < 1.5){
                  rotationMinDistance = 999999;
                  //we're increasing the angle so the enemy is rotating
                  this.oldAngle = (this.oldAngle + Math.PI / 5) % (Math.PI * 2);
                  //we're changint the direction bis with this new angle
                  directionBis = new BABYLON.Vector3(Math.cos(this.oldAngle), 0, Math.sin(this.oldAngle));
                  //We're again shooting 3 ray so we can see if something is blocking the way
                  checkRayLeft = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 * Math.cos(this.oldAngle - Math.PI / 2), 0.5, this.sprt.position.z +  1/2 * Math.sin(this.oldAngle - Math.PI / 2)) ,directionBis, 1000);
                  checkRayRight = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x + 1/2 * Math.cos(this.oldAngle + Math.PI / 2), 0.5, this.sprt.position.z + 1/2 * Math.sin(this.oldAngle + Math.PI / 2)) ,directionBis, 1000);
                  checkRayCenter = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x, 0.5, this.sprt.position.z) ,directionBis, 1000);
                  //we're picking meshes with those new rays
                  checkingHitCenter = scene.pickWithRay(checkRayCenter);
                  checkingHitLeft = scene.pickWithRay(checkRayLeft);
                  checkingHitRight = scene.pickWithRay(checkRayRight);

                  //creating an array so it is easier to check each one
                  hitCheckArray = [checkingHitCenter, checkingHitLeft, checkingHitRight];
                  for(let i of hitCheckArray){
                    //checking if it is a valid mesh
                    if (i != null && i.pickedMesh != undefined && i.pickedMesh.metadata != "player" && (/*i.pickedMesh.metadata == "enemy" ||*/ i.pickedMesh.metadata == "door" || i.pickedMesh.metadata == "switch" || i.pickedMesh.metadata == "wall")){
                      //if it is a valid mesh then we're checking if it is closer than the closest current
                      if (stuff.distance(this.sprt.position, i.pickedMesh.position) < rotationMinDistance){
                        rotationMinDistance = stuff.distance(this.sprt.position, i.pickedMesh.position);
                        mainCheckHit = i;
                      }
                    }
                  }
                  //if it's a door then opening it
                  if(mainCheckHit != null && mainCheckHit.pickedMesh != undefined && mainCheckHit.pickedMesh.metadata == "door"){
                    for(let i of doors){
                      if(mainCheckHit.pickedMesh == i.mesh){
                        //if it's a door then the enemy will try to open it (but he doesn't has any key)
                        i.open(this.sprt.position, [false, false, false], scene);
                      }
                    }
                  }
                }
              }
              //when the angle is good then we move the sprite, using some basic maths
              this.sprt.position.x += this.speed * Math.cos(this.oldAngle);
              this.mesh.position.x += this.speed * Math.cos(this.oldAngle);
              this.coord[0] += this.speed * Math.cos(this.oldAngle); 
              this.sprt.position.z += this.speed * Math.sin(this.oldAngle);
              this.mesh.position.z += this.speed * Math.sin(this.oldAngle);
              this.coord[1] += this.speed * Math.sin(this.oldAngle);
            }
          }
          //else if no mesh to near then we continue in the direction of the player hoping it is a good thing
          else{
              this.sprt.position.x += this.speed * Math.cos(this.angle);
              this.mesh.position.x += this.speed * Math.cos(this.angle);
              this.coord[0] += this.speed * Math.cos(this.angle); 
              this.sprt.position.z += this.speed * Math.sin(this.angle);
              this.mesh.position.z += this.speed * Math.sin(this.angle);
              this.coord[1] += this.speed * Math.sin(this.angle);
            }
          }
        }
      //if no mesh picked
      else{
        let distanceFromPlayer = stuff.distance(player.camera.position, this.sprt.position);
        if(distanceFromPlayer <= 2.5){
          if(frames - this.framesinceNearAttack >= 100){
            this.framesinceNearAttack = frames;
            this.state = 4;
            this.attackNear(player, scene);
            this.sprt.stopAnimation();
            this.playAnimation();
          }
        }
        else{
          //moving while waiting to shoot (working, just the wall detection above is shit)
          if(frames - this.frameSinceFarAttack < 150){
           this.sprt.position.x += this.speed * Math.cos(this.angle);
            this.mesh.position.x += this.speed * Math.cos(this.angle);
            this.coord[0] += this.speed * Math.cos(this.angle); 
            this.sprt.position.z += this.speed * Math.sin(this.angle);
            this.mesh.position.z += this.speed * Math.sin(this.angle);
            this.coord[1] += this.speed * Math.sin(this.angle);
          }
          //shooting (working)
          else if (this.attackFar(player, scene)){
            this.frameSinceFarAttack = frames;
            //attack far;
            this.state = 3;
            this.sprt.stopAnimation();
            this.playAnimation();
          }
        }
      }
      this.mesh.isPickable = true;
    }
    //TODO: add description
    this.playAnimation = () => {
      if(this.stateFrames === undefined || this.sprt === undefined) return;
      let loop = true;
      //if the status is death, attack near or attack far, then no looping
      if(this.state == 2 || this.state == 3 || this.state == 4) loop = false;
      //playing the animation
      this.sprt.playAnimation(this.stateFrames[this.state][0], this.stateFrames[this.state][1], loop, 300, () => {
        if(this.state == 3 || this.state == 4){
          this.state = 5;
          this.playAnimation();
        }
      });
    }

    this.attackNear = (player: GamePlayerService, scene: BABYLON.Scene) => {
      //no general definition for now
      return false;
    }
    this.attackFar = (player: GamePlayerService, scene: BABYLON.Scene) => {
      //no general definition for now
      return false;
    }
  }
}