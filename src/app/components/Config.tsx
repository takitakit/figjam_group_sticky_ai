import React from 'react'
import {
  TextField,
  Button,
  Stack,
  Tooltip,
  FormControl,
  FormControlLabel,
  InputLabel,
  Switch,
  Select,
  MenuItem,
} from '@mui/material'
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
  const [forcedContinuation, setForcedContinuation] = React.useState(
    sharedObject?.config?.forcedContinuation,
  )
  const [language, setLanguage] = React.useState(
    sharedObject?.config?.language ?? 'en',
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
  const handleForcedContinuationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForcedContinuation(event.target.checked)
  }
  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value as 'en' | 'ja')
  }

  const handleClose = () => {
    onClosed()
  }

  const handleSave = () => {
    // save config to plugin
    console.log(
      'inputApiKey',
      inputApiKey,
      'forcedContinuation',
      forcedContinuation,
      'language',
      language,
    )
    const newConfig = {
      apiKey: inputApiKey,
      forcedContinuation,
      language,
    }
    setSharedObject(prev => ({ ...prev, config: newConfig }))

    parent.postMessage(
      { pluginMessage: { type: 'save-config', data: newConfig } },
      '*',
    )
  }

  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '.8rem',
    },
  }

  return (
    <div>
      <h3>Configuration</h3>
      <Stack direction="column" spacing={2} mt={2} justifyContent="center">
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
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">Language</InputLabel>
          <Select
            labelId="demo-select-small-label"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
            size="small"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">日本語</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Depending on the number of selected stickies (amount of text), ChatGPT's API sending and receiving limits may be exceeded. In that case, you will receive partially trunked and incomplete results.">
          <FormControlLabel
            control={<Switch checked={forcedContinuation} />}
            sx={{ ...formControlLabelStyle }}
            label="Continues processing even if analysis results are interrupted"
            onChange={handleForcedContinuationChange}
          />
        </Tooltip>
      </Stack>

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
        <Button
          variant="outlined"
          size="small"
          disabled={!inputApiKey}
          onClick={handleSave}
        >
          Save
        </Button>
      </Stack>
    </div>
  )
}
