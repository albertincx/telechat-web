import Storage from '@/utils/storage'
import request from '@/utils/request'

export function logger (e) {
  if (import.meta.env.VITE_APP_ENVIRONMENT === 'development') {
    console.log(e)
  }
}

function getHeader () {
  const token = Storage.get('ctoken')

  return { Authorization: `Bearer ${token}` }
}

export const docApiUrl = (a) => {
  const db = ''
  return `${a}${a.match(/\?/) ? '&' : '?'}${db ? `db_name=${db}` : ''}`
}

function * req (url, method = 'POST', postData: any = null) {
  let apiUrl = ''
  if (url.match('getMessages')) apiUrl = import.meta.env.REST_API

  url = `${apiUrl}${url}`
  url = docApiUrl(url)
  const headers = yield getHeader()
  if (postData) {
    headers['Content-Type'] = 'application/json'
    headers.Accept = 'application/json'
    headers.Referer = 'http://localhost.dev'
  }
  const options: any = { headers }
  if (postData) {
    options.method = method || 'POST'
    options.body = JSON.stringify(postData)
  }
  let data
  try {
    data = yield request(url, options)
  } catch (e) {
    logger(e)
  }
  return data
}

export function * getMessages (userId, params) {
  const url = `/getMessages?user_id=${userId}&${params.join('&')}`
  return yield req(url)
}

export function * sendMessage (userId, chatId, data) {
  const url = `?user_id=${userId}`
  return yield req(url, 'POST', data)
}
