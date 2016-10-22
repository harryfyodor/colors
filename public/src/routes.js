import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'
import App from './containers/App/App'
import Home from './containers/Home/Home'
// import History from './containers/History/History'
import Header from './containers/Header/Header'
// import ForgetPw from './containers/ForgetPw/ForgetPw'
// import Preparation from './containers/Preparation/Preparation'
// import CountDown from './containers/CountDown/CountDown'
// import Collection from './containers/Collection/Collection'
// import RankingList from './containers/RankingList/RankingList'
// import Settings from './containers/Settings/Settings'
// import Activate from './containers/Activate/Activate'
// import Login from './containers/Login/Login'
// import Register from './containers/Register/Register'

// import About from './components/About/About'
import Begin from './components/Begin/Begin'
import Footer from './components/Footer/Footer'
import NotFound from './components/NotFound/NotFound'


// code split 动态加载模块，减小首屏加载时间
const routes = {
  component: App,
  indexRoute: { component: Footer} ,
  childRoutes: [
    {path:'register', getComponent(location, cb) {
      require.ensure([], (require) => {
        cb(null, require('./containers/Register/Register'))
      });
    }},
    {path:'forgetpw', getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./containers/ForgetPw/ForgetPw'))
      })
    }},
    {path:'login', getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./containers/Login/Login'))
      })
    }},
    {path:'activate/:name/:hash', getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./containers/Activate/Activate'))
      })
    }},
    {
      path:'home', 
      component:Home,
      indexRoute: { component: Begin },
      childRoutes: [
        {path:'/settings', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/Settings/Settings'))
          })
        }},
        {path:'/collection', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/Collection/Collection'))
          })
        }},
        {path:'/history', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/History/History'))
          })
        }},
        {path:'/countdown', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/CountDown/CountDown'))
          })
        }},
        {path:'/rank', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/RankingList/RankingList'))
          })
        }},
        {path:'/about', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./components/About/About'))
          })
        }},
        {path:'/prepare', getComponent(nextState, cb) {
          require.ensure([], (require) => {
            cb(null, require('./containers/Preparation/Preparation'))
          })
        }}
      ]
    },
    {path:'/', getComponent(nextState, cb) {
      require.ensure([], (require) => {
        cb(null, require('./containers/Login/Login'))
      })
    }},
    {path:'*', component: NotFound}
  ]
}

/*
const routess = (
  <Route component={App}>
    <IndexRoute component={Footer}/>
    <Route path="/login" component={Login}/>
    <Route path="/register" component={Register}/>
    <Route path="/forgetpw" component={ForgetPw} />
    <Route path="/activate/:name/:hash" component={Activate} />
    <Route path="/home" component={Home}>
      <IndexRoute component={Begin}/>
      <Route path="/settings" component={Settings}/>
      <Route path="/collection" component={Collection}/>
      <Route path="/history" component={History}/>
      <Route path="/countdown" component={CountDown}/>
      <Route path="/rank" component={RankingList}/>
      <Route path="/about" component={About}/>
      <Route path="/prepare" component={Preparation}/>
      <Redirect from="/" to="/login" />
    </Route>
    <Route path="*" component={NotFound} />
  </Route>
)
*/

export default routes