import {observer} from "mobx-react";
import * as React from "react";
import {Component} from "react";
import ChooseHouseCardGameState
    from "../../common/ingame-game-state/action-game-state/resolve-march-order-game-state/combat-game-state/choose-house-card-game-state/ChooseHouseCardGameState";
import HouseCard from "../../common/ingame-game-state/game-data-structure/house-card/HouseCard";
import House from "../../common/ingame-game-state/game-data-structure/House";
import GameStateComponentProps from "./GameStateComponentProps";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import _ from "lodash";

@observer
export default class ChooseHouseCardComponent extends Component<GameStateComponentProps<ChooseHouseCardGameState>> {
    render() {
        return (
            <Row>
                <Col xs={12}>
                    The attacker and the defender must choose a House Card
                </Col>
                <Col xs={12}>
                    {this.shouldChooseHouseCard() ? (
                        <Row className="justify-content-center">
                            {this.getChoosableHouseCards().map(hc => (
                                <Col xs="auto">
                                    <Button onClick={() => this.chooseHouseCard(hc)} key={hc.id}>
                                        {hc.name}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <div>
                            Waiting for {this.getWaitingForHouses().map(h => h.name).join(" and ")} to choose their House Cards...
                        </div>
                    )}
                </Col>
            </Row>
        );
    }

    chooseHouseCard(houseCard: HouseCard): void {
        this.props.gameState.chooseHouseCard(houseCard);
    }

    getWaitingForHouses(): House[] {
        return _.difference(this.props.gameState.combatGameState.houseCombatDatas.keys, this.props.gameState.houseCards.keys);
    }

    shouldChooseHouseCard(): boolean {
        return this.getWaitingForHouses().some(h => this.props.gameClient.doesControlHouse(h));
    }

    getChoosableHouseCards(): HouseCard[] {
        if (!this.props.gameClient.authenticatedPlayer) {
            return [];
        }

        return this.props.gameState.getChoosableCards(this.props.gameClient.authenticatedPlayer.house);
    }
}