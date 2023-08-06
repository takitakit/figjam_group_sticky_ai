import React from 'react'
import { TextField, Button, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AppContext } from './AppProvider'

interface Props {
  children?: React.ReactNode
  onClosed?: () => void
}

export const Config: React.FC<Props> = ({ onClosed }) => {
  // const textbox = React.useRef<HTMLInputElement>(undefined);

  // const countRef = React.useCallback((element: HTMLInputElement) => {
  //   if (element) element.value = '5';
  //   textbox.current = element;
  // }, []);

  // const onCreate = () => {
  //   const count = parseInt(textbox.current.value, 10);
  //   parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*');
  // };

  // const onCancel = () => {
  //   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*');
  // };

  // React.useEffect(() => {
  //   // This is how we read messages sent from the plugin controller
  //   window.onmessage = (event) => {
  //     const { type, message } = event.data.pluginMessage;
  //     if (type === 'create-rectangles') {
  //       console.log(`Figma Says: ${message}`);
  //     }
  //   };
  // }, []);

  const { sharedObject, setSharedObject } = React.useContext(AppContext)
  const [inputApiKey, setInputApiKey] = React.useState(
    sharedObject?.config?.apiKey,
  )

  React.useEffect(() => {
    console.log('config mounted')

    window.onmessage = (event: MessageEvent) => {
      const { type } = event.data.pluginMessage
      console.log(`${type} message received`)
      if (type === 'save-config-done') {
        onClosed()
      }
    }

    return () => {
      window.onmessage = null
    }
  }, [])

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputApiKey(event.target.value)
  }

  const handleClose = () => {
    onClosed()
  }

  const handleSave = () => {
    // save config to plugin
    console.log('inputApiKey', inputApiKey)
    setSharedObject(prev => ({ ...prev, config: { apiKey: inputApiKey } }))

    parent.postMessage(
      { pluginMessage: { type: 'save-config', data: { apiKey: inputApiKey } } },
      '*',
    )
  }

  return (
    <div>
      <h3>Configuration</h3>
      <TextField
        label="ChatGPT-4 API Key"
        error={!inputApiKey}
        helperText="API Key for ChatGPT-4 to analyze contents of stickies"
        fullWidth
        variant="outlined"
        size="small"
        value={inputApiKey}
        onChange={handleApiKeyChange}
      />
      <Stack direction="row" spacing={2} mt={2} justifyContent="center">
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={handleClose}
          startIcon={<CloseIcon />}
        >
          Cancel
        </Button>
        <Button variant="outlined" size="small" onClick={handleSave}>
          Save
        </Button>
      </Stack>
    </div>
  )
}
