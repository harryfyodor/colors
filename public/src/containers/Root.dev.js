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

  componentDidMount() {
    /*
    this.props.store.dispatch(actions.finish.request({
      detail: "coding",
      tags: ["react", "redux"],
      period: 120
    }))
    */
    //this.props.store.dispatch(actions.tags.request())
    //this.props.store.dispatch(actions.begin.request())
    //this.props.store.dispatch(actions.events.request())
    //this.props.store.dispatch(actions.set.request({oldPw:"1234",newPw:"1234",name:"1234"}))
    //this.props.store.dispatch(actions.edit.request({pastEvent:{date:"2016-10-02",time:"14:46"},newEvent:{detail:"code...",tags:["react","redux","router","saga"]}}))
    //this.props.store.dispatch(actions.rank.request())
    //this.props.store.dispatch(actions.degree.request())
    //this.props.store.dispatch(actions.count([1], 2, 3))
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