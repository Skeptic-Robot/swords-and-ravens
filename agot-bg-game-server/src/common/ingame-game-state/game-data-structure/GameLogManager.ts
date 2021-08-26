import {observable} from "mobx";
import GameLog, {GameLogData} from "./GameLog";
import IngameGameState from "../IngameGameState";
import BetterMap from "../../../utils/BetterMap";
import User, {SerializedUser} from "../../../server/User";

export default class GameLogManager {
    ingameGameState: IngameGameState;
    lastSeenLogs: BetterMap<User,GameLog>;
    @observable logs: GameLog[] = [];

    constructor(ingameGameState: IngameGameState) {
        this.ingameGameState = ingameGameState;
        this.lastSeenLogs = new BetterMap<User,GameLog>(this.ingameGameState.entireGame.users.values.map(u => [u, {time: new Date(), data: {type: "turn-begin", turn: 1}}]))
    }

    log(data: GameLogData): void {
        const time = new Date();
        this.logs.push({data, time});

        this.ingameGameState.entireGame.broadcastToClients({
            type: "add-game-log",
            data: data,
            time: time.getTime() / 1000
        });
    }

    serializeToClient(): SerializedGameLogManager {
        return {
            logs: this.logs.map(l => ({time: l.time.getTime() / 1000, data: l.data})),
            lastSeenLogs: this.lastSeenLogs.map((u,l) => ({user: u.serializeToClient(), log: {time: l.time.getTime() / 1000, data: l.data}}))
        };
    }

    static deserializeFromServer(ingameGameState: IngameGameState, data: SerializedGameLogManager): GameLogManager {
        const gameLogManager = new GameLogManager(ingameGameState);

        gameLogManager.logs = data.logs.map(l => ({time: new Date(l.time * 1000), data: l.data}));
        gameLogManager.lastSeenLogs = new BetterMap<User,GameLog>(
            data.lastSeenLogs.map(ls => [
                gameLogManager.ingameGameState.entireGame.users.get(ls.user.id),
                {time: new Date(ls.log.time * 1000), data: ls.log.data}
            ]))
        return gameLogManager;
    }
}

export interface SerializedGameLogManager {
    logs: {time: number; data: GameLogData}[];
    lastSeenLogs: {user: SerializedUser; log: {time: number; data: GameLogData}}[];
}
