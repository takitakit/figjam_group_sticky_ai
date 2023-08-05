import React from 'react'
import '../styles/global.scss'

import { Box, IconButton } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings'
import { Config } from './Config'

function App() {
  const [page, setPage] = React.useState('main')

  const handleConfigClick = () => {
    setPage('config')
  }

  const handleConfigClosed = () => {
    setPage('main')
  }

  React.useEffect(() => {

  }, []);

  return (
    <>
      {
        page !== 'config' &&
          <Box position="absolute" top="0" right="0">
            <IconButton onClick={handleConfigClick}>
              <SettingsIcon />
            </IconButton>
          </Box>
      }
      {
        page === 'config' && <Config onClosed={handleConfigClosed}/>
      }
    </>
  );
}

export default App