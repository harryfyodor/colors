import React, { Component } from 'react'
import style from './style.css'

class About extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="begin">
        <h1>关于</h1>
        <p>有关这个小网站的详细信息可以查看<a href="https://github.com/harryfyodor/colors" target="_blank">Github Repo</a>。在里面会详细介绍相关的技术。</p>
        <p>相关灵感来源于<a href="http://nipponcolors.com/" target="_blank">代表日本的250种颜色</a>以及1000小时理论（一万小时定律精简版）。</p>
        <h4>Todos！还要做怎样的改进呢？</h4>
        <ol>
          <li>用Semantic-UI优化UI。</li>
          <li>在历史里面添加更多的图表样式。</li>
          <li>增加历史里面的编辑功能。</li>
          <li>增加历史里面的标签选择功能。</li>
          <li>用户的事件允许用markdown格式。</li>
          <li>完善用户体系，增加用户头像，用户自我描述等等。</li>
          <li>根据用户当前的等级允许用户选择不同的UI。</li>
          <li>找到bug，debug & debug & debug!</li>
          <li>完善测试！（刚开始接触...）</li>
        </ol>
      </div>
    )
  } 
}

module.exports = About