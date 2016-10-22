import React, { Component } from 'react'
import style from './style.css'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { finish, cancel } from '../../actions'

let timer // 作为定时器，注意消息五分钟后消失
let color = ""

export default class Begin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msg: "",
      disappeared: false
    }
  }

  onClickHandler() {
    this.props.history.push('/prepare')
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 颜色变化不会触发setState
    // 如果两个都是空字符串，则不需要改变
    if(nextState.msg === "" && this.state.msg === "") {
      return false
    }

    if(!this.state.disappeared || nextState.msg === "") { 
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {

    if(!timer) {
      timer = setTimeout(() => {
        this.setState({
          msg: ""
        })
      }, 5000);
    }

    if(nextProps.finish.error) {
      this.setState({
        msg: nextProps.finish.error,
        disappeared: true
      })
    } else if(nextProps.cancel.error) {
      this.setState({
        msg: nextProps.cancel.error,
        disappeared: true
      })
    } else if(nextProps.finish.isPosted) {
      this.setState({
        msg: "你本次的事件已经被记录了下来！",
        disappeared: true
      })
    } else if(nextProps.cancel.isPosted) {
      this.setState({
        msg: "取消成功！",
        disappeared: true
      })
    }
  }

  componentWillUnmount() {
    if(timer) {
      clearTimeout(timer);
    }
  }

  render() {
    return (
      <div className="begin">
        <h1>Colors</h1>
        <div className="msg">{this.state.msg}</div>
        <p>这是一个记录工具，可以用于记录每天的做的事以及做的时间。1000小时的坚持和专注可以让你成为某一领域的能手。有时候我们需要的只是冷静和坚持。</p>
        <ol>
          <li>点击开始，填写标签，内容简介，设置时间。</li>
          <li>完成之后，选择真实时间，点击确定。</li>
          <li>用户菜单下，点击历史，查看过去的记录。</li>
          <li>用户菜单下，点击颜色，查看1000小时的完成情况。</li>
          <li>争取收集到所有250种颜色。</li>
        </ol>
        <button><Link href="/prepare">开始</Link></button>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    finish: {
      error: state.finish.error,
      isPosted: state.finish.isPosted
    },
    cancel: {
      error: state.cancel.error,
      isPosted: state.cancel.isPosted
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Begin)