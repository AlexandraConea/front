import { Component, OnInit, Input } from '@angular/core';
import { GamesService } from '../../services/games/games.service';
import { Game } from '../../shared/data-types/Game';
import { interval } from 'rxjs';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit {

  @Input() tournaments: Game[];
  photoNumber=0;
  constructor (){}

  ngOnInit() {
    
  }

  getPhotoNumber(id: string){
    let nr = +id;
    return nr%12 +1;
  }

}
