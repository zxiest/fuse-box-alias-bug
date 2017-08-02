import React, { Component } from 'react'
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom'
import styles from './styles.scss'
import PropTypes from 'prop-types';

@inject('appState') @observer
class Login extends Component {
  static contextTypes = {
    router: PropTypes.object
  }
  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    let appState = this.props.appState.login

    return <div className='login'>
      LOGIN HERE
      </div>
  }
}

export default Login
