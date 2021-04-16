import { Injectable, Inject } from '@angular/core';
import { GamePlayerService } from '../player/game-player.service'
import * as BABYLON from '@babylonjs/core';


@Injectable({
  providedIn: 'root'
})

//TODO: add the sprite, cc Louis

export class GamePickupsService {
  type : number;
  /*
  * +------+-----------------+--------------------------------------------------------------+
  * | type |      name       |                            action                            |
  * +------+-----------------+--------------------------------------------------------------+
  * |    0 | healthPickup    | +1hp                                                         |
  * |    1 | armorPickup     | +1 armor                                                     |
  * |    2 | medikit         | +25hp                                                        |
  * |    3 | armor Green     | +100 armor                                                   |
  * |    4 | armor Blue      | +200 armor                                                   |
  * |    5 | soulsphere      | +100hp                                                       |
  * |    6 | megaSphere      | +200hp & +200armor                                           |
  * |    7 | small bullets   | +10 bullets                                                  |
  * |    8 | bullet box      | +50 bullets                                                  |
  * |    9 | shells          | +4 shells                                                    |
  * |   10 | box of shells   | +20 shells                                                   |
  * |   11 | rocket          | +1 rocket                                                    |
  * |   12 | box of rocket   | +5 rockets                                                   |
  * |   13 | energy cell     | +20 plasma                                                   |
  * |   14 | energy pack     | +100 plasma                                                  |
  * |   15 | chainsaw        | giving chainsaw                                              |
  * |   16 | shotgun         | +8shells & shotgun                                           |
  * |   17 | ssg             | +8 shells & ssg                                              |
  * |   18 | chaingun        | +20 bullets & chaingun                                       |
  * |   19 | rocket launcher | +2 rockets & Rocket Launcher                                 |
  * |   20 | plasma riffle   | +40 plasma & plasma riffle                                   |
  * |   21 | BFG9K           | +40 plasma & BFG 9K                                          |
  * |   22 | BERSERK         | +100 health & bersek on                                      |
  * |   23 | Immunity        | immune to damage for 30Sec                                   |
  * |   24 | backpack        | +10bullets, 4shotgun shells, 1 rocket & 20 cells, + backpack |
  * +------+-----------------+--------------------------------------------------------------+
  */
  coord : Array<number>;
  sprtMng!: BABYLON.SpriteManager;
  sprt !: BABYLON.Sprite;
  sound !: BABYLON.Sound;
  //to check if it has been picked up
  remove : boolean;
  init: Function;
  check: Function;
  pickingUp: Function;
  /*
  * +-------+---------+
  * | index | content |
  * +-------+---------+
  * |     0 | type    |
  * |     1 | CoordX  |
  * |     2 | CoordZ  |
  * +-------+---------+
  */
  constructor(content: Array<number>){ 
    //setting up the sprite and the coordinates
    this.type = content[0]
    this.coord = [content[1], content[2]];
    this.remove = false;
    
    this.init = (scene: BABYLON.Scene) =>{
      //setting up the sprite
      switch(this.type){
        //if type isn't good, then error
        default:
          this.sprtMng = new BABYLON.SpriteManager("error", "../../../assets/textures/error.jpg",  3, {height: 32, width: 32}, scene);
          this.sprt = new BABYLON.Sprite("error", this.sprtMng);
          break;
      }
      this.sprt.position.x = this.coord[0];
      this.sprt.position.z = this.coord[1];
      this.sprt.position.y = 0.5;
    }

    this.pickingUp = (player: GamePlayerService, scene: BABYLON.Scene) => {
      if(this.remove) return; 
      this.remove = true;
      this.sprt.dispose();
      //loading the sound:
      if(this.type < 5 || (this.type > 6 && this.type < 15) || this.type == 24) this.sound = new BABYLON.Sound("music", "../../../assets/sound/fps/pickup/item.wav", scene,  () => {
        this.sound.play();
      }, {
        loop: false,
        autoplay: false
      });
      else if(this.type == 5 || this.type == 6 || this.type == 22 || this.type == 23) this.sound = new BABYLON.Sound("music", "../../../assets/sound/fps/pickup/powerup.wav", scene, () => {
        this.sound.play();
      }, {
        loop: false,
        autoplay: false
      });
      else this.sound = new BABYLON.Sound("music", "../../../assets/sound/fps/pickup/weapon.wav", scene, () => {
        this.sound.play();
      }, {
        loop: false,
        autoplay: false
      });
      switch(this.type){
        //health pickup
        case 0:
          if(player.health + 1 <= 200) player.health += 1;
          else player.health = 200;
          break;
        //Armor pickup
        case 1:
          if(player.armor + 1 <= 200) player.armor += 1;
          else player.armor = 200;
          break;
        //medikit
        case 2:
          if(player.health + 25 <= 100) player.health += 25;
          else player.health = 100;
          break;
        //armor green
        case 3:
          player.lastArmor = 1;
          player.armor = 100;
          break;
        //blue armor (megaArmor)
        case 4:
          player.lastArmor = 2;
          player.armor = 200;
          break;
        //soulsphere
        case 5:
          player.health = 200;
          break;
        //megaSphere
        case 6:
          player.health = 200;
          player.armor = 200;
          player.lastArmor = 2;
          break;
        //clip
        case 7:
          if((!player.hasBackPack && player.ammos[1] + 10 <= 200) || (player.hasBackPack && player.ammos[1] + 10 <= 400)) player.ammos[1] += 10;
          else if(player.hasBackPack) player.ammos[1] = 400;
          else player.ammos[1] = 200;
          break;
        //bullet box
        case 8:
          if((!player.hasBackPack && player.ammos[1] + 50 <= 200) || (player.hasBackPack && player.ammos[1] + 50 <= 400)) player.ammos[1] += 50;
          else if(player.hasBackPack) player.ammos[1] = 400;
          else player.ammos[1] = 200;
          break;
        //4 shells
        case 9:
          if((!player.hasBackPack && player.ammos[2] + 4 <= 50) || (player.hasBackPack && player.ammos[2] + 4 <= 100)) player.ammos[2] += 4;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          break
        //box of shell
        case 10:
          if((!player.hasBackPack && player.ammos[2] + 20 <= 50) || (player.hasBackPack && player.ammos[2] + 20 <= 100)) player.ammos[2] += 20;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          break
        //1 rocket
        case 11:
          if((!player.hasBackPack && player.ammos[3] + 1 <= 50) || (player.hasBackPack && player.ammos[3] + 1 <= 100)) player.ammos[3] += 1;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break
        //box of rocket
        case 12:
          if((!player.hasBackPack && player.ammos[3] + 5 <= 50) || (player.hasBackPack && player.ammos[3] + 5 <= 100)) player.ammos[3] += 5;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break
        //cell pack
        case 13:
          if((!player.hasBackPack && player.ammos[4] + 20 <=300) || (player.hasBackPack && player.ammos[4] + 20 <= 600)) player.ammos[4] += 20;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          break;
        //cell energy
        case 14:
          if((!player.hasBackPack && player.ammos[4] + 100 <=300) || (player.hasBackPack && player.ammos[4] + 100 <= 600)) player.ammos[4] += 100;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          break;
        //chainsaw
        case 15:
          player.weaponList[8] = true;
          player.equipedWeapon = 8;
          break;
        //shotgun
        case 16:
          player.weaponList[2] = true;
          player.equipedWeapon = 2;
          if((!player.hasBackPack && player.ammos[2] + 8 <= 50) || (player.hasBackPack && player.ammos[2] + 8 <= 100)) player.ammos[2] += 8;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          break;
        //ssg
        case 17:
          player.weaponList[3] = true;
          player.equipedWeapon = 3;
          if((!player.hasBackPack && player.ammos[2] + 8 <= 50) || (player.hasBackPack && player.ammos[2] + 8 <= 100)) player.ammos[2] += 8;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          break;
        //chaingun
        case 18:
          player.weaponList[4] = true;
          player.equipedWeapon = 4;
          if((!player.hasBackPack && player.ammos[1] + 20 <= 200) || (player.hasBackPack && player.ammos[1] + 20 <= 400)) player.ammos[1] += 20;
          else if(player.hasBackPack) player.ammos[1] = 400;
          else player.ammos[1] = 200;
          break;
        //rocket Launcher
        case 19:
          player.weaponList[5] = true;
          player.equipedWeapon = 5;
          if((!player.hasBackPack && player.ammos[3] + 2 <= 50) || (player.hasBackPack && player.ammos[3] + 2 <= 100)) player.ammos[3] += 2;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break;
        //plasma
        case 20:
          player.weaponList[6] = true;
          player.equipedWeapon =6;
          if((!player.hasBackPack && player.ammos[4] + 40 <=300) || (player.hasBackPack && player.ammos[4] + 40 <= 600)) player.ammos[4] += 40;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          break;
        //BFG
        case 21:
          player.weaponList[7] = true;
          player.equipedWeapon = 7;
          if((!player.hasBackPack && player.ammos[4] + 40 <=300) || (player.hasBackPack && player.ammos[4] + 40 <= 600)) player.ammos[4] += 40;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          break;
        //BERSERK
        case 22:
          player.health = 100;
          player.onBerserk = true;
          break;
        //imunity
        case 23:
          player.isImmune = true;
          break;
        //backpack
        case 24:
          player.hasBackPack = true;
          //giving clip
          if(player.ammos[1] + 10 <= 400) player.ammos[1] += 10;
          else player.ammos[1] = 400;
          //giving shells
          if(player.ammos[2] + 4 <= 100) player.ammos[2] += 4;
          else player.ammos[2] = 100;
          //giving rocket
          if(player.ammos[3] + 1 <= 100) player.ammos[3] += 1;
          else player.ammos[3] = 100;
          //giving cells:
          if((!player.hasBackPack && player.ammos[4] + 20 <=300) || (player.hasBackPack && player.ammos[4] + 20 <= 600)) player.ammos[4] += 20;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          break;
        default:
          //do nothing
          break;
      }
      return;
    }

    //TODO: verifier le radius (0.5)
    this.check = (player: GamePlayerService, scene: BABYLON.Scene) => {
      let distance = Math.sqrt(Math.pow(this.coord[0] - player.camera.position.x, 2) + Math.pow(this.coord[1] - player.camera.position.z , 2));
      if(distance <= 0.75){
        this.pickingUp(player, scene);
        return true;
      }
      else return false;
    }
  }
}
