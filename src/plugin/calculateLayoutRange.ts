import { StickyNodeMap } from '../type/default'

export const calculateLayoutRange = (nodes: StickyNodeMap) => {
  console.log('calculateLayoutRange')

  // Mapが空の場合、nullを返す
  // if (Object.keys(nodes).length === 0) {
  //   return null;
  // }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  // 各付箋に対して最小と最大の座標を確認し、必要に応じて更新
  for (let key in nodes) {
    let node = nodes[key]
    // console.log(`node[${key}] (x,y)=(${node.x},${node.y})`)

    if (node.x < minX) {
      minX = node.x
    }
    if (node.y < minY) {
      minY = node.y
    }
    if (node.x + node.width > maxX) {
      maxX = node.x + node.width
    }
    if (node.y + node.height > maxY) {
      maxY = node.y + node.height
    }
  }

  // 最小と最大のxおよびy座標のペアを返す
  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY },
  }
}
