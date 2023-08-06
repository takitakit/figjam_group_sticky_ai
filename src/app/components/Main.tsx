import React from 'react'
import { AppContext } from './AppProvider'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Alert,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'

interface Props {
  onEmptyConfig: () => void
}

export const Main: React.FC<Props> = ({ onEmptyConfig }) => {
  const context = React.useContext(AppContext)
  const { sharedObject, setSharedObject } = context

  React.useEffect(() => {
    console.log('main mounted')

    // Loading config from plugin
    parent.postMessage({ pluginMessage: { type: 'load-config' } }, '*')

    window.onmessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage
      console.log(`${type} message received`)

      if (type === 'load-config-done') {
        // save config to context
        console.log('config', data)

        setSharedObject(prev => ({
          ...prev,
          config: data,
          isLoadingConfig: false,
        }))

        if (!data.apiKey) {
          // if apiKey is not set, open config
          onEmptyConfig()
        }
      } else if (type === 'execute-error') {
        // detect error
        setSharedObject(prev => ({
          ...prev,
          isAppExecuting: false,
          executeError: data.message,
        }))
      }
    }

    return () => {
      window.onmessage = null
    }
  }, [])

  const handleExecute = () => {
    // do group selected stickies
    setSharedObject(prev => ({
      ...prev,
      isAppExecuting: true,
      executeError: '',
    }))
    parent.postMessage({ pluginMessage: { type: 'execute' } }, '*')
  }

  const handleConfigClick = () => {
    setSharedObject(prev => ({ ...prev, currentPage: 'config' }))
  }

  return (
    <div>
      <Box position="absolute" top="0" right="0">
        <IconButton
          onClick={handleConfigClick}
          disabled={sharedObject.isAppExecuting}
        >
          <SettingsIcon />
        </IconButton>
      </Box>
      {sharedObject.isLoadingConfig && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}
      <Stack direction="row" spacing={2} mt={5} justifyContent="center">
        {!sharedObject.isLoadingConfig && (
          <>
            {sharedObject.isAppExecuting ? (
              <LoadingButton
                size="small"
                loading
                loadingPosition="start"
                variant="outlined"
                startIcon={<SaveIcon />}
              >
                Group selected stickies
              </LoadingButton>
            ) : (
              <Button variant="outlined" size="small" onClick={handleExecute}>
                Group selected stickies
              </Button>
            )}
          </>
        )}
      </Stack>
      {sharedObject.executeError && (
        <Stack mt={2} spacing={2}>
          <Alert severity="error">{sharedObject.executeError}</Alert>
        </Stack>
      )}
    </div>
  )
}
