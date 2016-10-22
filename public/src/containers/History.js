import { Component } from 'react'

class History extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <div>
          <select name="" id="">
            <option value="bar"></option>
            <option value="form"></option>
          </select>
          <select name="" id="">
            <option value="year">年份</option>
          </select>
          <select name="" id="">
            <option value="month">月份</option>
          </select>
        </div>
        <div>柱状图或者表格</div>
      </div>
    )
  } 
}