import React from "react"
import { TextField, Button, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'

interface Props {
  children?: React.ReactNode;
  onClosed?: () => void;
}

export const Config:React.FC<Props> = ({ onClosed }) => {

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

  const handleClose = () => {
    onClosed()
  }

  return (
    <div>
      <h3>Configuration</h3>
      <TextField label="ChatGPT-4 API Key" helperText="API Key for ChatGPT-4 to analyze contents of stickies" fullWidth variant="outlined" size="small" />
      <Stack direction="row" spacing={2} mt={2} justifyContent="center">
        <Button variant="outlined" size="small" color="error" onClick={handleClose} startIcon={<CloseIcon />}>Cancel</Button>
        <Button variant="outlined" size="small">Save</Button>
      </Stack>
    </div>
  )
}