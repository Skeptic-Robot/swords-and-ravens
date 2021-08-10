import {Component, ReactNode} from "react";
import * as React from "react";
import {observer} from "mobx-react";
import ListGroupItem from "react-bootstrap/ListGroupItem";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GameStateComponentProps from "./GameStateComponentProps";
import CustomDraftHouseCardsGameState from "../../common/ingame-game-state/custom-draft-house-cards-game-state/CustomDraftHouseCardsGameState";
import HouseCardComponent from "./utils/HouseCardComponent";
import { FormCheck } from "react-bootstrap";

@observer
export default class CustomDraftHouseCardsGameComponent extends Component<GameStateComponentProps<CustomDraftHouseCardsGameState>> {

    get canChangeDraft(): boolean {
        return this.props.gameClient.isOwner();
    }

    render(): ReactNode {
        return (
            <Container>
                <Row className = "justify-content-center">
                    {this.props.gameState.getAllHouseCards().map((hc,ind) => (
                        <Col xs="auto" key={hc.id}>
                            <HouseCardComponent
                                houseCard={hc}
                                size="small"
                                unavailable = {!this.props.gameState.pickedCards.get(hc.id)}
                            />
                            <FormCheck
                                id = {hc.id}
                                type = "checkbox"
                                checked = {this.props.gameState.pickedCards.get(hc.id)}
                                onChange={() => this.props.gameState.pickedCards.replace(hc.id,!this.props.gameState.pickedCards.get(hc.id))}
                            />
                        </Col>
                    ))}
                </Row>
                
            </Container>
        );
    }
}