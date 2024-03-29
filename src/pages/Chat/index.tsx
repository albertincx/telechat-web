import React, { useEffect, useState } from 'react'
import styled from './styled'
import observe, { emitData } from '../../utils/observers'
import Messenger from '@/components/Chat/Messenger'

const Popup = styled()

// Event listener for focus change
window.addEventListener('focus', function () {
  // isTabActive = true
  // console.log('Tab is active')
  window.__arsfChatInBackground = false
})

window.addEventListener('blur', function () {
  // isTabActive = false
  // console.log('Tab is in background')
  window.__arsfChatInBackground = true
})
window.instantChatBot = {
  show: false,
  open: () => {
    // @ts-ignore
    window.instantChatBot.show = !window.instantChatBot.show
    // @ts-ignore
    emitData('instantChatBotEvents', { open: window.instantChatBot.show })
  },
}

export function Chat () {
  const [show, setShow] = useState(false)
  const setShowFunc = (data) => {
    setShow(data.open)
  }
  useEffect(() => {
    const name = 'instantChatBotEvents'
    observe(name, {
      [name]: setShowFunc,
    })
  }, [])
  const toggle = () => {
    // @ts-ignore
    window.instantChatBot.open()
  }
  return (
    <div>
      <Popup>
        <div className='__mx-phone-line bottom'>
          {show
            ? (
              <div className='chat-wrapper1'>
                <div style={{ height: '100%' }}>
                  <Messenger />
                </div>
                <button className='__mx-phone-line-btn' onClick={toggle}>
                  Close
                </button>
              </div>
              )
            : (
              <div className='messanger-button' onClick={toggle} title='Support service' />
              )}
        </div>
      </Popup>
    </div>
  )
}
export default Chat
