import React from 'react'

interface Config {
  apiKey: string
}

interface ComponentProps {
  children?: React.ReactNode;
}

interface Context {
  sharedConfig: Config
  setSharedConfig: React.Dispatch<React.SetStateAction<Config>>
}

export const AppContext = React.createContext<Context | undefined>(undefined)

export const AppProvider: React.FC<ComponentProps> = ({ children }) => {
  const [sharedConfig, setSharedConfig] = React.useState<Config>({apiKey: ''})

  return (
    <AppContext.Provider value={{ sharedConfig, setSharedConfig }}>
      {children}
    </AppContext.Provider>
  )
}
