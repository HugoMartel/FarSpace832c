import { Inject, Injectable } from '@angular/core';
import {GameFireballService} from '../fps/attacks/game-fireball.service';

import * as BABYLON from '@babylonjs/core';
import { GamePlayerService } from './player/game-player.service';
import * as stuff from './randomFunctions/random-functions.service'
import { GameDoorsService } from "./levelEnv/game-doors.service"
@Injectable({ providedIn: 'root' })

//TODO: add IA
//TODO: add attacks condition
//TODO: add pathfinding
//TODO: add a way to wake up from sleeping state
//TODO: add a way to pathfind

export class GameEnemyService {
  coord: Array<number>;
  health: number;
  type: number;
  state: number;
  angle: number;
  frameSinceFarAttack: number;
  framesinceNearAttack: number;
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
    this.angle = 0;
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
    //init the mesh and adding missing sprite:
    this.init = (scene : BABYLON.Scene) => {
      //setting up the mesh
      this.setup(scene);
      if(this.mesh !== undefined && this.sprtMng !== undefined){
        let enemyMat1 = new BABYLON.StandardMaterial("Emat", scene);
        enemyMat1.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
        enemyMat1.specularPower = 64;
        enemyMat1.alpha = 0;
        this.mesh.position = new BABYLON.Vector3(this.coord[0], 0.75, this.coord[1]);
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
    this.IA = (player: GamePlayerService, scene: BABYLON.Scene, frames: number, doors: Array<GameDoorsService>) => {
      if(this.state == 2) return;
      //if the player is near the enemy and the enemy is not shooting then wake up;
      if((this.state == 0 || this.state == 1) && stuff.distance(player.camera.position, this.sprt.position) < 5) this.state = 5;
      //shooting a ray to see what's in front / getting it's coordinates
      this.angle = stuff.computeAngle(this.sprt.position, player.camera.position);
      let direction = new BABYLON.Vector3(Math.cos(this.angle), 0, Math.sin(this.angle));
      let ray = new BABYLON.Ray(new BABYLON.Vector3(this.sprt.position.x, 0.5, this.sprt.position.z) ,direction, 100000);	
      let hit = scene.pickWithRay(ray);
      //if a wall or something else is between the player and the awaken enemy
      if(hit != undefined && hit.pickedMesh != undefined && this.state == 5 && hit.pickedMesh.metadata != "Player" && (hit.pickedMesh.metadata == "door" || hit.pickedMesh.metadata == "switch" || hit.pickedMesh.metadata == "wall")){
        //if nothing is between the player and the enemy
        if(stuff.distance(player.camera.position, this.sprt.position) < stuff.distance(this.sprt.position, hit.pickedMesh.position)){
          //if the distance is inferior to 2: then near attack
          let distanceFromPlayer = stuff.distance(player.camera.position, this.sprt.position);
          if(distanceFromPlayer <= 2){
            if(frames - this.framesinceNearAttack >= 300){
              this.framesinceNearAttack = frames;
              this.state = 4;
              this.attackNear(player, scene);
              this.sprt.stopAnimation();
              this.playAnimation();
            }
          }
          else{
              if(frames - this.frameSinceFarAttack < 200){
                this.sprt.position.x += 0.01 * Math.cos(this.angle);
                this.mesh.position.x += 0.01 * Math.cos(this.angle);
                this.coord[0] += 0.01 * Math.cos(this.angle); 
                this.sprt.position.z += 0.01 * Math.sin(this.angle);
                this.mesh.position.z += 0.01 * Math.sin(this.angle);
                this.coord[1] += 0.01 * Math.sin(this.angle);
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
        /*else if(hit.pickedMesh.metadata != "door"){
          if(stuff.distance(this.sprt.position, hit.pickedMesh.position) > 3){
            this.sprt.position.x += 0.01 * Math.cos(this.angle);
            this.mesh.position.x += 0.01 * Math.cos(this.angle);
            this.coord[0] += 0.01 * Math.cos(this.angle); 
            this.sprt.position.z += 0.01 * Math.sin(this.angle);
            this.mesh.position.z += 0.01 * Math.sin(this.angle);
            this.coord[1] += 0.01 * Math.sin(this.angle);
          }
          //opening the door if the enemy needs to go through
          else{
            for(let i of doors){
              if(hit.pickedMesh == i.mesh && i.key ==  -1){
                i.open();
              }
            }
            this.angle = this.angle + Math.PI / 2;
            this.sprt.position.x += 0.01 * Math.cos(this.angle);
            this.mesh.position.x += 0.01 * Math.cos(this.angle);
            this.coord[0] += 0.01 * Math.cos(this.angle); 
            this.sprt.position.z += 0.01 * Math.sin(this.angle);
            this.mesh.position.z += 0.01 * Math.sin(this.angle);
            this.coord[1] += 0.01 * Math.sin(this.angle);
          }
        }*/
        //if mesh is before the player
        else{
          //if mesh near
          if (stuff.distance(hit.pickedMesh.position, this.sprt.position) < 2){
            this.angle = this.angle + Math.PI / 4;
            this.sprt.position.x += 0.01 * Math.cos(this.angle);
            this.mesh.position.x += 0.01 * Math.cos(this.angle);
            this.coord[0] += 0.01 * Math.cos(this.angle); 
            this.sprt.position.z += 0.01 * Math.sin(this.angle);
            this.mesh.position.z += 0.01 * Math.sin(this.angle);
            this.coord[1] += 0.01 * Math.sin(this.angle);
          }
          else{
            this.sprt.position.x += 0.01 * Math.cos(this.angle);
            this.mesh.position.x += 0.01 * Math.cos(this.angle);
            this.coord[0] += 0.01 * Math.cos(this.angle); 
            this.sprt.position.z += 0.01 * Math.sin(this.angle);
            this.mesh.position.z += 0.01 * Math.sin(this.angle);
            this.coord[1] += 0.01 * Math.sin(this.angle);
          }
        }
      }
      //if no mesh picked
      else{
        let distanceFromPlayer = stuff.distance(player.camera.position, this.sprt.position);
        if(distanceFromPlayer <= 2){
          if(frames - this.framesinceNearAttack >= 200){
            this.framesinceNearAttack = frames;
            this.state = 4;
            this.attackNear(player, scene);
            this.sprt.stopAnimation();
            this.playAnimation();
          }
        }
        else{
            //moving while waiting to shoot (working, just the wall detection above is shit)
            if(frames - this.frameSinceFarAttack < 200){
             this.sprt.position.x += 0.01 * Math.cos(this.angle);
              this.mesh.position.x += 0.01 * Math.cos(this.angle);
              this.coord[0] += 0.01 * Math.cos(this.angle); 
              this.sprt.position.z += 0.01 * Math.sin(this.angle);
              this.mesh.position.z += 0.01 * Math.sin(this.angle);
              this.coord[1] += 0.01 * Math.sin(this.angle);
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
      //if the distance is more than 5 and the demon is not sleeping
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