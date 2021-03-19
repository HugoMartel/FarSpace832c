import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerrainService {
  public matrix:Array<Array<number>>;

  constructor(@Inject(Number) private size_x:number, @Inject(Number) private size_y:number) {
    this.matrix = new Array(size_x);
    for (let x = 0; x < size_x; x++) {
      this.matrix[x] = new Array(size_y);
      for (let y = 0; y < size_y; y++) {
        this.matrix[x][y] = 0;
      }
    }
  }

  public printMatrix() {
    console.log(this.matrix);
  }

}
