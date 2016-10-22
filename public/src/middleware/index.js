import fetch from 'isomorphic-fetch'

const checkHttpStatus = () => {

}

const postCallApi = (url, info) => {
  console.log(info)
  return fetch(url, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  })
  .then(response => {
    return response.json()
  })
  .then(
      response => ({response}),
      error => ({error})
  )
}

const getCallApi = (url) => {
  return fetch(url, {
    credentials: 'include'
  })
  .then(response => {
    console.log(response)
    return response.json()
  })
  .then(
      response => ({response}),
      error => ({error})
  )
}

export const loginUser = (info) => postCallApi('/api/login', info) 
export const registerUser = (info) => postCallApi('/api/register', info)
export const activateUser = (info) => postCallApi('/api/activate', info)
export const logoutUser = (info) => postCallApi('/api/logout', info)
export const forgetPw = (info) => postCallApi('/api/forget', info)

export const setting = (info) => postCallApi('/api/setting', info)
export const finishCount = (info) => postCallApi('/api/finish', info)
export const cancelCount = () => getCallApi('/api/cancel')
export const fetchEvents = () => getCallApi('/api/events')
export const editEvent = (info) => postCallApi('/api/edit', info)
export const fetchTags = () => getCallApi('/api/tags')
export const beginCount = () => getCallApi('/api/begin')

export const ranking = () => getCallApi('/api/rank')
export const getDegree = () => getCallApi('/api/degree')