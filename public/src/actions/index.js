const REQUEST = 'REQUEST'
const SUCCESS = 'SUCCESS'
const FAILURE = 'FAILURE'

// MDN关于reduce的用法介绍
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
const createRequest = (base) => {
  return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
      acc[type] = `${base}_${type}`
      return acc
    }, {})
}

const action = (type, payload) => {
  return {type, ...payload}
}

const complete = (type, request) => {
  return Object.assign({}, request, {
    success: res => action(type.SUCCESS, {res}),
    failure: error => action(type.FAILURE, {error})
  })
}

// 返回字符串
export const LOGIN = createRequest('LOGIN')
export const REGISTER = createRequest('REGISTER')
export const ACTIVATE = createRequest('ACTIVATE')
export const LOGOUT = createRequest('LOGOUT')
export const FORGET = createRequest('FORGET')

export const SET = createRequest('SET')
export const TAGS = createRequest('TAGS') // get
export const BEGIN = createRequest('BEGIN') // get
export const FINISH = createRequest('FINISH')
export const CANCEL = createRequest('CANCEL') // get
export const EVENTS = createRequest('EVENTS') // get
export const EDIT = createRequest('EDIT')

export const RANK = createRequest('RANK')
export const DEGREE = createRequest('DEGREE')

// 所有actions
export const login = {
  request: ({email, password, autoLogin}) => action(LOGIN.REQUEST, {email, password, autoLogin}),
  success: name => action(LOGIN.SUCCESS, {name}),
  failure: error => action(LOGIN.FAILURE, {error})
}

export const register = {
  request: ({name, email, password}) => action(REGISTER.REQUEST, {name, email, password}),
  success: res => action(REGISTER.SUCCESS, {res}),
  failure: error => action(REGISTER.FAILURE, {error})
}

export const activate = {
  request: ({name, hash}) => action(ACTIVATE.REQUEST, {name, hash}),
  success: res => action(ACTIVATE.SUCCESS, {res}),
  failure: error => action(ACTIVATE.FAILURE, {error})
}

// 主要是删除session，删除cookie
export const logout = {
  request: () => action(LOGOUT.REQUEST, {}),
  success: res => action(LOGOUT.SUCCESS, {res}),
  failure: error => action(LOGOUT.FAILURE, {error})
}

export const forget = {
  request: ({email, pw}) => action(FORGET.REQUEST, {email, pw}),
  success: res => action(FORGET.SUCCESS, {res}),
  failure: error => action(FORGET.FAILURE, {error})
}

export const set = complete(SET, {
  request: ({oldPw, newPw, name}) => action(SET.REQUEST, {oldPw, newPw, name})
})

export const tags = complete(TAGS, {
  request: () => action(TAGS.REQUEST, {})
})

export const begin = complete(BEGIN, {
  request: () => action(BEGIN.REQUEST, {})
})

export const finish = complete(FINISH, {
  request: ({detail, tags, period}) => action(FINISH.REQUEST, {detail, tags, period})
})

export const cancel = complete(CANCEL, {
  request: () => action(CANCEL.REQUEST, {})
})

export const events = complete(EVENTS, {
  request: () => action(EVENTS.REQUEST, {})
})

export const edit = complete(EDIT, {
  request: ({pastEvent, newEvent}) => action(EDIT.REQUEST, {pastEvent, newEvent})
})

export const rank = complete(RANK, {
  request: () => action(RANK.REQUEST, {})
})

export const degree = complete(DEGREE, {
  request: () => action(DEGREE.REQUEST, {})
})

export const count = (tags, detail, period) => {
  return {
    type: "COUNT",
    tags,
    detail,
    period
  }
}
