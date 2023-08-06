export default {
  config: {
    title: '設定',
    language: '言語',
    apiKeyLabel: 'ChatGTP-4 API Key',
    apiKeyHelper: 'ふせんの内容を分析するためのChatGPT-4用APIキー',
    forcedContinuationLabel: '分析結果が中断されても処理を継続',
    forcedContinuationTip:
      '選択したふせんの数（テキスト量）によっては、ChatGPTのAPI送受信制限を超える場合があります。その場合、部分的に切り詰められた不完全な結果を受け取ることになります。',
    cancelButton: 'キャンセル',
    saveButton: '保存',
  },
  main: {
    executeButton: '選択されたふせんをグループ化する',
    executeResult: '{{numOfStickies}}個のふせんをグループ化しました',
  },
  plugin: {
    error: {
      invalidSelection: '3つ以上のふせんを選択する必要があります',
      discrepancyStickyNumber:
        '選択されたふせんの数と、解析結果のふせんの数が異なります。解析結果に問題があります。',
      apiStatusError: 'APIレスポンスに問題がありました。 status:',
      apiRequestError: 'APIリクエスト中に問題がありました。 error:',
      apiResponseParseError: 'APIレスポンスのパースに失敗しました。',
    },
  },
}
