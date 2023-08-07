import React, { useEffect, useState, useContext } from 'react'
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
import { Config } from '../../type/default.d'

interface Props {
  onClosed?: () => void
}

export const Configure: React.FC<Props> = ({ onClosed }) => {
  const { t } = useTranslation()
  const { sharedObject, setSharedObject } = useContext(AppContext)

  const initialConfig = sharedObject?.config || ({} as Config)

  const [inputApiKey, setInputApiKey] = useState(initialConfig?.apiKey)
  const [forcedContinuation, setForcedContinuation] = useState(
    initialConfig?.forcedContinuation ?? true,
  )
  const [retryGrouping, setRetryGrouping] = useState(
    initialConfig?.retryGrouping ?? false,
  )
  const [language, setLanguage] = useState(initialConfig?.language ?? 'en')

  useEffect(() => {
    window.onmessage = (event: MessageEvent) => {
      if (event.data.pluginMessage.type === 'save-config-done') {
        onClosed?.()
      }
    }
    return () => {
      window.onmessage = null
    }
  }, [onClosed])

  const handleSave = () => {
    const newConfig = {
      apiKey: inputApiKey,
      forcedContinuation,
      language,
      retryGrouping,
    }

    setSharedObject(prev => ({ ...prev, config: newConfig }))
    i18n.changeLanguage(language)
    parent.postMessage(
      { pluginMessage: { type: 'save-config', data: newConfig } },
      '*',
    )
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
          onChange={e => setInputApiKey(e.target.value)}
        />
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="language-label">{t('config.language')}</InputLabel>
          <Select
            labelId="language-label"
            value={language}
            label="Language"
            onChange={e => setLanguage(e.target.value as 'en' | 'ja')}
            size="small"
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ja">日本語</MenuItem>
          </Select>
        </FormControl>
        <FormControlLabelComponent
          label={t('config.forcedContinuationLabel')}
          checked={forcedContinuation}
          onChange={e => setForcedContinuation(e.target.checked)}
          tooltip={t('config.forcedContinuationTip')}
        />
        <FormControlLabelComponent
          label={t('config.retryGroupingLabel')}
          checked={retryGrouping}
          onChange={e => setRetryGrouping(e.target.checked)}
          tooltip={t('config.retryGroupingTip')}
        />
      </Stack>

      <Stack direction="row" spacing={2} mt={2} justifyContent="center">
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={onClosed}
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

interface FormControlLabelComponentProps {
  label: string
  checked: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip: string
}

const FormControlLabelComponent: React.FC<FormControlLabelComponentProps> = ({
  label,
  checked,
  onChange,
  tooltip,
}) => {
  const formControlLabelStyle = {
    '& .MuiFormControlLabel-label': {
      fontSize: '.8rem',
    },
  }

  return (
    <Tooltip title={tooltip}>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onChange} />}
        sx={{ ...formControlLabelStyle }}
        label={label}
      />
    </Tooltip>
  )
}
