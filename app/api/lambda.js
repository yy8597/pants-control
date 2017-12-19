// @flow
import vm from 'vm';
import fs from 'fs-extra';
import path from 'path';
import { ApolloClient } from 'apollo-client';
import gql from 'graphql-tag';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { remote } from 'electron';

import { store } from '../store';

export default async function runLambda(req, res) {
  const { noteID, sectionID } = req.params;
  if (store.getState().cards.hasIn(['entities', 'notes', 'byID', noteID])) {
    let code: string = '';
    const contentJSON = JSON.parse(store.getState().cards.getIn(['entities', 'notes', 'byID', noteID, 'content']));
    if (contentJSON.blocks) {
      code = contentJSON.blocks.map(block => block.text).join('\n');
    }
    let stdout: any = '';
    const client = new ApolloClient({
      link: new HttpLink({ uri: 'http://localhost:6012/graphql' }),
      cache: new InMemoryCache(),
    });
    const asyncCode = `'use strict';
    async function runInVM() {
      try {
        ${code};
      } catch(error) {
        console.error(error);
      }
    };
    runInVM()`;
    stdout = await vm.runInNewContext(asyncCode, { req, client, gql, console, fs, path, getPath: remote.app.getPath });
    res.send(stdout);
  } else {
    res.send(req.params);
  }
}
