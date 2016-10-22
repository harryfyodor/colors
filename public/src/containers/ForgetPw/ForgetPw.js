import React, { Component, PropTypes } from 'react'
import style from './style.css'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions'
import cx from 'react-classset'

let timer

class ChangePw extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: "",
      email: "",
      pw: "",
      pw2: "",
      isPosted: false
    }
  }

  static propTypes = {
    isPosted: PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.state.isPosted) return true
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isPosted) {
      this.setState({
        msg: "更换密码成功！请点开邮箱确认！",
        isPosted: true
      })
    }
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    })
  }

  onChangePw(e) {
    this.setState({
      pw: e.target.value
    })
  }

  onChangePw2(e) {
    this.setState({
      pw2: e.target.value
    })
  }

  onSend() {
    if(this.validate()) {
      this.props.actions.request({email:this.state.email, pw:this.state.pw})
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
    } else if (this.state.pw !== this.state.pw2) {
      this.setState({
        msg: "两次密码输入不一致！"
      })
      return false
    }
    return true
  }

  render() {
    const classSets = cx({
      "colorSquare": true,
      "register": true,
      "forget": true
    })
    return (
      <div className={classSets}>
        <h1>Colors</h1>
        <p>通过邮箱找回账户</p>
        <span className="msg">{this.state.msg}</span>
        <div>
          <label>邮箱</label>
          <input type="email" onChange={this.onChangeEmail.bind(this)}/>
        </div>
        <div>
          <label>新密码</label>
          <input type="password" onChange={this.onChangePw.bind(this)}/>
        </div>
        <div>
          <label>重复密码</label>
          <input type="password" onChange={this.onChangePw2.bind(this)}/>
        </div>
        <button onClick={this.onSend.bind(this)}>发送邮件</button>       
      </div>
    )
  } 
}


const mapStateToProps = (state) => {
  return {
    isPosted: state.forget.isPosted
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(actions.forget, dispatch)
  }
}


module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePw)