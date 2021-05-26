import { Injectable, Inject } from '@angular/core';
import { GamePlayerService } from '../player/game-player.service'
import * as BABYLON from '@babylonjs/core';


@Injectable({
  providedIn: 'root'
})

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
  * |   25 | Red Key         | Give the player the red key                                  |
  * |   26 | Blue Key        | Give the player the blue key                                 |
  * |   27 | Yellow Key      | Give the player the Yellow key                               |        
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
    this.type = content[0];
    this.coord = [content[1], content[2]];
    this.remove = false;
    
    this.init = (scene: BABYLON.Scene) =>{
      //setting up the sprite
      this.sprtMng = new BABYLON.SpriteManager("pickup", "../../../assets/textures/pickUp.png",  1, {height: 64, width: 64}, scene);
      switch(this.type){
        //if type isn't good, then error
        case 0:
          this.sprt = new BABYLON.Sprite("healthPickup", this.sprtMng);
          this.sprt.playAnimation(0, 3, true, 250);
          break;
        case 1:
          this.sprt = new BABYLON.Sprite("armorPickup", this.sprtMng);
          this.sprt.playAnimation(4, 7, true, 250);
          break;
        case 2:
          this.sprt = new BABYLON.Sprite("medikit", this.sprtMng);
          this.sprt.cellIndex = 8;
          break;
        case 3:
          this.sprt = new BABYLON.Sprite("armorGreen", this.sprtMng);
          this.sprt.playAnimation(12, 13, true, 250);
          break;
        case 4:
          this.sprt = new BABYLON.Sprite("armorBlue", this.sprtMng);
          this.sprt.playAnimation(16, 17, true, 250);
          break;
        case 5:
          this.sprt = new BABYLON.Sprite("soulSphere", this.sprtMng);
          this.sprt.playAnimation(20, 23, true, 250);
          break;
        case 6:
          this.sprt = new BABYLON.Sprite("megaSphere", this.sprtMng);
          this.sprt.playAnimation(24, 27, true, 250);
          break;
        case 7:
          this.sprt = new BABYLON.Sprite("smallBullets", this.sprtMng);
          this.sprt.cellIndex = 28;
          break;
        case 8:
          this.sprt = new BABYLON.Sprite("bulletBox", this.sprtMng);
          this.sprt.cellIndex = 32;
          break;
        case 9:
          this.sprt = new BABYLON.Sprite("shells", this.sprtMng);
          this.sprt.cellIndex = 36;
          break;
        case 10:
          this.sprt = new BABYLON.Sprite("shellBox", this.sprtMng);
          this.sprt.cellIndex = 40;
          break;
          /*
        case 11:
          this.sprt = new BABYLON.Sprite("rocket", this.sprtMng);
          this.sprt.cellIndex = 44;
          break;
        case 12:
          this.sprt = new BABYLON.Sprite("rocketBox", this.sprtMng);
          this.sprt.cellIndex = 48;
          break;
          */
        case 13:
          this.sprt = new BABYLON.Sprite("energyCell", this.sprtMng);
          this.sprt.cellIndex = 52;
          break;
        case 14:
          this.sprt = new BABYLON.Sprite("energyPack", this.sprtMng);
          this.sprt.cellIndex = 56;
          break;
          /*
        case 15:
          this.sprt = new BABYLON.Sprite("chainsaw", this.sprtMng);
          this.sprt.cellIndex = 60;
          break;
          */
        case 16:
          this.sprt = new BABYLON.Sprite("shotgun", this.sprtMng);
          this.sprt.cellIndex = 68;
          break;
        case 17:
          this.sprt = new BABYLON.Sprite("ssg", this.sprtMng);
          this.sprt.cellIndex = 64;
          break;
        case 18:
          this.sprt = new BABYLON.Sprite("chaingun", this.sprtMng);
          this.sprt.cellIndex = 72;
          break;
        /*
        case 19:
          this.sprt = new BABYLON.Sprite("rocketLaucher", this.sprtMng);
          this.sprt.cellIndex = 76;
          break;
        */
        case 20:
          this.sprt = new BABYLON.Sprite("plasmaRiffle", this.sprtMng);
          this.sprt.cellIndex = 80;
          break;
        case 21:
          this.sprt = new BABYLON.Sprite("bfg9k", this.sprtMng);
          this.sprt.cellIndex = 84;
          break;
        case 22:
          this.sprt = new BABYLON.Sprite("berzerk", this.sprtMng);
          this.sprt.cellIndex = 88;
          break;
        case 23:
          this.sprt = new BABYLON.Sprite("immunity", this.sprtMng);
          this.sprt.playAnimation(92, 95, true, 250);
          break;
        case 24:
          this.sprt = new BABYLON.Sprite("backpack", this.sprtMng);
          this.sprt.cellIndex = 96;
          break;
        case 25:
          this.sprt = new BABYLON.Sprite("redKey", this.sprtMng);
          this.sprt.playAnimation(100, 101, true, 250);
          break;
        case 26:
          this.sprt = new BABYLON.Sprite("blueKey", this.sprtMng);
          this.sprt.playAnimation(104, 105, true, 250);
          break;
        case 27:
          this.sprt = new BABYLON.Sprite("yellowKey", this.sprtMng);
          this.sprt.playAnimation(108, 109, true, 250);
          break;
        default:
          this.sprtMng = new BABYLON.SpriteManager("error", "assets/textures/error.jpg",  3, {height: 32, width: 32}, scene);
          this.sprt = new BABYLON.Sprite("error", this.sprtMng);
          break;
      }
      this.sprt.position.x = this.coord[0];
      this.sprt.position.z = this.coord[1];
      this.sprt.position.y = 0.5;
    }

    /**
     * Function to call when the player is on a collectible
     * @param player player that picked up the collectible
     * @param scene babylon scene
     */
    this.pickingUp = (player: GamePlayerService, scene: BABYLON.Scene, frame: number) => {
      if(this.remove) return; 
      this.remove = true;
      this.sprt.dispose();
      //loading the sound:
      if(this.type < 5 || (this.type > 6 && this.type < 15) || this.type == 24) this.sound = new BABYLON.Sound("itemPickupSound", "assets/sound/fps/pickup/item.wav", scene,  () => {
        this.sound.play();
      }, {
        loop: false,
        autoplay: false
      });
      else if(this.type == 5 || this.type == 6 || this.type == 22 || this.type == 23) this.sound = new BABYLON.Sound("powerupPickupSound", "assets/sound/fps/pickup/powerup.wav", scene, () => {
        this.sound.play();
      }, {
        loop: false,
        autoplay: false
      });
      else this.sound = new BABYLON.Sound("weaponPickupSound", "assets/sound/fps/pickup/weapon.wav", scene, () => {
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
          player.ui.updateHealth(player.health);
          break;
        //Armor pickup
        case 1:
          player.lastArmor = 1;
          if(player.armor + 1 <= 200) 
            player.armor += 1;
          player.ui.updateArmor(player.armor);
          break;
        //medikit
        case 2:
          if(player.health + 25 <= 100) player.health += 25;
          player.ui.updateHealth(player.health);
          break;
        //armor green
        case 3:
          player.lastArmor = 1;
          if(player.armor <= 100) player.armor = 100;
          player.ui.updateArmor(player.armor);
          break;
        //blue armor (megaArmor)
        case 4:
          player.lastArmor = 2;
          player.armor = 200;
          player.ui.updateArmor(player.armor);
          break;
        //soulsphere
        case 5:
          if(player.health + 100 <= 200) player.health += 100;
          else player.health = 200;
          player.ui.updateHealth(player.health);
          break;
        //megaSphere
        case 6:
          player.health = 200;
          player.armor = 200;
          player.lastArmor = 2;
          player.ui.updateHealth(player.health);
          player.ui.updateArmor(player.armor);
          break;
        //clip
        case 7:
          if((!player.hasBackPack && player.ammos[1] + 10 <= 200) || (player.hasBackPack && player.ammos[1] + 10 <= 400)) player.ammos[1] += 10;
          else if(player.hasBackPack) player.ammos[1] = 400;
          else player.ammos[1] = 200;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 1 || player.equippedWeapon == 4)
            player.ui.updateAmmo(player.ammos[1]);
          break;
        //bullet box
        case 8:
          if((!player.hasBackPack && player.ammos[1] + 50 <= 200) || (player.hasBackPack && player.ammos[1] + 50 <= 400)) player.ammos[1] += 50;
          else if(player.hasBackPack) player.ammos[1] = 400;
          else player.ammos[1] = 200;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 1 || player.equippedWeapon == 4)
            player.ui.updateAmmo(player.ammos[1]);
          break;
        //4 shells
        case 9:
          if((!player.hasBackPack && player.ammos[2] + 4 <= 50) || (player.hasBackPack && player.ammos[2] + 4 <= 100)) player.ammos[2] += 4;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 2 || player.equippedWeapon == 3)
            player.ui.updateAmmo(player.ammos[2]);
          break
        //box of shell
        case 10:
          if((!player.hasBackPack && player.ammos[2] + 20 <= 50) || (player.hasBackPack && player.ammos[2] + 20 <= 100)) player.ammos[2] += 20;
          else if(player.hasBackPack) player.ammos[2] = 100;
          else player.ammos[2] = 50;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 2 || player.equippedWeapon == 3)
            player.ui.updateAmmo(player.ammos[2]);
          break
        //1 rocket
        case 11://! not used
          if((!player.hasBackPack && player.ammos[3] + 1 <= 50) || (player.hasBackPack && player.ammos[3] + 1 <= 100)) player.ammos[3] += 1;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break
        //box of rocket
        case 12://! not used
          if((!player.hasBackPack && player.ammos[3] + 5 <= 50) || (player.hasBackPack && player.ammos[3] + 5 <= 100)) player.ammos[3] += 5;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break
        //cell pack
        case 13:
          if((!player.hasBackPack && player.ammos[4] + 20 <=300) || (player.hasBackPack && player.ammos[4] + 20 <= 600)) player.ammos[4] += 20;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 5 || player.equippedWeapon == 6)
            player.ui.updateAmmo(player.ammos[4]);
          break;
        //cell energy
        case 14:
          if((!player.hasBackPack && player.ammos[4] + 100 <=300) || (player.hasBackPack && player.ammos[4] + 100 <= 600)) player.ammos[4] += 100;
          else if(player.hasBackPack) player.ammos[4] = 300;
          else player.ammos[4] = 600;
          // Update the HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          if (player.equippedWeapon == 5 || player.equippedWeapon == 6)
            player.ui.updateAmmo(player.ammos[4]);
          break;
        //chainsaw
        case 15://! not used
          player.weaponList[8] = true;
          player.equippedWeapon = 8;
          break;
        //shotgun
        case 16:
          player.weaponList[2] = true;
          player.equippedWeapon = 2;
          // Add ammo
          if((!player.hasBackPack && player.ammos[2] + 8 <= 50) || (player.hasBackPack && player.ammos[2] + 8 <= 100)) 
            player.ammos[2] += 8;
          else if(player.hasBackPack) 
            player.ammos[2] = 100;
          else
            player.ammos[2] = 50;
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          player.ui.changeWeapon(2, player);
          player.ui.updateWeapons(2);
          break;
        //ssg
        case 17:
          player.weaponList[3] = true;
          player.equippedWeapon = 3;
          // Add ammo
          if((!player.hasBackPack && player.ammos[2] + 8 <= 50) || (player.hasBackPack && player.ammos[2] + 8 <= 100)) 
            player.ammos[2] += 8;
          else if(player.hasBackPack) 
            player.ammos[2] = 100;
          else 
            player.ammos[2] = 50;
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          player.ui.changeWeapon(3, player);
          player.ui.updateWeapons(3);
          break;
        //chaingun
        case 18:
          player.weaponList[4] = true;
          player.equippedWeapon = 4;
          // Add ammo
          if((!player.hasBackPack && player.ammos[1] + 20 <= 200) || (player.hasBackPack && player.ammos[1] + 20 <= 400)) 
            player.ammos[1] += 20;
          else if(player.hasBackPack) 
            player.ammos[1] = 400;
          else 
            player.ammos[1] = 200;
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          player.ui.changeWeapon(4, player);
          player.ui.updateWeapons(4);
          break;
        //rocket Launcher
        case 19:
          player.weaponList[7] = true;
          player.equippedWeapon = 7;
          //player.ui.changeWeapon(7, player);//!not added into the game
          if((!player.hasBackPack && player.ammos[3] + 2 <= 50) || (player.hasBackPack && player.ammos[3] + 2 <= 100)) player.ammos[3] += 2;
          else if(player.hasBackPack) player.ammos[3] = 100;
          else player.ammos[3] = 50;
          break;
        //plasma
        case 20:
          player.weaponList[5] = true;
          player.equippedWeapon = 5;
          // Add ammo
          if((!player.hasBackPack && player.ammos[4] + 40 <=300) || (player.hasBackPack && player.ammos[4] + 40 <= 600)) 
            player.ammos[4] += 40;
          else if(player.hasBackPack) 
            player.ammos[4] = 300;
          else 
            player.ammos[4] = 600;
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          player.ui.changeWeapon(5, player);
          player.ui.updateWeapons(5);
          break;
        //BFG
        case 21:
          player.weaponList[6] = true;
          player.equippedWeapon = 6;
          // Add ammo
          if((!player.hasBackPack && player.ammos[4] + 40 <=300) || (player.hasBackPack && player.ammos[4] + 40 <= 600)) 
            player.ammos[4] += 40;
          else if(player.hasBackPack) 
            player.ammos[4] = 300;
          else 
            player.ammos[4] = 600;
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], player.hasBackPack);
          player.ui.changeWeapon(6, player);
          player.ui.updateWeapons(6);
          break;
        //BERSERK
        case 22:
          player.health = 100;
          player.onBerserk = true;
          player.ui.updateHealth(player.health);
          break;
        //imunity
        case 23:
          player.isImmune = true;
          player.frameSinceImmune = frame;
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
          // Update HUD
          player.ui.updateAmmoPool(player.ammos[1], player.ammos[2], player.ammos[4], true);
          break;
        //red key
        case 25:
          player.inventory[0] = true;
          player.ui.updateKeys(0);
          break;
        //blue key
        case 26:
          player.inventory[1] = true;
          player.ui.updateKeys(1);
          break;
        //yellow key
        case 27:
          player.inventory[2] = true;
          player.ui.updateKeys(2);
          break;
        default:
          //do nothing
          break;
      }
      return;
    }

    //TODO: verifier le radius (0.5)
    this.check = (player: GamePlayerService, scene: BABYLON.Scene, frames: number) => {
      let distance = Math.sqrt(Math.pow(this.coord[0] - player.camera.position.x, 2) + Math.pow(this.coord[1] - player.camera.position.z , 2));
      if(distance <= 1.25){
        this.pickingUp(player, scene, frames);
        return true;
      }
      else return false;
    }
  }
}
