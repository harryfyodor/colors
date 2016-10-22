import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
import { finish, cancel } from '../../actions'
import Slider from 'rc-slider'
import indexCss from 'rc-slider/assets/index.css'

const timeFormatter = (v) => {
  return `${v} min`
}

let timer = null

class CountDown extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      tags: this.props.tags || [],
      detail: this.props.detail || "" ,
      minutes: this.props.period || 0,
      seconds: 0,
      period: this.props.period || 0,
      finishCount: false,
      truePeriod: this.props.period || 0
    }
  }

  static propTypes = {
    tags: PropTypes.array.isRequired,
    detail: PropTypes.string.isRequired,
    period: PropTypes.number.isRequired,
    finish: PropTypes.shape({
      isPosted: PropTypes.bool.isRequired,
      error: PropTypes.string.isRequired
    }),
    cancel: PropTypes.shape({
      isPosted: PropTypes.bool.isRequired,
      error: PropTypes.string.isRequired
    })
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    this.beginCount()
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.error === "Unauthorize") {
      this.context.router.push('/login')
    }
  }

  componentWillUnmount() {
    clearTimeout(timer)
  }

  onFinishHandler(e) {
    e.target.disabled = "disabled"
    if(this.validate()) {
      this.props.finishActions.request({
        tags: this.state.tags,
        detail: this.state.detail,
        period: this.state.truePeriod
      })
      this.context.router.push('/home')
    }
  }

  onGiveupHandler(e) {
    e.target.disabled = "disabled"
    this.props.cancelActions.request()
    this.context.router.push('/home')
  }

  validate() {
    return true
  }

  beginCount() {
    const that = this
    timer = setTimeout(function(){
      that.recursiveCount(that)
    }, 100)
  }

  recursiveCount(that) {
    //console.log(this.state, this.recursiveCount)
    if(that.state.minutes > 0 && that.state.seconds === 0) {
      that.setState({
        minutes: that.state.minutes - 1,
        seconds: 59
      })
      that.beginCount()
    } else if (that.state.seconds > 0) {
      that.setState({
        seconds: that.state.seconds - 1
      })
      that.beginCount()
    } else if(that.state.seconds === 0 && that.state.minutes === 0) {
      that.setState({
        finishCount: true
      })
    }
  }

  onChangePeriod(value) {
    this.setState({
      truePeriod: value
    })
  }

  render() {
    return (
      <div className="countdown">
        <h1>{this.state.minutes}:{this.state.seconds >= 10 ? this.state.seconds: "0" + this.state.seconds}</h1>
        <div>
          {this.state.finishCount ? 
            <div>
              <button onClick={this.onGiveupHandler.bind(this)}>放弃</button> 
              <button onClick={this.onFinishHandler.bind(this)}>完成</button>
              <label>实际时长：</label>
              <Slider tipFormatter={timeFormatter}
                defaultValue={this.state.truePeriod}
                tipTransitionName="rc-slider-tooltip-zoom-down" min={1} max={this.state.period} 
                onChange={this.onChangePeriod.bind(this)}/>
            </div>
            : <button onClick={this.onGiveupHandler.bind(this)}>放弃</button> 
          }    
        </div>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    tags: state.count.tags,
    detail: state.count.detail,
    period: state.count.period,
    finish: {
      isPosted: state.finish.isPosted,
      error: state.finish.error
    },
    cancel: {
      isPosted: state.cancel.isPosted,
      error: state.cancel.error
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    finishActions: bindActionCreators(finish, dispatch),
    cancelActions: bindActionCreators(cancel, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(CountDown)