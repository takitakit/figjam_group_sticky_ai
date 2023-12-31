export default {
  config: {
    title: 'Configuration',
    language: 'Language',
    apiKeyLabel: 'ChatGTP-4 API Key',
    apiKeyHelper: 'API Key for ChatGPT-4 to analyze contents of stickies',
    forcedContinuationLabel:
      'Continue processing as much as possible even if results are incomplete',
    forcedContinuationTip:
      "Depending on the number of selected fusions (amount of text) and the content, ChatGPT's API send/receive limit may cause the text to be trunked or the results to be unstable. We will sort as much as possible even under those conditions.",
    retryGroupingLabel: 'Re-grouping fusen that could not be grouped',
    retryGroupingTip:
      'In some cases, fusens are unintentionally excluded from the ChatGPT API response, in which case the grouping process is performed again. Regrouping extends the processing time because the API is requested again.',
    cancelButton: 'Cancel',
    saveButton: 'Save',
  },
  main: {
    executeButton: 'Group Selected Stickies',
    executeResult: 'Grouping of {{numOfStickies}} stickies is completed',
  },
  plugin: {
    error: {
      invalidSelection:
        'You must select at least 3 and no more than 50 stickies',
      discrepancyStickyNumber:
        'The number of selected stickies differs from the number of stickies in the analysis result. There is a problem with the analysis result.',
      apiStatusError: 'Error occurred during API request. status:',
      apiRequestError: 'API request failed. error:',
      apiResponseParseError: 'Failed to parse API response',
    },
  },
}
