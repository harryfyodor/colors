import React, { Component, PropTypes } from 'react'
import style from './style.css'
import cx from 'react-classset'
var json = require("json!../../colors.json")

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { degree } from '../../actions'

class Collection extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      period: 0,
      isFetched: false
    }
  }

  static propTypes = {
    isFetched: PropTypes.bool.isRequired,
    error: PropTypes.string.isRequired,
    mins: PropTypes.object.isRequired
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    this.props.degreeActions.request()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(!this.state.isFetched) {
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.error === "Unauthorize") {
      this.context.router.push('/login')
    }

    if(nextProps.isFetched) {
      this.setState({
        period: nextProps.mins.degree,
        isFetched: true
      })
    }
  }

  render() {
    let p = 0
    if(this.state.period >= 60000) {
      p = 60000
    } else {
      p = this.state.period
    }
    let degree = Math.floor(p/240)
    const exp = p%240
    const cards = json.slice(0, degree)    
    let i = degree === 250 ? 0 : degree + 1 

    const len = {
      width: exp*100/240 + '%',
      backgroundColor: "#" + json[i].rgb
    }

    const classSet = cx({
      "colorSquare": true,
      "collection": true
    })

    return (
      <div className={classSet}>
        <h1>颜色</h1>
        <div className="exp">
          <div>
            <div style={len}>{exp}min/240min</div>
          </div>
        </div>
        <div className="cards">
          <ul>
            {cards.map((c, i)=>{
              return <li key={i} style={{backgroundColor:'#'+c.rgb}}>
                <h3>{c.zh}</h3>
                <span>{c.en}</span>
                <span>#{c.rgb}</span>
              </li>
            })}
          </ul>
        </div>
      </div>
    )
  } 
}

const mapStateToProps = (state) => {
  return {
    isFetched: state.degree.isPosted,
    error: state.degree.error,
    mins: state.degree.res
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    degreeActions: bindActionCreators(degree, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Collection)