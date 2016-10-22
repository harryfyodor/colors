import React, { Component, PropTypes } from 'react'
import style from './style.css'
import loginStyle from '../Login/style.css'
import cx from 'react-classset'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { register } from '../../actions'

class Register extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      email: "",
      name: "",
      pw: "",
      pw2: "",
      msg: "注册后请登录邮箱激活。"
    }
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }
    
  static propTypes = {
    isPosted: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
  }
    
  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangeName(e) {
    if(this.state.name.length <= 20) {
      this.setState({
        name: e.target.value,
        msg: ""
      })
    } else {
      this.setState({
        name: e.target.value,
        msg: "用户名字符应少于20个。"
      })
    }
  }

  onChangePw(e) {
    if(this.state.pw.length <= 15) {
      this.setState({
        pw: e.target.value,
        msg: ""
      })
    } else {
      this.setState({
        pw: e.target.value,
        msg: "密码字符应少于15个。"
      })
    }
  }

  onChangePw2(e) {
    if(this.state.pw !== e.target.value) {
      this.setState({
        pw2: e.target.value,
        msg: "重复密码必须相同！"
      })
    } else {
      this.setState({
        pw2: e.target.value,
        msg: ""
      })
    }
  }

  onRegister() {
    if(this.validate()) {
      this.props.registerActions.request({
        email: this.state.email,
        password: this.state.pw,
        name: this.state.name
      })
    }
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
        msg: "用户名只允许汉字、字母、数字以及下划线。"
      })
      return false
    } else if (this.state.name.length > 20) {
      this.setState({
        msg: "用户名应少于20个字符。"
      })
      return false
    } else if (this.state.pw.length > 15) {
      this.setState({
        msg: "密码字符应少于15个。"
      })
      return false
    }else if (this.state.pw !== this.state.pw2) {
      this.setState({
        msg: "两次输入的密码不相同。"
      })
      return false
    }
    return true
  }
  
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if(nextProps.isPosted) {
      this.context.router.push('/login')
    } else if(nextProps.error) {
      this.setState({
        msg: nextProps.error
      })
    }
  }

  render() {
    const classSets = cx({
      "colorSquare": true,
      "register": true
    })
    return (
      <div className={classSets}>
        <hgroup>
          <h1>Colors</h1>
          <h3>时间管理</h3>
        </hgroup>
        <span className="msg">{this.state.msg}</span>
        <div>
          <label>邮箱</label>
          <input type="email" onChange={this.onChangeEmail.bind(this)} />
        </div>
        <div>
          <label>用户名</label>
          <input type="text" onChange={this.onChangeName.bind(this)} />
        </div>
        <div>
          <label>密码</label>
          <input type="password" onChange={this.onChangePw.bind(this)} />
        </div>
        <div>
          <label>重复密码</label>
          <input type="password" onChange={this.onChangePw2.bind(this)} />
        </div>
        <button onClick={this.onRegister.bind(this)}>注册</button>
      </div>
    )
  } 
}

Register.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    isPosted: state.register.isPosted,
    error: state.register.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    registerActions: bindActionCreators(register, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)