import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GameEnemyService } from '../fps/game-enemy.service'
import { GameImpService } from '../fps/enemy/game-imp.service'
import { GameArmorService } from '../fps/pickups/game-armor.service'
import {GamePickupsService } from '../fps/pickups/game-pickups.service'

@Injectable({providedIn: 'root'})

//TODO: add the health and armor pickup (incoming)

export class GameLevelService {
  walls : Array<Array<number>>;
  enemy: Array<GameEnemyService>; 
  envi : number;
  finished: boolean;
  pickups!: Array<GamePickupsService>
  armors !: Array<GameArmorService>

  constructor( 
    wallsC:Array<Array<number>>,
    enemys:Array<Array<Array<number>>>, 
    pickupC:Array<Array<number>>,
    /*
    * pickups[i] index:
    * +-------+---------+
    * | index |  inside |
    * +-------+---------+
    * |     0 | type    |
    * |     1 | coord X |
    * |     2 | coord Z |
    * +-------+---------+  
    */ 
    @Inject(Number) private env:number){ 
    /*
    * enemy[j][j][k] gives:
    * +--------+-----------------------+
    * | letter |        inside         |
    * +--------+-----------------------+
    * | i      | enemy type            |
    * | j      | j: one of those enemy |
    * | k      | cf other table        |
    * +--------+-----------------------+
    * 
    * +---------+---------+
    * | k index | inside  |
    * +---------+---------+
    * |       0 | coord X |
    * |       1 | coord Z |
    * |       2 | State   |
    * +---------+---------+
    */
    this.walls = wallsC;
    this.envi = env;
    this.enemy = [];
    this.pickups = [];
    this.finished = false;
    //setting up the enemy: 
    for(let i = 0; i < enemys.length; i++){
      switch(enemys[i][0][0]){
        //imp
        case 1:
          for(let j = 1; j < enemys[i].length; ++j){
            this.enemy.push(new GameImpService([enemys[i][j][0], enemys[i][j][1]], enemys[i][j][2]));
          }
          break
        default:
          break;
      }
    }
    //adding the pickups:
    for(let i = 0; i < pickupC.length; ++i) this.pickups.push(new GamePickupsService(pickupC[i]));
    console.log(this.pickups);
  }
}
