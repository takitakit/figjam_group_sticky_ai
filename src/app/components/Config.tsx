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

  React.useEffect(() => {}, [])

  const { sharedConfig } = React.useContext(AppContext)

  const [apiKey, setApiKey] = React.useState(sharedConfig.apiKey)

  React.useEffect(() => {
    console.log('config mounted')

    window.onmessage = (event: MessageEvent) => {
      const { type } = event.data.pluginMessage
      console.log(`${type} message received`)
      if (type === 'save-config-done') {
        onClosed()
      }
    }
  }, [])

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value)
  }

  const handleClose = () => {
    onClosed()
  }

  const handleSave = () => {
    // save config to plugin
    parent.postMessage(
      { pluginMessage: { type: 'save-config', data: { apiKey } } },
      '*',
    )
  }

  return (
    <div>
      <h3>Configuration</h3>
      <TextField
        label="ChatGPT-4 API Key"
        error={!apiKey}
        helperText="API Key for ChatGPT-4 to analyze contents of stickies"
        fullWidth
        variant="outlined"
        size="small"
        value={apiKey}
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
