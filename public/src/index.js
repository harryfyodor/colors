import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import React, { Component, PropTypes } from 'react'

import rootSaga from './sagas'

const store = configureStore()
const histrory = syncHistoryWithStore(browserHistory, store)

store.runSaga(rootSaga)

render(
  <Root store={store} history={browserHistory} />,
  document.getElementById('root')
)