import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Chat from '@/pages/Chat'
import { Provider } from 'react-redux'
import configure from '@/utils/configureStore'

const rootElement = document.getElementById('apppopupmax')

const store = configure()

if (!rootElement) {
  throw new Error('Failed to find the root element')
}

const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <Provider store={store}>
      <Chat />
    </Provider>
  </StrictMode>,
)
