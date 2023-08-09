import { StickyNodeMap, Config } from '../type/default'
import { groupIdeas } from './groupIdeas'
import { rearrangeStickyNodes } from './rearrangeStickyNodes'
import { PluginError } from './pluginError'

// figma.clientStorage.deleteAsync('CONFIG')
if (process.env.NODE_ENV === 'production') {
  console.log = function () {} // 何もしない関数に上書き
}

figma.showUI(__html__, { width: 300, height: 380 })

figma.ui.onmessage = msg => handleUIMessage(msg)

function handleUIMessage(msg: any) {
  console.log(`${msg.type} message received`)

  switch (msg.type) {
    case 'load-config':
      loadConfig()
      break
    case 'save-config':
      saveConfig(msg.data)
      break
    case 'execute':
      execute()
      break
  }
}

async function execute() {
  let CONFIG = await figma.clientStorage.getAsync('CONFIG')
  const stickyNodeMap: StickyNodeMap = {}

  try {
    validateConfig(CONFIG)

    const ideaList = extractStickyNodeText(stickyNodeMap)

    const groupedIdeas = await groupIdeas(ideaList, CONFIG)

    await rearrangeStickyNodes(stickyNodeMap, groupedIdeas)

    figma.ui.postMessage({
      type: 'execute-done',
      data: { numberOfStickies: Object.keys(stickyNodeMap).length },
    })
  } catch (err) {
    handleError(err)
  }
}

// 設定値の読み込み
function loadConfig() {
  figma.clientStorage.getAsync('CONFIG').then(config => {
    figma.ui.postMessage({
      type: 'load-config-done',
      data: config,
    })
  })
}

// 設定値の保存
function saveConfig(config: Config) {
  console.log('config', config)
  figma.clientStorage.setAsync('CONFIG', config).then(() => {
    figma.ui.postMessage({ type: 'save-config-done' })
  })
}

// 設定のバリデーション
function validateConfig(config: Config | undefined) {
  if (!config?.apiKey) {
    throw new Error('plugin.error.apiKeyNotSet')
  }
}

// 選択されたふせんのテキストを抽出
function extractStickyNodeText(stickyNodeMap: StickyNodeMap): string[] {
  const selectedNodes = figma.currentPage.selection.filter(
    (node): node is StickyNode =>
      node.type === 'STICKY' && node.text.characters.trim() !== '',
  )

  // 選択されたふせんの数が不正
  if (selectedNodes.length < 3 || selectedNodes.length > 50) {
    throw new PluginError(
      'plugin.error.invalidSelection',
      `selected: ${selectedNodes.length}`,
    )
  }

  // 選択されたふせんのテキストを抽出
  return selectedNodes.map((node, index) => {
    const id = index + 1
    stickyNodeMap[id] = node

    let text = node.text.characters ?? ''
    return `${id}. ${text.replace(/\n/g, ' ')}`
  })
}

// エラー処理
function handleError(err: any) {
  console.log('err', err)

  figma.ui.postMessage({
    type: 'execute-error',
    data: {
      message: err.message,
      originalError: err.originalError,
    },
  })
}
