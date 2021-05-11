import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    this.engServ.createMenuScene(this.gameCanvas);
    
    this.engServ.animate();
  }

  fullscreen() {
    this.engServ.fullscreen();
    this.gameCanvas.nativeElement.requestPointerLock();
  }
}
