// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { Map, List } from 'immutable';

import { textInputAction } from '../reducers/nlp';
import { addNewCardAction, saveCardToMemoryAction } from '../reducers/cards';
import { executeCodeAction } from '../reducers/execute';
import { setAsConfigAction } from '../reducers/config';
import type { Card } from '../reducers/cards';

import Actor from '../components/Actor';

const Container = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
`;

const ActorFlow = styled.div`
  max-width: 1000px;
  min-width: 45vw;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
`;

function mapStateToProps(state) {
  return {
    cards: state.cards.get('cards'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      textInputAction,
      addNewCardAction,
      saveCardToMemoryAction,
      executeCodeAction,
      setAsConfigAction,
    },
    dispatch,
  );
}

@connect(mapStateToProps, mapDispatchToProps)
export default class HomePage extends Component {
  props: {
    textInputAction: Function,
    addNewCardAction: Function,
    saveCardToMemoryAction: Function,
    executeCodeAction: Function,
    setAsConfigAction: Function,
    cards: List<Map<Card>>,
  };

  render() {
    return (
      <Container>
        <ActorFlow>
          <button onClick={() => this.props.addNewCardAction()}>+</button>
          {this.props.cards
            .toArray()
            .map(aCard => (
              <Actor
                key={aCard.get('id')}
                id={aCard.get('id')}
                textInputAction={this.props.textInputAction}
                saveCardToMemoryAction={this.props.saveCardToMemoryAction}
                setAsConfigAction={this.props.setAsConfigAction}
                tags={aCard.get('tags')}
                initialContent={aCard.get('content')}
                executeCodeAction={this.props.executeCodeAction}
              />
            ))}
        </ActorFlow>
      </Container>
    );
  }
}
