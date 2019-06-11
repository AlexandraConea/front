import { Component, OnInit, Input } from '@angular/core';
import { TrustedString } from '@angular/core/src/sanitization/bypass';
import { Router } from '@angular/router';
import { Game } from '../../shared/data-types/Game';
import { AuthDataStorage } from '../../security/auth-data-storage';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent implements OnInit {
  @Input() photoNumber: number;
  @Input() game: Game;
  @Input() tournaments: Game[];
  
  constructor(public router: Router, public storage: AuthDataStorage) { }
  img = "../../../assets/images/games/";
  image: string;
  money:number;
  

  ngOnInit() {
    this.image = this.img+this.photoNumber+".jpg";
    this.money = +this.storage.getLoggedUser().moneyAmount;
  }
  
  setImage(photoNumber:number){
    let images: string[]=[];
    images.push("../../../assets/images/games/1.jpg");
    images.push("../../../assets/images/games/2.jpg");
    images.push("../../../assets/images/games/3.jpg");
    images.push("../../../assets/images/games/4.jpg");
    images.push("../../../assets/images/games/5.jpg");
    images.push("../../../assets/images/games/6.jpg");
    images.push("../../../assets/images/games/7.jpg");
    images.push("../../../assets/images/games/8.jpg");
    images.push("../../../assets/images/games/9.jpg");
    images.push("../../../assets/images/games/10.jpg");
    images.push("../../../assets/images/games/11.jpg");
    images.push("../../../assets/images/games/12.jpg");

    this.image = images[photoNumber];

  }

  enter(){
    this.router.navigate(['/tournament/'+this.game.gameId]);
    this.storage.setAmount((parseInt(this.storage.getLoggedUser().moneyAmount)-50).toString());
  }


}
