export default {
  config: {
    title: 'Configuration',
    language: 'Language',
    apiKeyLabel: 'ChatGTP-4 API Key',
    apiKeyHelper: 'API Key for ChatGPT-4 to analyze contents of stickies',
    forcedContinuationLabel:
      'Continues processing even if analysis results are interrupted',
    forcedContinuationTip:
      "Depending on the number of selected stickies (amount of text), ChatGPT's API sending and receiving limits may be exceeded. In that case, you will receive partially trunked and incomplete results.",
    cancelButton: 'Cancel',
    saveButton: 'Save',
  },
  main: {
    executeButton: 'Group Selected Stickies',
  },
  plugin: {
    error: {
      invalidSelection: '3 or more stickies must be selected',
    },
  },
}
