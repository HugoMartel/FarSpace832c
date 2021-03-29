import { Inject, Injectable } from '@angular/core';
import * as BABYLON from '@babylonjs/core';
import { GameEnemyService } from '../fps/game-enemy.service'
import { GameImpService } from '../fps/enemy/game-imp.service'
@Injectable({providedIn: 'root'})
//TODO: add a array containing sprite for each animation frame

export class GameLevelService {
  walls : Array<Array<number>>;
  enemy: Array<GameEnemyService>; 
  envi : number;
  finished: boolean;

  constructor( wallsC:Array<Array<number>>, e:Array<Array<Array<number>>>,@Inject(Number) private env:number){ 
    //note:
    //e is like:
    //[
    //[ [coordx, coordz, state]
    //[etc]
    //]]
    this.walls = wallsC;
    this.envi = env;
    this.enemy = [];
    this.finished = false;
    //setting up the enemy: 
    for(let i = 0; i < e.length; ++i){
      switch(e[i][0][0]){
        //imp
        case 1:
          for(let j = 1; j < e[i].length; ++j){
            this.enemy.push(new GameImpService([e[i][j][0], e[i][j][1]], e[i][j][2]));
          }
          break
        default:
          break;
      }
    }
  }
}
