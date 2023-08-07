import React, { useState, useContext, useEffect } from 'react'
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

interface Result {
  numberOfStickies: number
}

export const Main: React.FC<Props> = ({ onEmptyConfig }) => {
  const { sharedObject, setSharedObject } = useContext(AppContext)
  const { isLoadingConfig, executeError, isAppExecuting } = sharedObject
  const [result, setResult] = useState<Result | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage
      console.log(`${type} message: received`)

      switch (type) {
        case 'load-config-done':
          handleConfigLoaded(data)
          break
        case 'execute-error':
          handleExecutionError(data)
          break
        case 'execute-done':
          handleExecutionSuccess(data)
          break
      }
    }

    window.addEventListener('message', handleMessage)
    parent.postMessage({ pluginMessage: { type: 'load-config' } }, '*')
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const handleConfigLoaded = (data: any) => {
    setSharedObject(prev => ({
      ...prev,
      config: data,
      isLoadingConfig: false,
    }))
    i18n.changeLanguage(data?.language || 'en')
    if (!data?.apiKey) {
      onEmptyConfig()
    }
  }

  const handleExecutionError = (data: any) => {
    const errorMessage = data.originalError
      ? `${t(data.message)} ${data.originalError}`
      : t(data.message)
    setResult(null)
    setSharedObject(prev => ({
      ...prev,
      isAppExecuting: false,
      executeError: errorMessage,
    }))
  }

  const handleExecutionSuccess = (data: any) => {
    setResult(data)
    setSharedObject(prev => ({
      ...prev,
      isAppExecuting: false,
      executeError: '',
    }))
  }

  const handleExecute = () => {
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
    <>
      {isLoadingConfig ? (
        <Stack justifyContent="center" alignItems="center">
          <CircularProgress />
        </Stack>
      ) : (
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

      {executeError && (
        <Stack mt={2}>
          <Alert severity="error">{executeError}</Alert>
        </Stack>
      )}

      {result && (
        <Stack mt={2}>
          <Alert severity="success">
            {t('main.executeResult', {
              numOfStickies: result.numberOfStickies,
            })}
          </Alert>
        </Stack>
      )}

      <Backdrop
        sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
        open={isAppExecuting}
      >
        <img
          src={coffeeImg}
          alt="coffee"
          width={24}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}
