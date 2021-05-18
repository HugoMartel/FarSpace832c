import { Injectable} from '@angular/core';
import { MatrixService } from './matrix.service';

@Injectable({
  providedIn: 'root'
})
export class TerrainService{
  public terrainMatrix: any[] = [];
  //public terrainMatrixTest: any[] = [];

  constructor(private matrixService: MatrixService) {
    //this.generateTerrain(25, 15, 50, 50);
    //console.log(this.terrainMatrix);
  }

  public generateTerrain(alpha: number, subsin: number, size_x: number, size_y: number) {
    this.terrainMatrix = this.matrixService.constructMatrix(size_x, size_y);
    //this.terrainMatrixTest = this.matrixService.constructMatrix(size_x , size_y);
    let x: number[] = [];
    x = this.IFSin(alpha/4, subsin, size_x);
    let y: number[] = [];
    y = this.IFSin(alpha/4, subsin, size_y);
    //console.log("IFX = ", x);
    //console.log("IFY = ", y);
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        this.terrainMatrix[i][j] = x[i]+y[j]+alpha/2;
        //this.terrainMatrixTest[i][j] = 30;
      }
    }

    for (let k = 0; k < 50; k++) {
      for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < y.length; j++) {
          this.ErrodeLight(i, j, size_x , size_y, alpha);
        }
      }
    }

    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        this.terrainMatrix[i][j] = Math.floor(this.terrainMatrix[i][j]);
      }
    }
    for (let i = 0; i < x.length; i++) {
      for (let j = 0; j < y.length; j++) {
        this.CheckSingle(i, j, size_x , size_y);
      }
    }

    return this.terrainMatrix;
  }

  //Original scaling, got a better one now
  private ScalNum(alpha: number, subdiv: number) {
    let result: number[] = [];
    let base: number = alpha/subdiv;
    let mid: number = subdiv/2 + 0.5;
    for (let i = 1; i < subdiv+1; i++) {
      result.push(i*base/mid);
    }
    return result;
  }

  //Simple, no fancy, just as we need
  private RdScal(alpha: number, subdiv: number) {
    let result: number[] = [];
    let rest: number = alpha;
    let tmp: number = 0;
    for (let i = 0; i < subdiv-1; i++) {
      tmp = Math.random()*rest*(0.25+(i/subdiv)*0.75);
      rest -= tmp;
      result.push(tmp);
    }
    result.push(rest);
    return result;
  }

  //Full cursed do not use
  private RdExpSigmoidScal(alpha: number, subdiv: number) {// alpha do not exceed 148 & sudiv need to be over 5
    let result: number[] = [];
    let rest: number = alpha;
    let tmp: number = 0;
    for (let i = 0; i < subdiv-1; i++) {
      tmp = Math.random()*rest*((Math.exp(-50*i/subdiv)/2)+(1/(1+Math.exp((-8*i/subdiv)+5))));
      rest -= tmp;
      result.push(tmp);
    }
    result.push(rest);
    return result;
  }

  //Full Flat do not use
  private RdSemiEquiScal(alpha: number, subdiv: number) {
    let result: number[] = [];
    let rest: number = alpha;
    let tmp: number = 0;
    let beta: number = 0;
    for (let i = 0; i < subdiv-1; i++) {
      beta = (subdiv/2) - (0.5*i)
      tmp = Math.random()*rest/beta;
      rest -= tmp;
      result.push(tmp);
    }
    result.push(rest);
    return result;
  }

  //Fusion of RdExpSigmoidScal and RdSemiEquiScal probably end up in a do not use
  //So ... It's turn out that it's both Flat and Cursed at the same time ...
  private RdFusionScal(alpha: number, subdiv: number) {// alpha do not exceed 148 & sudiv need to be over 5
    let result: number[] = [];
    let rest: number = alpha;
    let tmp: number = 0;
    for (let i = 0; i < subdiv-1; i++) {
      if (Math.random() > 0.333) {
        tmp = Math.random()*rest/((subdiv/2)-(0.5*i));
      } else {
        tmp = Math.random()*rest*((Math.exp(-50*i/subdiv)/2)+(1/(1+Math.exp((-8*i/subdiv)+5))));
      }
      rest -= tmp;
      result.push(tmp);
    }
    result.push(rest);
    return result;
  }

  private IFSin(alpha: number, subsin: number, size: number) {
    let scale: number[] = [];
    scale = this.RdScal(alpha, subsin);
    console.log("scales : ", scale);

    let hz: number[] = [];
    let h0: number = (Math.PI/(size))*1.5;
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

  //do not use that shit, it will consume your computer
  private Errode(posX: number, posY: number){//do not use on border
    let deepPot: number = 0;
    let voisinPot: number[] = [];
    let tmp: number = 0;
    let alone: boolean = true;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
          tmp = this.terrainMatrix[posX][posY] - this.terrainMatrix[i+posX][j+posY];
          if (tmp > 1+Math.floor(Math.random()*1.5)) {
            deepPot += tmp;
            voisinPot.push(tmp);
          }else {
            voisinPot.push(0);
            if (tmp != 1) {alone = false}
          }
        }
      }
    if (alone) {
      this.terrainMatrix[posX][posY] -= 1;
    }
    tmp = Math.floor(Math.random()*deepPot);
    for (let k = 0; k < voisinPot.length; k++) {
      tmp -= voisinPot[k];
      if (tmp < 0) {
        this.terrainMatrix[posX][posY] -= 1;
        this.terrainMatrix[posX+Math.floor(k/3)-1][posY+(k%3)-1] += 1;

        //this.terrainMatrixTest[posX][posY] -= 1;
        //this.terrainMatrixTest[posX+Math.floor(k/3)-1][posY+(k%3)-1] += 1;
        break;
      }
    }
  }

  //do not use that shit, it will consume your computer
  private ErrodeBorder(posX: number, posY: number, maxX: number, maxY: number, alpha: number){
    let deepPot: number = 0;
    let voisinPot: any[] = [];
    let voisinInfo: number[] = [];
    let tmp: number = 0;
    /*
    if (this.terrainMatrix[posX][posY] < alpha*Math.random()*4 && this.terrainMatrix[posX][posY] > alpha/4) {
      this.terrainMatrix[posX][posY] -= 1;
    }else if (this.terrainMatrix[posX][posY] < Math.random()*alpha) {
      this.terrainMatrix[posX][posY] += 1;
    }
    */
    let ax: number = 0;
    let bx: number = 0;
    let ay: number = 0;
    let by: number = 0;

    if (posX == 0 && posY == 0) {
      ax = 0;
      bx = 1;
      ay = 0;
      by = 1;
    }else if(posX == 0 && posY == maxY-1){
      ax = 0;
      bx = 1;
      ay = -1;
      by = 0;
    }else if(posX == maxX-1 && posY == maxY-1){
      ax = -1;
      bx = 0;
      ay = -1;
      by = 0;
    }else if(posX == maxX-1 && posY == 0){
      ax = -1;
      bx = 0;
      ay = 0;
      by = 1;
    }else if(posX == 0){
      ax = 0;
      bx = 2;
      ay = -1;
      by = 1;
    }else if(posY == 0){
      ax = -1;
      bx = 1;
      ay = 0;
      by = 2;
    }else if(posX == maxX-1){
      ax = -2;
      bx = 0;
      ay = -1;
      by = 1;
    }else if(posY == maxY-1){
      ax = -1;
      bx = 1;
      ay = -2;
      by = 0;
    }

    //console.log(ax, bx, ay, by);
    for (let i = ax; i <= bx; i+=1) {
      for (let j = ay; j <= by; j+=1) {
        //console.log("compare ", posX, " ", posY, " to ", i+posX, " ", j+posY);
        voisinInfo = [];
        tmp = this.terrainMatrix[posX][posY] - this.terrainMatrix[i+posX][j+posY];
        if (tmp > 0) {
          deepPot += tmp;
          voisinInfo.push(tmp);
          voisinInfo.push(i+posX);
          voisinInfo.push(j+posY);
          voisinPot.push(voisinInfo);
        }else {
          voisinInfo.push(0);
          voisinPot.push(0);
        }
      }
    }

    tmp = Math.floor(Math.random()*deepPot);
    //console.log(voisinPot);

    for (let k = 0; k < voisinPot.length; k++) {
      tmp -= voisinPot[k][0];
      if (tmp < 0) {
        this.terrainMatrix[posX][posY] -= (1+Math.floor(Math.random()*1.5));
        this.terrainMatrix[voisinPot[k][1]][voisinPot[k][2]] += 1;

        //this.terrainMatrixTest[posX][posY] -= (1+Math.floor(Math.random()*1.5));
        //this.terrainMatrixTest[voisinPot[k][1]][voisinPot[k][2]] += 1;
        break;
      }
    }

  }

  private ErrodeLight(posX: number, posY: number, maxX: number, maxY: number, alpha: number){
    let newX: number = Math.floor(Math.random()*5)-2+posX;
    let newY: number = Math.floor(Math.random()*5)-2+posY;

    if (newX >= maxX || newX < 0 || newY >= maxY || newY < 0) {
      //console.log("(X;Y) = (", posX, ";", posY, ") = ", this.terrainMatrix[posX][posY], " => (nX;nY) = (", newX, ";", newY, ")");
      if (this.terrainMatrix[posX][posY] > 3*alpha/4) {
        this.terrainMatrix[posX][posY] += Math.random()-1;
      }else if (this.terrainMatrix[posX][posY] < alpha/4) {
        this.terrainMatrix[posX][posY] += Math.random();
      }else {
        this.terrainMatrix[posX][posY] += Math.random()*2-1;
      }
      //console.log("Apply : (X;Y) = (", posX, ";", posY, ") = ", this.terrainMatrix[posX][posY], " => (nX;nY) = (", newX, ";", newY, ")");
    }else {
      let diffZ: number = this.terrainMatrix[newX][newY]-this.terrainMatrix[posX][posY];

      if (diffZ < 0) {
        //console.log("(X;Y) = (", posX, ";", posY, ") = ", this.terrainMatrix[posX][posY], " => (nX;nY) = (", newX, ";", newY, ") = ", this.terrainMatrix[newX][newY]);
        //console.log("diffZ = ", diffZ);
        this.terrainMatrix[newX][newY] -= diffZ/3;
        this.terrainMatrix[posX][posY] += diffZ/3;
        //console.log("Aplly : (X;Y) = (", posX, ";", posY, ") = ", this.terrainMatrix[posX][posY], " => (nX;nY) = (", newX, ";", newY, ") = ", this.terrainMatrix[newX][newY]);
      }
    }
  }

  private CheckSingle(posX: number, posY: number, maxX: number, maxY: number){
    let checklist: number[] = [-1, 1];
    let relatProx: number = 2;
    for (let i of checklist) {
      if (relatProx != 0) {
        if (posX+i < maxX && posX+i >= 0) {
          let diffZ: number = this.terrainMatrix[posX+i][posY] - this.terrainMatrix[posX][posY];
          if (diffZ != 0) {diffZ = diffZ/Math.abs(diffZ);}
          if (relatProx != 2 && relatProx != diffZ) {relatProx = 0;}
          else {relatProx = diffZ;}
        }
      }
    }
    for (let j of checklist) {
      if (relatProx != 0) {
        if (posY+j < maxY && posY+j >= 0) {
          let diffZ: number = this.terrainMatrix[posX][posY+j] - this.terrainMatrix[posX][posY];
          if (diffZ != 0) {diffZ = diffZ/Math.abs(diffZ);}
          if (relatProx != 2 && relatProx != diffZ) {relatProx = 0;}
          else {relatProx = diffZ;}
        }
      }
    }
    if (relatProx > 0) {this.terrainMatrix[posX][posY] += 1;}
    else if (relatProx < 0) {this.terrainMatrix[posX][posY] -= 1;}
  }
}
