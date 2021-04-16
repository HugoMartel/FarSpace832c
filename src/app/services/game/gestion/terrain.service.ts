import { Injectable} from '@angular/core';
import { MatrixService } from './matrix.service';

@Injectable({
  providedIn: 'root'
})
export class TerrainService{
  public terrainMatrix: any[] = [];

  constructor(private matrixService: MatrixService) {
    //this.generateTerrain(25, 15, 50, 50);
    //console.log(this.terrainMatrix);
  }

  public generateTerrain(alpha: number, subsin: number, size_x: number, size_y: number) {
    this.terrainMatrix = this.matrixService.constructMatrix(size_x , size_y);
    let x: number[] = [];
    x = this.IFSin(alpha/4, subsin, size_x);
    let y: number[] = [];
    y = this.IFSin(alpha/4, subsin, size_y);

    //console.log("IFX = ", x);
    //console.log("IFY = ", y);

    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        this.terrainMatrix[i][j] = Math.floor(x[i]+y[j]+alpha/2);
      }
    }
    return this.terrainMatrix;
  }

  /*
  private ScalNum(alpha: number, subdiv: number) {
    let result: number[] = [];
    let base: number = alpha/subdiv;
    let mid: number = subdiv/2 + 0.5;
    for (let i = 1; i < subdiv+1; i++) {
      result.push(i*base/mid);
    }
    return result;
  }
  */

  private RdScal(alpha: number, subdiv: number) {
    let result: number[] = [];
    let rest: number = alpha;
    let tmp: number = 0;
    for (let i = 0; i < subdiv-1; i++) {
      tmp = Math.random()*rest*(0.45+(i/subdiv));
      rest -= tmp;
      result.push(tmp);
    }
    result.push(rest);
    return result;
  }

  private IFSin(alpha: number, subsin: number, size: number) {
    let scale: number[] = [];
    scale = this.RdScal(alpha, subsin);
    let hz: number[] = [];
    let h0: number = Math.PI/(size);
    for (let i = 1; i < subsin+1; i++) {
      hz[i-1] = i*h0;
    }
    //hz = this.ScalNum(Math.PI, subsin);
    //console.log("scale = ", scale);
    //console.log("Hz = ", hz);
    let rdDephas: number = Math.random()*2*Math.PI;
    let result: number[] = [];
    for (let x = 0; x < size; x++) {
      let tmp: number = 0;
      for (let i = 0; i < subsin; i++) {
        tmp += scale[i]*Math.sin(hz[i]*x+rdDephas);
      }
      result.push(tmp);
    }
    return result;
  }

}
