import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
import { events } from '../../actions'

import Form from '../../components/HistoryForm/HistoryForm'
import Graph from '../../components/HistoryGraph/HistoryGraph'

class History extends Component {
  constructor(props, context) {
    super(props, context)

    let today = new Date(),
        month = (today.getMonth() + 1).toString(),
        year = (today.getFullYear()).toString()

    month = month.length === 1 ? "0" + month : month

    console.log(year, month)

    this.state = {
      events: {},
      type: "form",
      month: month,
      year: year,
      isPosted: false
    }
  }

  static propTypes = {
    isPosted: PropTypes.bool.isRequired,
    events: PropTypes.object.isRequired,
    error: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    // 默认为当前的月份
    this.refs.month.value = this.state.month
    // 默认为当前的年份
    this.refs.year.value = this.state.year
    this.props.eventsActions.request() 
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 不会因为背景颜色变化而setState
    // 改变type
    if(nextProps.month !== this.state.month || nextProps.year !== this.state.year) {
      return true
    }
    if(nextState.type !== this.state.type) {
      return true
    }
    if(!this.state.isPosted) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.error === "Unauthorize") {
      this.context.router.push('/login')
    }

    if(nextProps.isPosted) {
      this.setState({
        events: nextProps.events,
        isPosted: true
      })
    }
  }

  onChangeType(e) {
    if(e.target.value === "form") {
      this.setState({type:"form"})
    } else if(e.target.value === "bar") {
      this.setState({type:"bar"})
    }
  }

  onChangeMonth(e) {
    this.setState({
      month: e.target.value
    })
  }

  onChangeYear(e) {
    this.setState({
      year: e.target.value
    })
  }

  render() {
    const { type } = this.state
    return (
      <div className="history">
        <h1>历史记录</h1>
        <form>
          <label>类型</label>
          <select onChange={this.onChangeType.bind(this)}>
            <option value="form">表格</option>
            <option value="bar">柱状图</option>
          </select>
          <label>年份</label>
          <select onChange={this.onChangeYear.bind(this)} ref="year">
            <option value="2016">2016</option>
            <option value="2017">2017</option>
            <option value="2018">2018</option>
          </select>
          <label>月份</label>
          <select onChange={this.onChangeMonth.bind(this)} ref="month">
            <option value="01">一月</option>
            <option value="02">二月</option>
            <option value="03">三月</option>
            <option value="04">四月</option>
            <option value="05">五月</option>
            <option value="06">六月</option>
            <option value="07">七月</option>
            <option value="08">八月</option>
            <option value="09">九月</option>
            <option value="10">十月</option>
            <option value="11">十一月</option>
            <option value="12">十二月</option>
          </select>
        </form>
        <div>
          { type === "form" ? 
            <Form events={this.state.events} month={this.state.month} year={this.state.year}/>
            :<Graph color={this.props.color} events={this.state.events} month={this.state.month} year={this.state.year}/>}
        </div>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isPosted: state.events.isPosted,
    events: state.events.res,
    error: state.events.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    eventsActions: bindActionCreators(events, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(History)