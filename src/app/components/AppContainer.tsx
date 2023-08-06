import React from 'react'
import '../styles/global.scss'

import { AppContext } from './AppProvider'
import { Config } from './Config'
import { Main } from './Main'

export const AppContainer: React.FC = () => {
  const context = React.useContext(AppContext)
  const { sharedObject, setSharedObject } = context

  const handleConfigClosed = () => {
    setSharedObject(prev => ({ ...prev, currentPage: 'main' }))
  }

  const handleEmptyConfig = () => {
    console.log('empty config detected')
    // if config is empty, open config
    setSharedObject(prev => ({ ...prev, currentPage: 'config' }))
  }

  return (
    <>
      {sharedObject.currentPage === 'main' && (
        <Main onEmptyConfig={handleEmptyConfig} />
      )}
      {sharedObject.currentPage === 'config' && (
        <Config onClosed={handleConfigClosed} />
      )}
    </>
  )
}
