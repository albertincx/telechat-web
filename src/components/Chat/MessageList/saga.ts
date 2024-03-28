import { put, takeLatest } from 'redux-saga/effects'
import Storage from '../../../utils/storage'

import { logger } from '../network'

// @ts-ignore
import notifySound from '../../../assets/sound.mp3'

import html2canvas from 'html2canvas'
import { ARSF_CHAT_EMMITTER_MESS } from '@/consts'

let scrollEnd = false
let lastLocation = ''
let lastOffset = 0
let connected = 0
let reconnect = true
let _rec = false

const sound = new Audio(notifySound)

// Play the sound
function playSound () {
  sound.play()
}
if (window.location.host === 'localhost:3000') {
  window.__arsfChatIdg = '4156467812'
}

function getUid () {
  const u = Storage.get('instantChatBotUidNameStored')
  if (u) {
    return u
  }
  return window.instantChatBotUidName
}

export function wsSend (text, img) {
  if (img && !text) {
    text = 'Screenshot saved'
  }
  const message = {
    message: text,
    host: '',
    pathname: '',
    g: '',
    u: '',
    uid: '',
    isRec: false,
    img: '',
  }
  if (!text) return

  message.host = window.location.host
  message.pathname = window.location.pathname
  if (img) {
    message.img = img
  }
  message.g = window.__arsfChatIdg || ''
  if (window.__arsfChatIdu) {
    message.u = window.__arsfChatIdu
  }
  message.uid = getUid()
  message.isRec = connected > 0
  window.__arsfChat.send(JSON.stringify(message))
  window.__arsfShowGreetings = false
  return message
}
// eslint-disable-next-line require-yield
export function * clear () {
  const userId = getUid()
  const isNew = userId !== lastLocation
  if (!lastLocation || !isNew) return

  lastLocation = ''
  connected = 0
  _rec = true
}

export function * getData (params) {
  try {
    if (!connected) {
      connect(_rec, params)
      connected += 1
    }
    let offset = 0
    const { isScroll, isNewMessage } = params

    const pq: any = {}
    let { userId = 1 } = pq
    const u = window.location && window.location.href.match(/client\/([0-9]+)\//)
    if (u) {
      userId = u[1]
    }
    const isNew = userId !== lastLocation
    if (lastLocation && isNew) {
      yield put({ type: 'messages_clear' })
    }
    if (isNew) {
      lastOffset = 0
    }
    if (isNew) {
      scrollEnd = false
    }
    if (isNewMessage) {
      lastOffset = 0
    }
    if (scrollEnd) {
      return
    }
    lastLocation = userId
  } catch (error) {
    logger(error)
    yield put({ type: 'messages_error', error })
  }
}

const connect = (rec = false, params: any = {}) => {
  let wsUri = 'wss://undefined/'
  // @ts-ignore
  if (import.meta.env.VITE_APP_WS_URI) {
    // @ts-ignore
    wsUri = import.meta.env.VITE_APP_WS_URI
  }
  if (window.__arsfChatUrl) {
    wsUri = `wss://${window.__arsfChatUrl}/`
  }
  const cc = new WebSocket(wsUri)
  cc.onopen = () => {
    _rec = false
    window.__arsfChat = cc
    if (window.__arsfChat) {
      window.__arsfChat.addEventListener('message',
        (event) => {
          if (event?.data === '#getscreen') {
            html2canvas(document.body).then(canvas => {
              const dataURL = canvas.toDataURL('image/png')
              wsSend('', dataURL)
            })
            return
          } else if (event?.data === '#getlogs') {
            let conArr = console.everything || []
            if (conArr.length) {
              try {
                conArr = conArr.map(it => {
                  const v = it.value?.map(it2 => {
                    return JSON.stringify(it2)
                  })
                  return `${it.type} - ${v}`
                })
                wsSend('logs', conArr)
              } catch (e) {
                console.log(e)
              }
            }
            return
          } else if (window.__arsfChatInBackground) {
            playSound()
          }
          if (window.__arsfChatEmmitter) {
            window.__arsfChatEmmitter(ARSF_CHAT_EMMITTER_MESS, event)
          }
        })
    }
    if (params.mount) {
      const message = { service: 'lastmes', g: '', uid: '' }
      message.g = window.__arsfChatIdg || ''
      message.uid = getUid()
      window.__arsfChat.send(JSON.stringify(message))
    }
    if (!rec) {
      const message: any = { message: 'hi', login: 1 }
      message.host = window.location.host
      message.pathname = window.location.pathname
      message.g = window.__arsfChatIdg || ''
      message.uid = window.instantChatBotUidName
      if (window.__arsfChatIdu) {
        message.u = window.__arsfChatIdu
      }
      window.__arsfChat.send(JSON.stringify(message))
    }
  }
  cc.onerror = function (e) {
    reconnect = false
    logger(e)
  }
  cc.onclose = function () {
    if (!reconnect) return
    setTimeout(function () {
      connect(true)
      connected += 1
    }, 1000)
  }
}

export function * newMessage ({ text, img }) {
  try {
    const message = wsSend(text, img)
    yield put({ type: 'messages_success', data: [message] })
  } catch (e) {
    logger(e)
  }
}

export function * sendGroupAction (params) {
  try {
    let { message } = params
    message = { message }
    if (message.message[0] === '{') {
      try {
        const mess = JSON.parse(message.message)
        if (typeof mess === 'object') {
          message = mess
        }
      } catch (e) {
        logger(e)
      }
    }
    if (message.service) {
      if (message.service === 'setUid') {
        if (!window.instantChatBotUidName) {
          window.instantChatBotUidName = message.message
        }
        const { lastMess = [] } = message
        yield put({ type: 'messages_success', data: lastMess })
      }
      if (message.service === 'lastmes') {
        const { lastMess = [] } = message
        yield put({ type: 'messages_success', data: lastMess })
      }
    } else {
      if (connected > 1 && message.greeting) {
        //
      } else {
        message.sender = 'admin'
        yield put({ type: 'messages_success', data: [message] })
      }
    }
  } catch (e) {
    logger(e)
  }
}

export default function * saga () {
  yield takeLatest('messages_clear', clear)
  yield takeLatest('messages_load', getData)
  yield takeLatest('send_action', sendGroupAction)
  yield takeLatest('scroll_mess', getData)
  // @ts-ignore
  yield takeLatest('messages_test', newMessage)
}