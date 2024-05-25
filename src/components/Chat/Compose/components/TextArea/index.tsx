import React from 'react'
import { emitData } from '@/utils/observers'

if (!window.__arsfChatEmmitter) {
  window.__arsfChatEmmitter = (txt: string) => {
    emitData('__arsfChatEmmitter', txt)
  }
}

interface IProps {
  rel?: any;
  send?: any;
}

const TextArea: React.FC<IProps> = ({ rel, send }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (!e.ctrlKey && !e.shiftKey)) {
      send(e)
    }
  }

  return (
    <textarea
      ref={rel}
      className='compose-input form-control'
      placeholder='Start typing'
      onKeyDown={handleKeyDown}
    />
  )
}

export default TextArea
