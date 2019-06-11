import { Component, OnInit } from '@angular/core';
import { GamesService } from '../../services/games/games.service';
import { Game } from '../../shared/data-types/Game';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  tournaments: Game[];
  photoNumber=0;
  constructor (private gameService: GamesService ){}

  ngOnInit() {
    interval(1000).subscribe(() => {
      this.getGames();
  })
    
  }

  getGames(){
    this.gameService.getAllGames().subscribe( data=> {
      this.tournaments = data;
    })
  }

  getPhotoNumber(id: string){
    let nr = +id;
    return nr%12 +1;
  }

}
