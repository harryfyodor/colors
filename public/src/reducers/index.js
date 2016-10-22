import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { LOGIN, REGISTER, ACTIVATE, LOGOUT, FORGET, RANK, DEGREE,
         SET, TAGS, BEGIN, CANCEL, EVENTS, EDIT, FINISH } from '../actions'

const login = (state = {
  isLogging: false,
  isLogged: false,
  error: "",
  name: ""
}, actions) => {
  switch(actions.type) {
    case LOGIN.REQUEST:
        return Object.assign({}, state, {
          email: actions.email,
          password: actions.password,
          autoLogin: actions.autoLogin,
          isLogging: true,
          isLogged: false
        })
    case LOGIN.SUCCESS:
        return Object.assign({}, state, {
          name: actions.name,
          isLogging: false,
          isLogged: true
        })
    case LOGIN.FAILURE:
        return Object.assign({}, state, {
          error: actions.error,
          isLogging: false,
          isLogged: false
        })
    case LOGOUT.REQUEST: 
        return Object.assign({}, state, {
          isLogged: false
        })
    case LOGOUT.FAILURE:
        return Object.assign({}, state, {
          error: actions.error
        })
    default: 
        return Object.assign({}, state, {})
  }
}

const reducerGenerator = (type, rq=[] , rs=[], initialState={}) => {
  
  return function(state=Object.assign(initialState, {isPosted: false, error: "", res:{}}), actions) {
    switch(actions.type) {
      case type.REQUEST:
        let request = {}
        rq.forEach(function(r) {
          request[r] = actions[r]
        })
        return Object.assign({}, state, request, {
          isPosting: true,
          isPosted: false
        })
      case type.SUCCESS:
        let response = {}
        rs.forEach(function(r) {
          response[r] = actions[r]
        })
        return Object.assign({}, state, response, {
          isPosting: false,
          isPosted: true
        })
      case type.FAILURE:
        return Object.assign({}, state, {
          error: actions.error,
          isPosted: false,
          isPosting: true
        })
      default:
        return Object.assign({}, state)
    }
  }
}

const forget = reducerGenerator(FORGET, ["pw", "email"])

const activate = reducerGenerator(ACTIVATE, ["name", "hash"])

const register = reducerGenerator(REGISTER, ["password", "email"])

const set = reducerGenerator(SET, ["oldPw", "newPw", "name"])

const tags = reducerGenerator(TAGS, [], ["res"])

const begin = reducerGenerator(BEGIN, [], ["res"])

const finish = reducerGenerator(FINISH, ["tags", "detail", "period"])

const cancel = reducerGenerator(CANCEL)

const events = reducerGenerator(EVENTS, [], ["res"])

const edit = reducerGenerator(EDIT, ["pastEvent", "newEvent"])

const rank = reducerGenerator(RANK, [], ["res"])

const degree = reducerGenerator(DEGREE, [], ["res"])

const count = (state={}, action) => {
  if(action.type === "COUNT") {
    return Object.assign({}, {
      tags: action.tags,
      detail: action.detail,
      period: action.period
    })
  } else {
    return Object.assign({}, state)
  }
}

const rootReducer = combineReducers({
  login,
  register,
  activate,
  forget,
  routing,
  set,
  tags,
  begin,
  finish,
  cancel,
  events,
  edit,
  count,
  rank,
  degree
})

export default rootReducer