import React, { Component } from 'react'
import moment from 'dayjs'
import styled from './styled'

const Div = styled()

export default class Message extends Component<any> {
  render () {
    const { data, startsSequence, endsSequence, showTimestamp } = this.props
    const friendlyTimestamp = moment(data.createdAt).format('HH:mm')
    if (!data.message) return null
    const isMine = data.sender !== 'admin'

    return (
      <Div>
        <div className={[
          'arsf-message',
          `${isMine ? 'mine' : ''}`,
          `${startsSequence ? 'start' : ''}`,
          `${endsSequence ? 'end' : ''}`,
        ].join(' ')}
        >
          {showTimestamp && <div className='timestamp'>{friendlyTimestamp}</div>}

          <div className='bubble-container'>
            <div className='bubble' title={friendlyTimestamp}>
              {`${data.message}`.trim()}
              <div className='time'>
                <span className='right'>{friendlyTimestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </Div>
    )
  }
}
