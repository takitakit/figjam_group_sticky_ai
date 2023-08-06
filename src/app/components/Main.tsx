import React from 'react'
import { AppContext } from './AppProvider'
import { CircularProgress, Stack } from '@mui/material'

interface Props {
  onEmptyConfig: () => void
}

export const Main: React.FC<Props> = ({ onEmptyConfig }) => {
  const context = React.useContext(AppContext)
  const { setSharedConfig } = context

  const [isLoadingConfig, setIsLoadingConfig] = React.useState(true)

  React.useEffect(() => {
    console.log('main mounted')

    // Loading config from plugin
    parent.postMessage({ pluginMessage: { type: 'load-config' } }, '*')

    window.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage
      console.log(`${type} message received`)

      if (type === 'load-config-done') {
        setIsLoadingConfig(false)

        // save config to context
        setSharedConfig(data)

        console.log('config loaded', data.apiKey)

        if (!data.apiKey) {
          // if apiKey is not set, open config
          onEmptyConfig()
        }
      }
    }
  }, [])

  return (
    <div>
      {isLoadingConfig && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
    </div>
  )
}
