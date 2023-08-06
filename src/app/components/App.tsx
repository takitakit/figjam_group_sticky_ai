import React from 'react'
import '../styles/global.scss'

import { Box, IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import { Config } from './Config'
import { Main } from './Main'
import { AppProvider } from './AppProvider'

function App() {
  const [page, setPage] = React.useState('main')

  const handleConfigClick = () => {
    setPage('config')
  }

  const handleConfigClosed = () => {
    setPage('main')
  }

  const handleEmptyConfig = () => {
    console.log('empty config detected')
    // if config is empty, open config
    setPage('config')
  }

  return (
    <>
      <AppProvider>
        {page !== 'config' && (
          <Box position="absolute" top="0" right="0">
            <IconButton onClick={handleConfigClick}>
              <SettingsIcon />
            </IconButton>
          </Box>
        )}
        {page === 'main' && <Main onEmptyConfig={handleEmptyConfig} />}
        {page === 'config' && <Config onClosed={handleConfigClosed} />}
      </AppProvider>
    </>
  )
}

export default App
