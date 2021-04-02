import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GameLevelService } from '../services/game/fps/game-level.service';
import { GameEnemyService } from '../services/game/fps/game-enemy.service';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})

export class GameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true })
  public gameCanvas!: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: GameService) {  }

  public ngOnInit(): void {
    let enemytest = [
      // [[type], [coordx, coordz, state], etc]
      [[1], [2, 2, 3]]
    ];
    let levelTEST = new GameLevelService([
      [1, 4],
      [1, 3],
      [2, 5],
    ], enemytest,1);
    this.engServ.createScene(this.gameCanvas, levelTEST);
    this.engServ.animate();
  }
}
