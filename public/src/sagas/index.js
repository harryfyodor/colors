require("babel-polyfill");

import { take, put, call, fork, select } from 'redux-saga/effects'
import * as Api from '../middleware/index'

import { login, register, activate, logout, forget, set, 
         tags, begin, finish, cancel, events, edit, rank, degree } from '../actions/index'

// entity
// apiFn
// requireItem
// url
let fetchItem = function* (entity, apiFn, type, requireItem={}) {
  // let response, error
  if(type === "POST") {
      yield put( entity.request(requireItem) )
      var {response, error} = yield call(apiFn, requireItem)
  } else if (type === "GET") {
      yield put( entity.request() )
      var {response, error} = yield call(apiFn)
  }
  if(response && !response.errorMsg) {
    yield put( entity.success(response) )
  } else if(response.errorMsg) {
    yield put( entity.failure(response.errorMsg) )
  } else {
    yield put( entity.failure(error) )
  }
}

// 封装好一组异步generator ajax.
export const loginUser = fetchItem.bind(null, login, Api.loginUser, "POST")
export const registerUser = fetchItem.bind(null, register, Api.registerUser, "POST")
export const activateUser = fetchItem.bind(null, activate, Api.activateUser, "POST")
export const logoutUser = fetchItem.bind(null, logout, Api.logoutUser, "POST")
export const forgetPw = fetchItem.bind(null, forget, Api.forgetPw, "POST")

export const setting = fetchItem.bind(null, set, Api.setting, "POST")
export const fetchTags = fetchItem.bind(null, tags, Api.fetchTags, "GET")
export const beginCount = fetchItem.bind(null, begin, Api.beginCount, "GET") 
export const finishCount = fetchItem.bind(null, finish, Api.finishCount, "POST")
export const cancelCount = fetchItem.bind(null, cancel, Api.cancelCount, "GET")
export const fetchEvents = fetchItem.bind(null, events, Api.fetchEvents, "GET")
export const editEvent = fetchItem.bind(null, edit, Api.editEvent, "POST")

export const ranking = fetchItem.bind(null, rank, Api.ranking, "GET")
export const getDegree = fetchItem.bind(null, degree, Api.getDegree, "GET")

// generator 中间件本体
let loginFlow = function*() {
  while(true) {
    const loginInfo = yield take('LOGIN_REQUEST')
    const { email, password, autoLogin } = loginInfo
    yield fork(loginUser, { email, password, autoLogin })
    yield take(['LOGOUT_REQUEST', 'LOGIN_FAILURE'])
    // yield call(Api.clearCookie())
  }
}

const postFlow = (type, payload, func) => {
  return function*() {
    while(true) {
      const info = yield take(type + "_REQUEST")
      let input = {}
      payload.forEach(function(p) {
        input[p] = info[p]
      })
      console.log(input)
      yield call(func, input)
    }
  }
}

const getFlow = (type, func) => {
  return function*() {
    while(true) {
      yield take(type + '_REQUEST')
      yield call(func)
    }
  }
}

let registerFlow = function*() {
  while(true) {
    const registerInfo = yield take('REGISTER_REQUEST')
    const { email, password, name } = registerInfo
    yield call(registerUser, {email, password, name})
  }
}

let activateFlow = function*() {
  while(true) {
    const activateInfo = yield take('ACTIVATE_REQUEST')
    const { hash, name } = activateInfo
    yield call(activateUser, { hash, name })
  }
}

let logoutFlow = function*() {
  while(true) {
    yield take('LOGOUT_REQUEST')
    yield call(logoutUser)
  }
}

let forgetFlow = function*() {
  while(true) {
    const info = yield take('FORGET_REQUEST')
    const { email, pw } = info
    yield call(forgetPw, {email, pw}) 
  }
}

let setFlow = postFlow("SET", ["newPw", "oldPw", "name"], setting)

let tagsFlow = getFlow("TAGS", fetchTags)

let beginFlow = getFlow("BEGIN", beginCount)

let cancelFlow = getFlow("CANCEL", cancelCount) 

let eventsFlow = getFlow("EVENTS", fetchEvents)

let editFlow = postFlow("EDIT", ["pastEvent", "newEvent"], editEvent)

let finishFlow = postFlow("FINISH", ["detail", "tags", "period"], finishCount)

let rankFlow = getFlow("RANK", ranking)

let degreeFlow = getFlow("DEGREE", getDegree)

let root = function*() {
  yield [
    fork(loginFlow),
    fork(activateFlow),
    fork(registerFlow),
    fork(logoutFlow),
    fork(forgetFlow),
    fork(setFlow),
    fork(tagsFlow),
    fork(beginFlow),
    fork(cancelFlow),
    fork(eventsFlow),
    fork(editFlow),
    fork(finishFlow),
    fork(rankFlow),
    fork(degreeFlow)
  ]
}

export default root;