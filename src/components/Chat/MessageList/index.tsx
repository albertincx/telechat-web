import React, { Component, memo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import moment from 'dayjs'
import duration from 'dayjs/plugin/duration'

import { createStructuredSelector } from 'reselect'
import injectSaga from '@/utils/injectSaga'
import injectReducer from '@/utils/injectReducer'

// eslint-disable-next-line import/no-named-default
import ComposeElement from '../Compose'
import MoreButton from '../MoreButton'
import Message from '../Message'

import {
  makeSelectError,
  makeSelectLoading,
  makeSelectMess,
  makeSelectAction,
} from './selectors'

import styled from './styled'
import saga from './saga'
import reducer from './reducer'
import Loader from '../Loader'
import observe, { emitData } from '../../../utils/observers'
import { CHAT_EMITTER } from '@/consts'
import { MessageObject } from './types'

const Div = styled()
moment.extend(duration)

window.__arsfChatEmmitter = emitData

interface IProps {
  loading?: boolean,
  clear: () => void,
  getMessages: (params) => void,
  sendAction: (params) => void,
  messages?: MessageObject,
}

class MessageList extends Component<IProps, any> {
  public lastLocation = ''

  public this$el = React.createRef<any>()

  componentDidMount () {
    const name = CHAT_EMITTER
    observe(name, {
      [name]: this.getMessages.bind(this),
    })
    this.getMessages({ mount: 1 })
    this.scrollBottom()
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  public componentWillUnmount () {
    this.props.clear()
  }

  componentDidUpdate () {
    const { actions } = {} as any
    if (!actions) {
      this.scrollBottom()
    }
    this.lastLocation = window.location.search
  }

  scrollBottom = () => {
    setTimeout(() => {
      const element = document.querySelector('.arsf-messenger-scrollable .arsf-message-list-container')
      if (element) {
        element.scrollTop = element.scrollHeight
      }
    }, 100)
  }

  getMessages = (params: any = {}) => {
    if (params.data) {
      this.sendAction({ message: params.data })
      return
    }
    if (this.this$el && this.this$el.current) {
      this.props.getMessages(params)
    }
  }

  more = () => {
    this.getMessages({ isSend: 1 })
  }

  renderMessages () {
    let i = 0
    const mess = this.props.messages
    if (!mess) return null

    const messageCount = mess.messages && mess.messages.length
    const messagesRender: any[] = []
    while (i < messageCount) {
      const previous = mess.messages[i - 1]
      const current = mess.messages[i]
      const next = mess.messages[i + 1]
      const currentMoment = moment(current.createdAt)
      let prevBySameAuthor = false
      let nextBySameAuthor = false
      let startsSequence = true
      let endsSequence = true
      let showTimestamp = true
      let showMore = true

      if (previous) {
        const previousMoment = moment(previous.createdAt)
        const previousDuration = moment.duration(
          currentMoment.diff(previousMoment),
        )
        prevBySameAuthor = previous.author === current.author

        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false
          showMore = false
        }
      }

      if (next) {
        const nextMoment = moment(next.createdAt)
        const nextDuration = moment.duration(nextMoment.diff(currentMoment))
        nextBySameAuthor = next.author === current.author

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false
        }
      }
      messagesRender.push(
        <Message
          key={i}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          showMore={showMore}
          data={current}
        />,
      )

      i += 1
    }

    return messagesRender
  }

  renderContent = () => (
    <div className='arsf-message-list' ref={this.this$el}>
      {this.props.messages && (this.props.messages.messages.length < this.props.messages.total)
        ? (
          <div>{!this.props.loading
            // eslint-disable-next-line react/jsx-handler-names
            ? <MoreButton onClick={this.more} />
            : <Loader />}
          </div>
          )
        : null}
      <div className='arsf-message-list-container'>{this.renderMessages()}</div>
      <ComposeElement />
    </div>
  )

  sendAction = ({ message, action = '' }) => {
    this.props.sendAction({ action, message })
  }

  render () {
    if (this.props.loading) {
      return <Loader />
    }

    return (
      <Div style={{ height: '100%' }}>
        {this.renderContent()}
      </Div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  messages: makeSelectMess(),
  action: makeSelectAction(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
})

function mapDispatchToProps (dispatch): IProps {
  return {
    clear: () => dispatch({ type: 'messages_clear' }),
    getMessages: params => dispatch({ type: 'messages_load', ...params }),
    sendAction: params => dispatch({ type: 'send_action', ...params }),
  }
}

const withSaga = injectSaga({ key: 'messages', saga, mode: undefined })
const withReducer = injectReducer({ key: 'messages', reducer })

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default compose(
  withSaga,
  withReducer,
  withConnect,
  memo,
)(MessageList)
