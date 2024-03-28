import React from 'react'
import styled from './styled'

const Div = styled()
export default function MoreButton ({ onClick }: any) {
  return (
    <Div>
      <div className='append-more' onClick={onClick}>
        <div className='arsf-btn'>More</div>
      </div>
    </Div>
  )
}
