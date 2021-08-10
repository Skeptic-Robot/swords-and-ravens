import IngameGameState from "../IngameGameState";
import Player from "../Player";
import GameState from "../../GameState";
import EntireGame from "../../EntireGame";
import Game from "../game-data-structure/Game";
import HouseCard from "../game-data-structure/house-card/HouseCard";
import {houseCardCombatStrengthAllocations} from "../draft-house-cards-game-state/DraftHouseCardsGameState"
import BetterMap from "../../../utils/BetterMap";
import _ from "lodash";
import {ServerMessage} from "../../../messages/ServerMessage";
import {ClientMessage} from "../../../messages/ClientMessage";
import User from "../../../server/User";


export default class CustomDraftHouseCardsGameState extends GameState<IngameGameState> {
    minCards : BetterMap<number,number>;
    pickedCards : BetterMap<string,boolean> = new BetterMap<string,boolean>(this.getAllHouseCards().map(hc => [hc.id,false]));

    get ingame(): IngameGameState {
        return this.parentGameState;
    }

    get game(): Game {
        return this.ingame.game;
    }

    get entireGame(): EntireGame {
        return this.ingame.entireGame;
    }

    constructor(ingameGameState: IngameGameState) {
        super(ingameGameState);
    }

    firstStart(): void {
        this.minCards = new BetterMap<number,number>(houseCardCombatStrengthAllocations.entries.map( e=> [e[0],e[1]*this.ingame.players.size]));
    }

    getAllHouseCards(): HouseCard[] {
        return _.sortBy(_.concat(
                this.game.houseCardsForDrafting.values,
                _.flatMap(this.game.houses.values.map(h => h.houseCards.values))), hc => -hc.combatStrength);
    }

    onServerMessage(message: ServerMessage): void {

    }

    onPlayerMessage(player:Player, message: ClientMessage): void {

    }

    getWaitedUsers(): User[] {
        if ( this.ingame.players.keys.map(u => u.id).includes(this.entireGame.ownerUserId) ){
            let users: User[] = []
            this.ingame.players.keys.forEach(u => {
                if ( u.id == this.entireGame.ownerUserId) {
                    users.push(u);
                }
            });
            return users;
        } else {
            return this.ingame.players.keys;
        }
    }

    serializeToClient(_admin: boolean, _player: Player | null): SerializedCustomDraftHouseCardsGameState {
        return {
            type:"custom-draft-house-cards",
            pickedCards:this.pickedCards
        };
    }

    static deserializeFromServer(ingameGameState: IngameGameState, _data: SerializedCustomDraftHouseCardsGameState): CustomDraftHouseCardsGameState {
        const customDraftHouseCardsGameState = new CustomDraftHouseCardsGameState(ingameGameState);
        return customDraftHouseCardsGameState;
    }
}

export interface SerializedCustomDraftHouseCardsGameState {
    type:"custom-draft-house-cards";
    pickedCards:BetterMap<string,boolean>;
}