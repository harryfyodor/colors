import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { login } from '../../actions'
import style from './style.css'
import cx from 'react-classset'

class Login extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      email: "",
      password: "",
      msg: "",
      autoLogin: true
    }
  }

  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    // 自动登陆
    if(document.cookie) {
      //const email = document.cookie.replace("email=", "")
      //                             .replace("%40", "@")
      this.props.loginActions.request({
        email:null, 
        password: null,
        autoLogin: null
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isLogged) {
      this.context.router.push('/home')
      // this.props.history.push('/home')
    } else {
      this.setState({
        msg: nextProps.error
      })
    }
  }

  onChangeEmail(e) {
    this.setState({ email: e.target.value })
  }

  onChangePassword(e) {
    this.setState({ password: e.target.value })
  }

  onLogin() {
    if(this.validate()) {
      this.props.loginActions.request({
        email:this.state.email, 
        password:this.state.password,
        autoLogin: this.state.autoLogin
      })
    }
  }

  onChecked() {
    this.setState({
      autoLogin: !this.state.autoLogin
    })
  }

  onGoRegister() {
    this.context.router.push('/register')
  }

  validate() {
    const emailRe = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    const nameRe = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    if(!emailRe.test(this.state.email)) {
      this.setState({
        msg: "邮箱格式不正确！"
      })
      return false
    } else if (!nameRe.test(this.state.name)) {
      this.setState({
        msg: "用户名格式有误。"
      })
      return false
    }
    return true
  }

  render() {
    const classSets = cx({
      "login": true,
      "colorSquare": true
    })
    return (
      <div className={classSets}>
        <hgroup>
          <h1>Colors</h1>
          <h3>时间管理</h3>
        </hgroup>
        <div className="msg">{this.state.msg}</div>
        <div>
          <label>账号</label>
          <input type="email" onChange={this.onChangeEmail.bind(this)} 
            placeholder="邮箱"/>
        </div>
        <div>
          <label>密码</label>
          <input type="password" onChange={this.onChangePassword.bind(this)} />
        </div>
        <div>
          <button onClick={this.onLogin.bind(this)}>登录</button>
          <button onClick={this.onGoRegister.bind(this)}>注册</button>
        </div>
        <div>
          <input type="checkbox" checked={this.state.autoLogin} onChange={this.onChecked.bind(this)}/>
          <span>自动登陆</span>
          <Link to="/forgetpw">忘记密码</Link> 
        </div>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isLogged: state.login.isLogged,
    error: state.login.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginActions: bindActionCreators(login, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)