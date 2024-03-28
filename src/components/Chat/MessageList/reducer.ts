import { produce } from 'immer'
// The initial state of the App
export const initialState = {
  loading: false,
  error: false,
  total: 0,
  action: false,
  messages: { messages: [] },
}

/* eslint-disable default-case, no-param-reassign */
const appReducer = (state = initialState, action) =>
  produce(state, draft => {
    let messages, m, msg
    switch (action.type) {
      case 'messages_clear':
        draft.loading = false
        draft.error = false
        draft.action = false
        draft.messages = { messages: [] }
        break
      case 'messages_load':
      case 'messages_test':
        draft.loading = true
        draft.error = false
        draft.action = false
        break
      case 'message_load':
        draft.loading = true
        draft.error = false
        break
      case 'messages_success':
        m = action.data || []
        m.reverse()
        if (!action.isNewMessage) {
          if (!action.isNew) {
            m = state.messages.messages.concat(m)
          }
        } else {
          setTimeout(() => {
            const element = document.querySelector('.arsf-messenger-scrollable.content')
            if (element) {
              element.scrollTop = element.scrollHeight
            }
          }, 100)
        }
        m = { messages: m, total: action.total }
        draft.messages = m
        draft.loading = false
        break
      case 'message_success':
        msg = action.data
        if (!Array.isArray(msg)) {
          msg = [msg]
        }
        messages = state.messages.messages.concat(msg)
        draft.messages = { messages }
        draft.loading = false
        break
      case 'messages_error':
        draft.error = action.error
        draft.loading = false
        break
      case 'action_success':
        draft.action = action.data
        draft.loading = false
        break
    }
  })

export default appReducer
