// @ts-ignore
import React, { Component, createRef, memo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import observe, { emitData } from '../../../utils/observers'
import styled from './styled'

const Div = styled()

if (!window.__arsfChatEmmitter) {
  window.__arsfChatEmmitter = (txt) => {
    emitData('__arsfChatEmmitter', txt)
  }
}
interface Props {
  send?: any;
}
class Compose extends Component<Props> {
  rel
  constructor (p: Props) {
    super(p)
    // @ts-ignore
    this.rel = createRef<any>(null)
    window.__arsfChatEmmitter.bind(this)()
    this.state = {
      img: false,
    }
  }

  componentDidMount () {
    const name = '__arsfChatEmmitter'
    observe(name, {
      [name]: this.send.bind(this),
    })
  }

  componentWillUnmount () {
    this.unobserve()
  }

  unobserve () {
    observe('')
  }

  send = (e) => {
    if (e) {
      const el = e.target
      const v = `${el.value}`.trim()
      if (v) {
        this.props.send({ text: v })
      }
      el.value = ''
    }
  }

  test = (e) => {
    e.preventDefault()
    return false
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && (!e.ctrlKey && !e.shiftKey)) {
      this.send(e)
    }
  }

  render (): React.ReactElement {
    return (
      <>
        <Div>
          {/* eslint-disable-next-line react/jsx-handler-names */}
          <form onSubmit={this.test} className='compose'>
            <textarea
              ref={this.rel}
              className='compose-input form-control'
              placeholder='Start typing'
              onKeyDown={this.handleKeyDown}
            />
            <div className='send'>
              <button
                className='btn btn-ghost-success img'
                onClick={() => this.send({ target: this.rel?.current })}
              />
            </div>
          </form>
        </Div>
      </>
    )
  }
}

export function mapDispatchToProps (dispatch): Props {
  return {
    send: (textObj) => dispatch({ ...textObj, type: 'messages_test' }),
  }
}

const withConnect = connect(
  null,
  mapDispatchToProps,
)

export default compose(
  withConnect,
  memo,
)(Compose) as React.FunctionComponent<Props>
