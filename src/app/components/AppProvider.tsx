import React, { createContext, useState } from 'react'

interface Config {
  apiKey: string
  forcedContinuation: boolean
  language: 'en' | 'ja'
  retryGrouping: boolean
}

interface SharedObject {
  config: Config
  isAppExecuting: boolean
  isLoadingConfig: boolean
  executeError: string
  currentPage: 'main' | 'config'
}

interface Props {
  children?: React.ReactNode
}

interface Context {
  sharedObject: SharedObject
  setSharedObject: React.Dispatch<React.SetStateAction<SharedObject>>
}

export const AppContext = createContext<Context | undefined>(undefined)

export const AppProvider: React.FC<Props> = ({ children }) => {
  const [sharedObject, setSharedObject] = useState<SharedObject>({
    config: {
      apiKey: '',
      forcedContinuation: false,
      language: 'en',
      retryGrouping: false,
    },
    isAppExecuting: false,
    isLoadingConfig: true,
    executeError: '',
    currentPage: 'main',
  })

  return (
    <AppContext.Provider value={{ sharedObject, setSharedObject }}>
      {children}
    </AppContext.Provider>
  )
}
