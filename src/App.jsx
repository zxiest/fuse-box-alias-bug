import styles from './shared/styles.scss'

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import DevTools from 'mobx-react-devtools';
/////////////////////// ROUTING //////////////////////
import { HashRouter, Switch, Route } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
const hashHistory = createBrowserHistory()
/////////////////////// PAGES //////////////////////
// Line below throws error
import { Login } from 'auth/Login'
// Line below works
// import { Login } from '~/src/auth/Login'
import { Console } from 'Console'

@inject('appState')
@observer
class App extends Component {


  render() {
    let appState = this.props.appState

    return (
      <div>
        <HashRouter history={hashHistory}>
          <Switch>
            <Route exact path="/home" component={Console}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route path="/" component={Console}></Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
};

export default App;
