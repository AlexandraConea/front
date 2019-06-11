import { Player } from "./Player";
import { Card } from "./Card";

export class GameVariables{
    round = 0;
    flop: Card[] = [];
    playerNumber = 8;
    blindBetHuman = false;
    blindBet = 0;
    yourTurn = false;
    playerNumberRound =8;
    firstBet = 0;
    secondBet = 0;
    thirdBet = 0;
    robots: Player[] = [];
    human: Player;
    pot = 0;
    showdown = false;
    history: string[] = [];
    currentBet = 0;
}