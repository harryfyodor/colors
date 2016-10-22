import React, { Component } from 'react'
import { dispatch } from 'redux'
import Header from '../Header/Header'
import Footer from '../../components/Footer/Footer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
// import {  } from '../../actions'

class Home extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      msg: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.msg) {
      this.setState({
        msg: nextProps.msg
      })
    } 
  }

  render() {
    const { children } = this.props
    // 这里不能再是children
    return (
      <div>
        <div>{this.state.msg}</div>
        <Header />
        {React.cloneElement(children, {
          color: this.props.color
        })}
      </div>
    )
  } 
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Home