import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import routes from '../routes'
import { Router } from 'react-router'
import * as actions from '../actions/index'
import { browserHistory } from 'react-router'

export default class Root extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { store, histrory } = this.props
    return (
      <Provider store={store}>
        <Router history={browserHistory} routes={routes} />
      </Provider>
    )
  }
} 