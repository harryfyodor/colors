import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
import { set } from '../../actions'
import cx from 'react-classset'

class Settings extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      name: "",
      oldPw: "",
      newPw: "",
      newPwRe: "",
      msg: "",
      nameEnable: true,
      pwEnable: true
    }
  }

  static propTypes = {
    isPosted: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 只有以下情况才能setState成功
    if(nextState.nameEnable !== this.state.nameEnable || 
       nextState.pwEnable !== this.state.pwEnable ||
       nextState.name !== this.state.name ||
       nextState.oldPw !== this.state.oldPw ||
       nextState.newPw !== this.state.newPw ||
       nextState.newPwRe !== this.state.newPwRe ||
       (nextState.msg && nextState.msg !== this.state.msg)) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isPosted) {
      this.setState({
        msg: "修改成功"
      })
      return
    }
    if(nextProps.error === "Unauthorize") {
      this.context.router.push('/login')
    } else if(nextProps.error) {
      this.setState({
        msg: nextProps.error
      })
    }
  }

  onNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  onPwChange(e) {
    if(true/*13*/) {
      this.setState({
        oldPw: e.target.value
      })
    }
  }

  onNewPwChange(e) {
    if(true/*13*/) {
      this.setState({
        newPw: e.target.value
      })
    }
  }

  onNewPwReChange(e) {
    if(true/*13*/) {
      if(this.state.newPw !== e.target.value) {
        this.setState({
          newPwRe: e.target.value,
          msg: "两次密码输入要一致哦！"
        })
      } else {
        this.setState({
          newPwRe: e.target.value,
          msg: "密码一致"
        })
      }
    }
  }

  onEnableChangeName() {
    this.setState({
      nameEnable: !this.state.nameEnable
    })
  }

  onEnableChangePw() {
    this.setState({
      pwEnable: !this.state.pwEnable
    })
  }

  onChangePw(e) {
    if(this.validatePw()) {
      this.props.setActions.request({
        newPw: this.state.newPw.trim(),
        oldPw: this.state.oldPw.trim(),
        name: ""
      })
    }
  }

  onChangeName(e) {
    if(this.validateName()) {
      this.props.setActions.request({
        newPw: "",
        oldPw: "",
        name: this.state.name.trim()
      })
    }
  }

  validateName() {
    const nameRe = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
    if(!nameRe.test(this.state.name)) {
      this.setState({
        msg: "用户名应只有数字、字母、中文以及下划线。"
      })
      return false
    } else if (this.state.name.length > 20) {
      this.setState({
        msg: "用户名字符数要低于20个。"
      })
      return false
    }
    return true
  }

  validatePw() {
    if(this.state.newPw.trim() !== this.state.newPwRe.trim()) {
      this.setState({
        msg: "新密码两次不一致。"
      })
      return false
    } else if (this.state.newPw.length > 15) {
      this.setState({
        msg: "密码字符数要低于15个。"
      })
      return false
    }
    return true
  }

  render() {
    const classSets = cx({
      "colorSquare": true,
      "settings": true
    })
    console.log("I am the same!")
    return (
      <div className={classSets}>
        <h1>Colors</h1>
        <div className="msg">{this.state.msg}</div>
        <input type="text" 
               value={this.state.name} 
               onChange={this.onNameChange.bind(this)} 
               disabled={this.state.nameEnable}
               placeholder="新用户名" />
        <div>
          {this.state.nameEnable?"":
            <button onClick={this.onChangeName.bind(this)}>
              确认修改
            </button>
          }
          <button onClick={this.onEnableChangeName.bind(this)}>
            {this.state.nameEnable?"修改名字":"不改了"}
          </button>
        </div>
        <input type="password" 
               onChange={this.onPwChange.bind(this)} 
               ref="oldPw" 
               disabled={this.state.pwEnable}
               placeholder="密码" />
        <input type="password" 
               onChange={this.onNewPwChange.bind(this)} 
               ref="newPw" 
               disabled={this.state.pwEnable}
               placeholder="新密码" />
        <input type="password" 
               onChange={this.onNewPwReChange.bind(this)} 
               ref="newPwRe" 
               disabled={this.state.pwEnable}
               placeholder="重复新密码" />
        <div>
          {this.state.pwEnable?"":
            <button onClick={this.onChangePw.bind(this)}>
              确认修改
            </button>
          }
          <button onClick={this.onEnableChangePw.bind(this)}>
            {this.state.pwEnable?"修改密码":"不改了"}
          </button>
        </div>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isPosted: state.set.isPosted,
    error: state.set.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setActions: bindActionCreators(set, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)