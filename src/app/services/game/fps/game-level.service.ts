import { Inject, Injectable } from '@angular/core';
import { GameEnemyService } from '../fps/game-enemy.service'
@Injectable({providedIn: 'root'})

export class GameLevelService {
  walls : Array<Array<number>>;
  enemy: Array<GameEnemyService>; 
  envi : number;
  finished: boolean;

  constructor( wallsC:Array<Array<number>>, e:Array<GameEnemyService>,@Inject(Number) private env:number){ 
    this.walls = wallsC;
    this.enemy = e;
    this.envi = env;
    this.finished = false;
  }
}
