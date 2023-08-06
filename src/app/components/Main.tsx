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
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

interface Props {
  onEmptyConfig: () => void
}

interface result {
  numberOfStickies: number
}

export const Main: React.FC<Props> = ({ onEmptyConfig }) => {
  const context = React.useContext(AppContext)
  const { sharedObject, setSharedObject } = context
  const [result, setResult] = React.useState<result | null>(null)

  const { t } = useTranslation()

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

        i18n.changeLanguage(data?.language || 'en')

        if (!data?.apiKey) {
          // if apiKey is not set, open config
          onEmptyConfig()
        }
      } else if (type === 'execute-error') {
        // detect error
        console.log('data', data)
        let message = t(data.message)
        if (data.originalError) {
          message = `${message} ${data.originalError}`
        }

        setResult(null)
        setSharedObject(prev => ({
          ...prev,
          isAppExecuting: false,
          executeError: message,
        }))
      } else if (type === 'execute-done') {
        // detect success
        setResult(data)
        setSharedObject(prev => ({
          ...prev,
          isAppExecuting: false,
          executeError: '',
        }))
      }
    }

    return () => {
      window.onmessage = null
    }
  }, [])

  const handleExecute = () => {
    // do group selected stickies
    setResult(null)
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
                {t('main.executeButton')}
              </LoadingButton>
            ) : (
              <Button variant="outlined" size="small" onClick={handleExecute}>
                {t('main.executeButton')}
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
      {result && (
        <Stack mt={2} spacing={2}>
          <Alert severity="success">
            {t('main.executeResult', {
              numOfStickies: result.numberOfStickies,
            })}
          </Alert>
        </Stack>
      )}
    </div>
  )
}
