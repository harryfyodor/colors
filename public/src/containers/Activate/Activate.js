import React, { Component, PropTypes } from 'react'
import style from './style.css'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { activate } from '../../actions'
import cx from 'react-classset'

class Activate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: "正在激活中...",
      activated: false
    }
  }
  
  static propTypes = {
    isPosted: PropTypes.bool.isRequired
  }

  componentWillMount() {
    const reg = /\/activate\/(.*)\/(.*)/
    const hash = this.props.location.pathname
    reg.test(hash)
    this.props.activateActions.request({ name: RegExp.$1, hash: RegExp.$2 })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(this.state.activated) {
      return false
    }
    return true
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isPosted) {
      this.setState({
        msg: "成功激活！",
        activated: true
      });
    }
  }

  render() {
    const classSets = cx({
      "activate": true,
      "colorSquare": true
    })
    return (
      <div className={classSets}>
        <h2>{this.state.msg}</h2>
        {this.state.activated ? <div><p>激活成功！请点击下面的链接登陆~</p>
            <a href="http://localhost:3000/login">登陆</a></div> : ""}
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isPosted: state.activate.isPosted
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    activateActions: bindActionCreators(activate, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Activate)