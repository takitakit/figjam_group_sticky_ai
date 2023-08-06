import { StickyNodeMap, GroupedIdea } from './default.d'
import { calculateLayoutRange } from './calculateLayoutRange'

// 付箋をグループごとに再配置する
export async function rearrangeStickyNodes(
  nodeMap: StickyNodeMap,
  groupedIdeas: GroupedIdea[],
) {
  const layoutRange = calculateLayoutRange(nodeMap)
  console.log('layoutRange', layoutRange)

  let currentPos = {
    x: layoutRange.min.x,
    y: layoutRange.min.y,
  }

  const marginBetweenGroups = 100

  type GroupPosMap = {
    [key: number]: {
      x: number
      y: number
    }
  }
  const groupPosMap: GroupPosMap = {}

  let maxX = layoutRange.min.x
  groupedIdeas.map((group, index) => {
    console.log('group:', group.groupName)

    // グループごとに座標を記録
    groupPosMap[index] = {
      x: currentPos.x,
      y: currentPos.y,
    }

    // 下方向に付箋を配置する
    group.ideaIDs.forEach(id => {
      const node = nodeMap[id]

      if (currentPos.y + node.height > layoutRange.max.y + 50) {
        currentPos.x += node.width
        currentPos.y = layoutRange.min.y
      }

      if (currentPos.x + node.width > layoutRange.max.x) {
        console.warn(`node ${id} is out of range.`)
      }

      // レイアウト配置
      node.x = currentPos.x
      node.y = currentPos.y

      currentPos.y += node.height

      maxX = Math.max(maxX, node.x + node.width)
    })

    console.log(`maxX=${maxX}`)
    console.log(`currentPos (x,y)=(${currentPos.x},${currentPos.y})`)

    currentPos.y = layoutRange.min.y
    currentPos.x = maxX + marginBetweenGroups
  })

  // グループ単位のグループ名テキストを配置
  const promises = groupedIdeas.map(async (group, index) => {
    const pos = groupPosMap[index]

    // グループのテキストを配置
    const text = figma.createText()
    text.x = pos.x
    text.y = pos.y - 50

    await figma.loadFontAsync(text.fontName as any)
    text.characters = group.groupName
    text.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    text.fontSize = 20
  })

  await Promise.all(promises)
}