import React from 'react'
import { AppContext } from './AppProvider'
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Stack,
  Alert,
  Backdrop,
} from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
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

  const coffeeImg = require('../images/coffee.png').default

  return (
    <div>
      {sharedObject.isLoadingConfig && (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      )}

      {!sharedObject.isLoadingConfig && (
        <>
          <Stack direction="row" spacing={2} mt={10} justifyContent="center">
            <Button variant="outlined" size="small" onClick={handleExecute}>
              {t('main.executeButton')}
            </Button>
          </Stack>
          <Box position="absolute" top="0" right="0">
            <IconButton onClick={handleConfigClick}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </>
      )}

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

      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={sharedObject.isAppExecuting}
      >
        <img
          src={coffeeImg}
          alt="coffee"
          width={24}
          style={{
            position: 'absolute',
            top: 'calc(50% - 14px)',
            left: 'calc(50% - 12px)',
          }}
        />
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}
