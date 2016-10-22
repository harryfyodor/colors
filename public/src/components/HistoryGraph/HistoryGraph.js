import React, { Component, PropTypes } from 'react'
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

const data = [
      {name: 'Page A', pv: 2400, amt: 2400},
      {name: 'Page B', pv: 1398, amt: 2210},
      {name: 'Page C', pv: 9800, amt: 2290},
      {name: 'Page D', pv: 3908, amt: 2000},
      {name: 'Page E', pv: 4800, amt: 2181},
      {name: 'Page F', pv: 3800, amt: 2500},
      {name: 'Page G', pv: 4300, amt: 2100},
];

export default class HistoryGraph extends Component {
  constructor(props) {
    super(props)
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
    // 不会因为背景颜色变化而setState
    if(nextProps.month !== this.state.month || nextProps.year !== this.state.year) {
      return true
    }
    if(this.state.got) {
      return false
    }
    return true
  }

  componentWillReceiveProps(nextProps) {
    // if(nextProps.month === this.state.month && nextProps.year === this.state.year) return
    this.setState({
      events: nextProps.events.events,
      month: nextProps.month,
      year: nextProps.year,
      got: true
    })
  }

  aggregate(arr) {
    if(arr.length === 0) return []

    let data = [{
      Date: arr[0].date.slice(-2),
      Period:arr[0].period
    }]

    let index = 0,
        dString = ""
    for(let i = 1; i < arr.length; i++) {
      dString = arr[i].date.slice(-2)
      if(data[index].Date !== dString) {
        data.push({
          Date: dString,
          Period: arr[i].period
        })
        index += 1
      }
      data[index].Period += arr[i].period
    }

    data = data.map((d, i) => {
      return {
        Date: d.Date + "日",
        "时长": d.Period
      }
    })

    data.sort((a, b) => {
      if(a.Date > b.Date) return 1
      if(a.Date < b.Date) return -1
      return 0
    })

    return data
  }

  render() {
    let evts = [ ...this.state.events ]
    let filter = this.state.year + "-" + this.state.month
    let data = evts.filter(function(e) {
      if(e.date.indexOf(filter) !== -1) {
        return true
      }
    })
    data = this.aggregate(data)
    return (
      <div>
        <h2>柱状图</h2>
        <BarChart width={750} height={300} data={data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
         <XAxis dataKey="Date"/>
         <YAxis/>
         <CartesianGrid strokeDasharray="3 3"/>
         <Tooltip/>
         <Legend />
         <Bar dataKey="时长" fill={this.props.color} />
        </BarChart>
      </div>
    )
  } 
}