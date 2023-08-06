import { StickyNodeMap, Config } from './default.d'
import { groupIdeas } from './groupIdeas'
import { rearrangeStickyNodes } from './rearrangeStickyNodes'
import { PluginError } from './PluginError'

figma.showUI(__html__, { width: 300, height: 330 })

figma.ui.onmessage = msg => {
  console.log(`${msg.type} message received`)

  if (msg.type === 'load-config') {
    // Send config to UI
    figma.clientStorage.getAsync('CONFIG').then(config => {
      figma.ui.postMessage({
        type: 'load-config-done',
        data: config,
      })
    })
  } else if (msg.type === 'save-config') {
    // Save apikey to client storage
    const config = msg.data
    console.log('config', config)

    figma.clientStorage.setAsync('CONFIG', config).then(() => {
      figma.ui.postMessage({ type: 'save-config-done' })
    })
  } else if (msg.type === 'execute') {
    main()
  }
}

function main() {
  let CONFIG: Config
  const stickyNodeMap: StickyNodeMap = {}

  figma.clientStorage
    .getAsync('CONFIG')
    .then(config => {
      if (!config?.apiKey) {
        figma.ui.postMessage({
          type: 'execute-error',
          data: { message: 'API Key is not set' },
        })
        return
      }

      CONFIG = config
    })
    .then(() => {
      // Check if sticky node is selected
      const selectedNodes = figma.currentPage.selection.filter(
        (node): node is StickyNode => node.type === 'STICKY',
      )
      console.log(`selectedNodes ${selectedNodes.length} stickies`)
      if (selectedNodes.length < 3 || selectedNodes.length > 50) {
        throw new PluginError(
          'plugin.error.invalidSelection',
          `selected: ${selectedNodes.length}`,
        )
      }

      // Extract text of selected StickyNode with ID
      return selectedNodes.map((node, index) => {
        const id = index + 1
        stickyNodeMap[id] = node

        let text = node.text.characters ?? ''
        text = text.replace(/\n/g, ' ')

        return `${id}. ${text}`
      })
    })
    .then(idea => {
      return groupIdeas(idea, CONFIG)
    })
    .then(res => {
      console.log('CONFIG', CONFIG)
      let resultNum = res.reduce((acc, idea) => acc + idea.ideaIDs.length, 0)
      if (
        Object.keys(stickyNodeMap).length !== resultNum &&
        !CONFIG.forcedContinuation
      ) {
        const debug = []
        res.map(idea => {
          debug.push(...idea.ideaIDs)
        })
        console.log('debug', debug)

        // The number of selected stickies differs from the number of stickies in the analysis results.
        // throw new Error('plugin.error.discrepancyStickyNumber')
        throw new PluginError(
          'plugin.error.discrepancyStickyNumber',
          `selected: ${Object.keys(stickyNodeMap).length} result: ${resultNum}`,
        )
      }

      return rearrangeStickyNodes(stickyNodeMap, res)
    })
    .then(() => {
      figma.ui.postMessage({
        type: 'execute-done',
        data: { numberOfStickies: Object.keys(stickyNodeMap).length },
      })
    })
    .catch(err => {
      console.log('err', err)

      figma.ui.postMessage({
        type: 'execute-error',
        data: {
          message: err.message,
          originalError: err.originalError,
        },
      })
    })
}
