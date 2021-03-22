import { Inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class GameEnemyService {
  coord: Array<number>;
  health: number;
  type: number;

  constructor(c: Array<number>, @Inject(Number) private h: number, @Inject(Number) private t: number) { 
    this.coord = c;
    this.health = h;
    this.type = t;
  }
}
