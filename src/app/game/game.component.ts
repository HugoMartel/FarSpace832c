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


  public constructor(private engServ: GameService) { }
  

  public ngOnInit(): void {

    this.gameCanvas.nativeElement.width = 0.95 * window.innerWidth;
      this.gameCanvas.nativeElement.height = 9 * this.gameCanvas.nativeElement.width / 16;
    document.addEventListener("fullscreenchange", (e: Event) => {
      e.preventDefault();
      this.gameCanvas.nativeElement.width = 0.95 * window.innerWidth;
      this.gameCanvas.nativeElement.height = 9 * this.gameCanvas.nativeElement.width / 16;
    });

    this.engServ.createMenuScene(this.gameCanvas);
    
    this.engServ.animate();
  }

  fullscreen() {
    this.engServ.fullscreen();
    this.gameCanvas.nativeElement.requestPointerLock();
  }
}
