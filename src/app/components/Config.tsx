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
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'

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

  const { t } = useTranslation()

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

    i18n.changeLanguage(language)

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
      <h3>{t('config.title')}</h3>
      <Stack direction="column" spacing={2} mt={2} justifyContent="center">
        <TextField
          label={t('config.apiKeyLabel')}
          error={!inputApiKey}
          helperText={t('config.apiKeyHelper')}
          fullWidth
          variant="outlined"
          size="small"
          value={inputApiKey}
          onChange={handleApiKeyChange}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="language-label">{t('config.language')}</InputLabel>
          <Select
            labelId="language-label"
            value={language}
            label="Language"
            onChange={handleLanguageChange}
            size="small"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">日本語</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title={t('config.forcedContinuationTip')}>
          <FormControlLabel
            control={<Switch checked={forcedContinuation} />}
            sx={{ ...formControlLabelStyle }}
            label={t('config.forcedContinuationLabel')}
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
          {t('config.cancelButton')}
        </Button>
        <Button
          variant="outlined"
          size="small"
          disabled={!inputApiKey}
          onClick={handleSave}
        >
          {t('config.saveButton')}
        </Button>
      </Stack>
    </div>
  )
}
