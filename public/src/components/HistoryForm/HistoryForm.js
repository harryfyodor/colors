import React, { Component, PropTypes } from 'react'
import style from './style.css'

export default class HistoryForm extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {
      events: this.props.events.events || {},
      month: this.props.month || 0,
      year: this.props.year || 0,
      got: false
    }
  }

  static propTypes = {
    events: PropTypes.object.isRequired,
    month: PropTypes.string.isRequired,
    year: PropTypes.string.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.month !== this.state.month || nextProps.year !== this.state.year) {
      return true
    }
    if(this.state.got) {
      return false
    }
    return true
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.events.events) return
    let evts = nextProps.events.events
    evts.sort((a, b) => {
      if(a.date > b.date) return -1
      if(a.date < b.date) return 1
      return 0
    })
    // if(nextProps.month === this.state.month && nextProps.year === this.state.year) return
    this.setState({
      events: evts,
      month: nextProps.month,
      year: nextProps.year,
      got: true
    })
  }

  render() {
    let evts = [ ...this.state.events ]
    let f = this.state.year + "-" + this.state.month
    let data = evts.filter(function(e) {
      if(e.date.indexOf(f) !== -1) {
        return true
      }
    })
    console.log(data)
    return (
      <div>
        <h2>表格</h2>
        <div className="colorForm">
          <ul>
            {data.map((e, i)=>{
              return  <li key={i}>
                <h3>{e.date}</h3>
                <time>{e.time}</time>
                <p>时长:{e.period}min</p>
                <ul>
                  {e.tags.map((t, j) => {
                    return <li key={j}>{t}</li>
                  })}
                </ul>
                <div>
                  <p>{e.detail}</p>
                </div>
              </li>
            })}
          </ul>
        </div>
      </div>
    )
  } 
}