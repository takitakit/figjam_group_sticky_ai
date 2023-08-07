import React, { useContext } from 'react'
import '../styles/global.scss'

import { AppContext } from './AppProvider'
import { Configure } from './Configure'
import { Main } from './Main'

export const AppContainer: React.FC = () => {
  const { sharedObject, setSharedObject } = useContext(AppContext)

  const handleConfigClosed = () => {
    setSharedObject(prev => ({ ...prev, currentPage: 'main' }))
  }

  const handleEmptyConfig = () => {
    console.log('empty config detected')
    setSharedObject(prev => ({ ...prev, currentPage: 'config' }))
  }

  return (
    <>
      {sharedObject.currentPage === 'main' && (
        <Main onEmptyConfig={handleEmptyConfig} />
      )}
      {sharedObject.currentPage === 'config' && (
        <Configure onClosed={handleConfigClosed} />
      )}
    </>
  )
}
