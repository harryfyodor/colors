import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import style from './style.css'
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

class Header extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      on: false
    }
  }

  static propTypes = {
    isLogged: PropTypes.bool.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if(!nextProps.isLogged) {
      this.context.router.push('/login')
      //this.props.history.push('/login')
    }
  }

  onClickOn(e) {
    this.setState({
      on: !this.state.on
    })
  }

  onClickMask() {
    console.log(123)
    this.setState({
      on: false
    })
  }

  onLogout() {
    this.props.logoutActions.request()
  }

  render() {

    return (
      <header className="header">
        <ul>
          <li><Link to="/home">Colors</Link></li>
          <li><Link to="/about">关于</Link></li>
          <li><Link to="/rank">榜单</Link></li>
          <li onClick={this.onClickOn.bind(this)}>
            <a>用户</a>
            <div>
              <ReactCSSTransitionGroup 
                transitionName="menu" 
                transitionEnterTimeout={500} 
                transitionLeaveTimeout={300}>
                {this.state.on ? 
                <ul key={this.state.on}>
                  <li><Link to="/collection">颜色</Link></li>
                  <li><Link to="/history">历史</Link></li>
                  <li><Link to="/settings">设置</Link></li>
                  <li onClick={this.onLogout.bind(this)}><Link to="/">登出</Link></li>
                </ul>
                :<ul></ul>}
              </ReactCSSTransitionGroup>
            </div>
          </li>
        </ul>
        {this.state.on ?
          <div className="mask" onClick={this.onClickMask.bind(this)}></div>
          : ""
        }
      </header>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isLogged: state.login.isLogged
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutActions: bindActionCreators(actions.logout, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)