import React from 'react'
import '../styles/global.scss'

import { AppContainer } from './AppContainer'
import { AppProvider } from './AppProvider'
import '../i18n/config'

if (process.env.NODE_ENV === 'production') {
  console.log = function () {} // 何もしない関数に上書き
}

const App = () => {
  return (
    <>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </>
  )
}
export default App
