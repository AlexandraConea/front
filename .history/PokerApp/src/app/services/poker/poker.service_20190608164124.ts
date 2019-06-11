import { Injectable } from '@angular/core';
import { DeckService } from '../deck/deck.service';
import { Player } from '../../shared/data-types/Player';
import { RobotService } from '../robot/robot.service';
import { GameVariables } from '../../shared/data-types/GameVariables'
import { delay } from 'q';
import { Card } from '../../shared/data-types/Card';
import { AuthDataStorage } from '../../security/auth-data-storage';

@Injectable({
  providedIn: 'root'
})
export class PokerService {

  variables: GameVariables = new GameVariables();
  actions = ["check, fold, raise, call"];

  constructor(private deckService: DeckService, private robotService: RobotService, private authDataStorage: AuthDataStorage) {

    this.variables.human = new Player();
    this.variables.human.id = 0;
    this.variables.human.amount = +this.authDataStorage.getLoggedUser().moneyAmount;
    this.variables.human.hand = this.deckService.dealCards(2);
    for (let card of this.variables.human.hand)
      card.faceUp = true;
    this.variables.human.isRobot = false;
    this.variables.human.username = "You";

    for (let i = 0; i < 7; i++) {
      let player = new Player();
      player.id = i + 1;
      player.isRobot = true;
      player.hand = this.deckService.dealCards(2);
      player.username = "Robot " + (i + 1).toString();
      this.variables.robots.push(player);
    }

  }


  async delay(milliseconds: number) {
    return new Promise<void>(resolve => {
      setTimeout(resolve, milliseconds);
    });
  }


  bet(p: Player, sum: number): Player {
    this.variables.pot += sum;
    p.amount -= sum;
    return p;
  }

  dealFlop(): void {
    this.variables.flop = this.deckService.dealCards(5);
  }

  showFlop(): void {
    for (let i = 0; i < 3; i++) {
      this.variables.flop[i].faceUp = true;
    }
  }

  showRiver(): void {
    this.variables.flop[4].faceUp = true;
  }

  showTurn(): void {
    this.variables.flop[3].faceUp = true;
  }

  blindBet(bet: number): void {
    this.bet(this.variables.human, bet);
    this.variables.currentBet = bet;
    this.variables.history.push("You placed the blind bet - " + this.variables.pot);
    this.variables.blindBetHuman = true;
  }


  fold(py: Player): Player {
    py.hand = null;
    this.variables.history.push(py.username + " folded.");
    if(this.variables.round == 0){
      this.variables.blindBet +=1;
    }
    if (this.variables.round == 1) {
      this.variables.firstBet += 1;
    }
    if (this.variables.round == 2) {
      this.variables.secondBet += 1;
    }
    if (this.variables.round == 3) {
      this.variables.thirdBet += 1;
    }
    if (py.isRobot)
      return py;
    else {
      this.variables.human = py;
      return null;
    }
  }

  raise(py: Player, bet: number, blind:boolean): Player {
    if(blind){
      this.blindBet(bet);
      return null;
    }
    py = this.bet(py, bet);
    this.variables.currentBet += bet;
    this.variables.history.push(py.username + " raised to " + this.variables.currentBet + ".");
    if(this.variables.round == 0){
      this.variables.blindBet +=1;
    }
    if (this.variables.round == 1) {
      this.variables.firstBet += 1;
    }
    if (this.variables.round == 2) {
      this.variables.secondBet += 1;
    }
    if (this.variables.round == 3) {
      this.variables.thirdBet += 1;
    }
    if (py.isRobot)
      return py;
    else {
      this.variables.human = py;
      return null;
    }
  }

  check(py: Player): Player {
    py = this.bet(py, this.variables.currentBet);
    this.variables.history.push(py.username + " checked.");
    if(this.variables.round == 0){
      this.variables.blindBet +=1;
    }
    if (this.variables.round == 1) {
      this.variables.firstBet += 1;
    }
    if (this.variables.round == 2) {
      this.variables.secondBet += 1;
    }
    if (this.variables.round == 3) {
      this.variables.thirdBet += 1;
    }
    if (py.isRobot)
      return py;
    else {
      this.variables.human = py;
      return null;
    }

  }


  filterFolded(): void{
    this.variables.robots = this.variables.robots.filter(obj => obj.hand != null);
    this.variables.playerNumber = this.variables.robots.length;
    if(this.variables.human.hand!=null){
      this.variables.playerNumber+=1;
    }
  }

  makeMoveForRobot(move:any , robot: Player): Player {
    move = move.split(",");
    
    if(move.length>1){
      console.log("here1   ",move);
      robot = this.raise(robot, +move[1], false);
      return robot;
    }
    if (move[0] == "check") {
      console.log("herecheck");
      robot = this.check(robot);
      return robot;
    }
    if (move[0] == "fold") {
      console.log("herefold");
      robot = this.fold(robot);
      return robot;
    }
    
  }

  async blindRound(){
    let move: string;
    for(let i=0;i<7;i++){
      move = null;
      while (this.variables.blindBet != i) {
        await delay(1000);
      }
      this.robotService.blindMove(i.toString(),{cards: this.variables.robots[i].hand}).subscribe(data => { move = data['body']; });
      while (move == null) {
        await delay(1000);
      }
      this.variables.robots[i] = this.makeMoveForRobot(move, this.variables.robots[i]);
      await delay(1000);
    }
  }

  async flopRound() {
    let move: string = null;

    for (let robot of this.variables.robots) {
      move = null;
      await delay(1500);
      this.robotService.flopMove((robot.id - 1).toString(),{cards:this.variables.flop}).subscribe(data => { move = data['body']; });
      while (move == null) {
        await delay(1000);
      }
      robot = this.makeMoveForRobot(move, robot);
      await delay(1000);
    }
  }


  async turnRound() {
    let move: string = null
    for (let robot of this.variables.robots) {
      move = null;
      await delay(1500);
      this.robotService.turnMove((robot.id - 1).toString(),{cards:this.variables.flop}).subscribe(data => { move = data['body']; });
      while (move == null) {
        await delay(1000);
      }
      robot = this.makeMoveForRobot(move, robot);
      await delay(1000);
    }
  }

  async riverRound() {
    let move: string = null
    for (let robot of this.variables.robots) {
      move = null;
      await delay(1500);
      this.robotService.riverMove((robot.id - 1).toString(),{cards:this.variables.flop}).subscribe(data => { move = data['body']; });
      while (move == null) {
        await delay(1000);
      }
      robot = this.makeMoveForRobot(move, robot);
      await delay(1000);
    }
  }

  constructJsonForCardsAndHands(): any{
    let json = {hands:[],cards:[]};
    for(let robot of this.variables.robots){
      let hand = {player:robot.username,cards:robot.hand};
      json.hands.push(hand);
    }
    if(this.variables.human.hand){
      json.hands.push({"player":"You","cards":this.variables.human.hand})
    }
    for(let card of this.variables.flop){
      json.cards.push(card);
    }
    return json;
  
  }

  async showdown(){
    let winner:string;
    let json = this.constructJsonForCardsAndHands();
    console.log("heere")
    this.robotService.evaluate(json).subscribe(data=> {winner = data['body'];});
    while(winner==null)
      await delay(1000);
    if(winner=='You')
    this.variables.history.push(winner+" won.")
  }

  async runGame() {

    this.dealFlop();
    while (!this.variables.blindBetHuman)
      await delay(1000);
    await delay(1000);

    this.blindRound();
    while (this.variables.blindBet < 7)
      await delay(1000);
    this.showFlop();
    this.filterFolded();
    this.variables.round += 1;

    this.variables.yourTurn = true;
    while (this.variables.firstBet == 0)
      await delay(1000);
    this.variables.yourTurn = false;
    await delay(1000);
    this.flopRound();
    while (this.variables.firstBet != this.variables.playerNumber)
      await delay(1000);
    this.showTurn();
    this.filterFolded();
    this.variables.round += 1;


    this.variables.yourTurn = true;
    while (this.variables.secondBet == 0)
      await delay(1000);
    this.variables.yourTurn = false;
    await delay(1000);
    this.turnRound();
    while (this.variables.secondBet!= this.variables.playerNumber)
      await delay(1000);
     this.showRiver();
    this.filterFolded();
    this.variables.round += 1;


    this.variables.yourTurn = true;
    while (this.variables.thirdBet == 0)
      await delay(1000);
    this.variables.yourTurn = false;
    await delay(1000);
    this.riverRound();
    while (this.variables.thirdBet != this.variables.playerNumber){
      await delay(1000);
      console.log(this.variables.thirdBet,"-",this.variables.playerNumber)
    }
    this.filterFolded();
    this.showdown();
  }
}
