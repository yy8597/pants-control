import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router';

import './bodyStyle';
import registerServiceWorker from './registerServiceWorker';
import { store, history } from './store';
import { appStart } from './store/actions/core';
import Editors from './components/Editors';
import Login from './components/Login';

class App extends Component {
  componentDidMount() {
    store.dispatch(appStart());
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            {/* 登录和注册页 */}
            <Route exact path="/" component={Login} />
            {/* 通过 multihash 打开编辑器 */}
            <Route exact path="/note/:ID" component={Editors} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
