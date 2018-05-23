// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Grid, Cell } from 'styled-css-grid';

import Editors from '../../components/Editors';

const Header = styled.header`
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const HeaderTitle = styled.h1`
  font-size: 14px;
`;
const Container = styled(Grid)`
  height: 100vh;
  width: 100vw;
`;
class NoteBook extends Component<*, *> {
  state = {
    leftNoteWidth: 3,
    noteAreaWidth: 12,
  };
  render() {
    return (
      <Container columns={this.state.noteAreaWidth}>
        <Cell width={this.state.leftNoteWidth}>
          <Editors sideBar />
        </Cell>
        <Cell width={this.state.noteAreaWidth - this.state.leftNoteWidth}>
          <Header>
            <HeaderTitle>Welcome to Pants-Control</HeaderTitle>
          </Header>
          <Editors margin />
        </Cell>
      </Container>
    );
  }
}

export default connect(() => ({}))(NoteBook);
