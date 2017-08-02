import React, { Component } from 'react'

import { observer, inject } from 'mobx-react';
import { Link, HashRouter, Switch, Route } from 'react-router-dom'

@inject('appState') @observer
class Console extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
  }

  render() {
    let appState = this.props.appState
    return (
      <div className='console'>
        <div className='console-center'>
        </div>
      </div>
    )
  }
}

export default Console
