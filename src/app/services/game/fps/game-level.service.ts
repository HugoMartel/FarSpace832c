import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GameDoorsService} from '../fps/levelEnv/game-doors.service';
import { GameSwitchService} from '../fps/levelEnv/game-switch.service';
import { GameEnemyService } from '../fps/game-enemy.service'
import { GameImpService } from '../fps/enemy/game-imp.service'
import { GamePickupsService } from '../fps/pickups/game-pickups.service'

@Injectable({providedIn: 'root'})

//TODO: add the health and armor pickup (incoming)

export class GameLevelService {
  walls : Array<Array<number>>;
  enemy: Array<GameEnemyService>; 
  envi : number;
  finished: boolean;
  pickups: Array<GamePickupsService>;
  doors: Array<GameDoorsService>
  switches: Array<GameSwitchService>


  constructor( 
    wallsC:Array<Array<number>>,
    enemys:Array<Array<Array<number>>>,
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
    doorsC: Array<Array<number>>,
    /* Doors give:
    * +--------------------+--------------------------+
    * | array number given |         content          |
    * +--------------------+--------------------------+
    * |                  0 | coordX                   |
    * |                  1 | coordZ                   |
    * |                  2 | key Needed (-1, 0, 1, 2) |
    * |                  3 | rotate, 0 or 1           |
    * |                  4 | switchNeeded, 0 or 1     |
    * +--------------------+--------------------------+
    */
    switchesC: Array<Array<number>>,
    /* 
    * +-------+--------+
    * | index |  arg   |
    * +-------+--------+
    * |     0 | coordX |
    * |     1 | coordZ |
    * |     2 | type   |
    * +-------+--------+
    */
    @Inject(Number) private env:number)
    { 
    this.walls = wallsC;
    this.envi = env;
    this.enemy = [];
    this.pickups = [];
    this.doors =  [];
    this.switches = []
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
    //adding the doors:
    for(let i = 0; i < doorsC.length; ++i) this.doors.push(new GameDoorsService([doorsC[i][0], doorsC[i][1]], doorsC[i][2], doorsC[i][3] ? true : false, doorsC[i][4] ? true : false, this.env));
    for(let i = 0; i < switchesC.length; ++i) this.switches.push(new GameSwitchService([switchesC[i][0], switchesC[i][1]], switchesC[i][2]));
  }
}
