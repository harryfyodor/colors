import React, { Component, PropTypes } from 'react'
import Home from '../Home/Home'
import Footer from '../../components/Footer/Footer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import style from './style.css'
// NIPPON COLORS！
var json = require("json!../../colors.json")
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

export default class App extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      colorZh: "",
      colorEn: "",
      rgb: ""
    }
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.color(this) 
  }

  color(that) {

    let t = 0     
    const body = document.querySelector('body')
    body.style.transition = 'background-color 800ms'

    const change = () => {
      // 随机获取颜色
      const c = json[parseInt(Math.random()*(249-0+1)+0,10)]
      body.style.backgroundColor = "#" + c.rgb
      that.setState({
        colorZh: c.zh,
        colorEn: c.en,
        rgb: "#" + c.rgb
      })
      t += 1 
      setTimeout(function(){
        change()
      }, 5000 * t);
    }

    change()

  }

  render() {
    const { children } = this.props
    return (
      <div className="App">
        {React.cloneElement(this.props.children, {
          propsp: this.props,
          color: this.state.rgb
        })}
        <div className="colorName">
          <ReactCSSTransitionGroup 
            transitionName="colorNames" 
            transitionEnterTimeout={2000} 
            transitionLeaveTimeout={50}>
            <div key={this.state.colorEn}>
              <h1>{this.state.colorZh}</h1>
              <h3>{this.state.colorEn}</h3>
            </div>
          </ReactCSSTransitionGroup>
        </div>
        <Footer />
      </div>
    )
  } 
}
/*
const mapStateToProps = (state) => {
  return {
    login: {
      email: state.login.email,
      password: state.login.password,
      isLogging: state.login.isLogging,
      isLogged: state.login.isLogged,
      autoLogin: state.login.autoLogin,
      error: state.login.error,
      name: state.login.name
    },
    register: {
      email: state.register.email,
      password: state.register.password,
      name: state.register.name,
      isPosting: state.register.isPosting,
      isPosted: state.register.isPosted
    },
    activate: {
      hash: state.activate.hash,
      isPosting: state.activate.isPosting,
      isPosted: state.activate.isPosted
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  const appActions = {
    login: actions.login, 
    register: actions.register,
    activate: actions.activate
  }
  return {
    loginActions: bindActionCreators(appActions.login, dispatch),
    registerActions: bindActionCreators(appActions.register, dispatch),
    activateActions: bindActionCreators(appActions.activate, dispatch),
    logoutAction: bindActionCreators(actions.logout, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
*/