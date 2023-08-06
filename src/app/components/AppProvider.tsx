import React from 'react'

interface Config {
  apiKey: string
  forcedContinuation: boolean
}

interface SharedObject {
  config: Config
  isAppExecuting: boolean
  isLoadingConfig: boolean
  executeError: string
  currentPage: 'main' | 'config'
}

interface ComponentProps {
  children?: React.ReactNode
}

interface Context {
  sharedObject: SharedObject
  setSharedObject: React.Dispatch<React.SetStateAction<SharedObject>>
}

export const AppContext = React.createContext<Context | undefined>(undefined)

export const AppProvider: React.FC<ComponentProps> = ({ children }) => {
  const [sharedObject, setSharedObject] = React.useState<SharedObject>({
    config: {
      apiKey: '',
      forcedContinuation: false,
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
