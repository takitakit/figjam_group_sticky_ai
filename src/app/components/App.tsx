import React from 'react'
import '../styles/global.scss'

import { AppContainer } from './AppContainer'
import { AppProvider } from './AppProvider'
import '../i18n/config'

function App() {
  return (
    <>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </>
  )
}

export default App
