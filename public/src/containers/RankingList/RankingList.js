import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import style from './style.css'
import { rank } from '../../actions'
import cx from 'react-classset'

class RankingList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      isPosted: false
    }
  }

  static propTypes = {
    isPosted: PropTypes.bool.isRequired,
    list: PropTypes.object.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 不会因为背景颜色变化而setState
    if(!this.state.isPosted) {
      return true
    }
    return false
  }

  componentDidMount() {
    this.props.rankActions.request()
  }

  componentWillReceiveProps(nextProps) {
    if(!nextProps.list.list) return
    this.setState({
      list: nextProps.list.list,
      isPosted: true
    })
  }

  render() {
    const classSets = cx({
      "colorSquare": true,
      "rank": true
    })
    /*
    let data = [
      {_id:"harry",total:1200},
      {_id:"fyodor",total:5000}
    ]
    */
    let data = [ ...this.state.list ]
    data = data.sort((a, b) => {
      if(a.total > b.total) return -1
      if(a.total < b.total) return 1
      return 0 
    })
    console.log(data)
    return (
      <div className={classSets}>
        <h1>排行榜</h1>
        <div>
          <ul>
            <li className="rankTd">
              <span>名次</span>
              <span>名字</span>
              <span>时间</span>
            </li>
            {data.map((d, i) => {
              return <li key={i} className="rankLi">
                <span>{i + 1}</span>
                <span>{d._id}</span>
                <div title={`${d.total}min/60000min`}>
                  <div style={{backgroundColor:this.props.color, width:d.total*100/60000 + "%"}}></div>
                </div>
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
    isPosted: state.rank.isPosted,
    list: state.rank.res
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    rankActions: bindActionCreators(rank, dispatch)
  }
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(RankingList)