import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
import { begin, count, tags } from '../../actions'
import Slider from 'rc-slider'

import indexCss from 'rc-slider/assets/index.css'
// todo

const notInArray = (array, item) => {
  for(let i = 0; i < array.length; i++)
    if(item === array[i]) return false
  return true
}

const findIndex = (array, item) => {
  for(let i = 0; i < array.length; i++)
    if(item === array[i]) return i
  return -1
}

const timeFormatter = (v) => {
  return `${v} min`
}

class Preparation extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tags: [],
      detail: "",
      period: 1,
      defaultTags: [],
      gotTags: false,
      msg: ""
    }
  }

  static propTypes = {
    isPosted: PropTypes.bool.isRequired,
    gotTags: PropTypes.bool.isRequired,
    tags: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.tagsActions.request() 
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.error === "Unauthorize") {
      this.context.router.push('/login')
    }
    if(!this.state.gotTags && nextProps.gotTags) {
      this.setState({
        defaultTags: nextProps.tags.tags,
        gotTags: true
      })
    }
    if(nextProps.isPosted) {
      console.log("ACTION", this.state)
      this.props.countAction(this.state.tags, this.state.detail, this.state.period)
      // this.props.history.push('/countdown')
      this.context.router.push('/countdown')
    }
  }

  onClickHandler() {
    if(this.validate()) {
      this.props.beginActions.request()
    }
  }
  
  onRepeat(e) {
    let tags = [...this.state.tags]
    let newTag = e.target.innerHTML
    if(notInArray(tags, newTag) && tags.length < 5) {
      tags.push(newTag)
      this.setState({
        tags: tags,
        msg: ""
      })
    } else if(tags.length >= 5) {
      this.setState({
        msg: "标签不能多于五个！"
      })
    }
  }

  onDelete(e) {
    let tags = [...this.state.tags]
    const item = e.target.innerHTML
    const index = findIndex(tags, item)
    tags.splice(index, 1)
    this.setState({
      tags: tags
    })
  }

  onAddTags() {
    const newTag = this.refs.tags.value.trim()
    let tags = [...this.state.tags]
    if(notInArray(tags, newTag) && newTag.trim() && tags.length < 5) {
      tags.push(newTag.trim())
      this.refs.tags.value = ""
      this.setState({
        tags: tags,
        msg: ""
      })
    } else if(tags.length >= 5) {
      this.setState({
        msg: "标签不能多于五个！"
      })
    }
  }

  onEnterHandler(e) {
    if(e.which === 13) {
      this.onAddTags()   
    }
  }

  onChangePeriod(value) {
    this.setState({
      period: parseInt(value, 10)
    })
  }

  onDetailHandler(e) {
    this.setState({
      detail: e.target.value
    })
  }

  validate() {
    if(this.state.tags === []) {
      this.setState({
        msg: "请添加标签！"
      })
      return false
    } else if (this.state.detail === "") {
      this.setState({
        msg: "请添加详细信息！"
      })
      return false
    }
    return true
  }

  render() {
    const { defaultTags, tags } = this.state
    return (
      <div className="preparation">
        <h1>记录</h1>
        <div className="msg">{this.state.msg}</div>
        <div className="addtags">
          <label>标签：</label>
          <div>
            <input ref="tags" onKeyDown={this.onEnterHandler.bind(this)}/>
            <button onClick={this.onAddTags.bind(this)}>添加</button>
          </div>
          <ul>
            <label>已选择：</label>
            {tags.length === 0 ? "(空)" : tags.map((t, i) => {
              return <li key={i} onClick={this.onDelete.bind(this)}>{t}</li>
            })}
          </ul>   
          <ul>
            <label>可选择：</label>
            {defaultTags.length === 0 ? "(空)" : defaultTags.map((t, i) => {
              return <li key={i} onClick={this.onRepeat.bind(this)}>{t}</li>
            })} 
          </ul>
        </div>
        <div>
          <label>详细信息：</label>
          <textarea onChange={this.onDetailHandler.bind(this)}></textarea>
        </div>
        <div className="slider">
          <label>时长选择：</label>
          <Slider tipFormatter={timeFormatter}
            tipTransitionName="rc-slider-tooltip-zoom-down" min={1} max={150} 
            onChange={this.onChangePeriod.bind(this)}/>
        </div>
        <button onClick={this.onClickHandler.bind(this)}>确认</button>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isPosted: state.begin.isPosted,
    gotTags: state.tags.isPosted,
    tags: state.tags.res
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    beginActions: bindActionCreators(begin, dispatch),
    countAction: bindActionCreators(count, dispatch),
    tagsActions: bindActionCreators(tags, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Preparation)