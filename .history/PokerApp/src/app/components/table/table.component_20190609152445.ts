import { Component, OnInit, ViewChild, HostListener} from '@angular/core';
import { interval } from 'rxjs';
import { SocketService } from '../../services/socket/socket.service';
import { PokerService } from '../../services/poker/poker.service';
import { GameVariables } from '../../shared/data-types/GameVariables';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthDataStorage } from '../../security/auth-data-storage';
import { GamesService } from '../../services/games/games.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [SocketService]
})
export class TableComponent implements OnInit {

  
  @ViewChild('videoElement') videoElement: any;
  video: any;
  FPS = 3;
  easeOut = true;
  WS_URL = "ws://localhost:3001";
  variables: GameVariables;
  id: string;
  browser = <any>navigator;
  
  constructor(private pokerService: PokerService, private router: Router, private storage: AuthDataStorage, 
    private route: ActivatedRoute, private gameService: GamesService) {

  }

  ngOnInit() {
    this.pokerService.init();
    this.route.params.subscribe(params => { this.id = params['id']; });
    this.video = this.videoElement.nativeElement;
    this.start();
    interval(500).subscribe(() => {
        this.variables = this.pokerService.variables;
        this.updateScroll();
    })
    this.pokerService.runGame();
  }

  public updateScroll(): void{
    var element = document.getElementById("scroll-me");
    element.scrollTop = element.scrollHeight;
}

  public leave(): void{
    this.storage.setAmount(this.variables.human.amount.toString());
    this.video.pause();
    this.video.srcObject.getTracks()[0].stop();
    this.router.navigate(['/home']);
    this.gameService.deleteGame(this.id).subscribe(()=>{})
    
  }

  private initIoConnection(): void {
    const ws = new WebSocket(this.WS_URL);
    ws.onopen = () => {
      console.log(`Connected to ${this.WS_URL}`);
      setInterval(() => {
        ws.send(this.getFrame());
      }, 1000 / this.FPS);
    }
  }

  easeInOut():void {
    if (this.easeOut == true)
      this.easeOut = false;
    else{
      this.easeOut = true;
    }

  }

  start(): void {
    this.initCamera({ video: true, audio: false });
    this.initIoConnection();
  }

  initCamera(config: any): void {
    

    this.browser.getUserMedia = ( this.browser.getUserMedia ||
      this.browser.webkitGetUserMedia ||
      this.browser.mozGetUserMedia ||
      this.browser.msGetUserMedia);

      this.browser.mediaDevices.getUserMedia(config).then(stream => {
      this.video.srcObject = stream;
      this.video.play();
    });
  }


  getFrame = () => {
    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;
    canvas.getContext('2d').drawImage(this.video, 0, 0);
    const data = canvas.toDataURL('image/png');
    return data;
  }

  async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }

  fold(): void{
    this.pokerService.fold(this.variables.human);
  }

  raise10(): void{
    if(!this.variables.blindBetHuman)
      this.pokerService.raise(this.variables.human, 10, true);
    else
      this.pokerService.raise(this.variables.human, 10, false);
    this.easeInOut();
  }
  raise50(): void{
    if(!this.variables.blindBetHuman)
      this.pokerService.raise(this.variables.human, 50, true);
    else
      this.pokerService.raise(this.variables.human, 50, false);
    this.easeInOut();
  }
  raise100(): void{
    if(!this.variables.blindBetHuman)
      this.pokerService.raise(this.variables.human, 100, true);
    else
      this.pokerService.raise(this.variables.human, 100, false);
    this.easeInOut();
  }

  check(): void{
    this.pokerService.check(this.variables.human);
  }

}

