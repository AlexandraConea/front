import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Game } from '../../shared/data-types/Game';
import { GamesService } from '../../services/games/games.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthDataStorage } from '../../security/auth-data-storage';
import { LoginFormService } from '../../services/login-form/login-form.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  lastDate=null;
  constructor(private service: GamesService, private router: Router, private authDataStorage: AuthDataStorage,
    private userService: LoginFormService, private route: ActivatedRoute) {
     }
  tab=0;
  games: Game[];


  ngOnInit() {
    this.getGames();
    interval(500).subscribe(() => {
      let date:any;
      this.route.queryParams.subscribe(params=>{date = params['refresh'];});
      if(this.lastDate!= date){
        this.getGames();
        this.lastDate =  date;
      }
  })
  }

  getGames(): void{
    this.service.getAllGames().subscribe( data=> {
      this.games = data;
    })
  }
  addGame(): void{
    var game = new Game();
    this.service.addGame(game).subscribe(
      response => {
          this.games.push(response);
        },
      err => {
      }
    )
  }
  logOut(): void {
    let user = this.authDataStorage.getLoggedUser();
    this.userService.update(user.userId, user.moneyAmount).subscribe(()=>{});
    this.authDataStorage.clearAuthData();
    this.router.navigate(['/logout']);
  }

}
