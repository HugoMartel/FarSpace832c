import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MatrixService {
  public matrix: number[][] = [];

  constructor() {}

  public printMatrix() {
    console.log(this.matrix);
  }

  public constructMatrix(size_x: number, size_y: number) {
    this.matrix = new Array(size_x);
    for (let x = 0; x < size_x; x++) {
      this.matrix[x] = new Array(size_y);
      for (let y = 0; y < size_y; y++) {
        this.matrix[x][y] = 0;
      }
    }
    return this.matrix;
  }

  public getMatrix() {
    return this.matrix;
  }

}
