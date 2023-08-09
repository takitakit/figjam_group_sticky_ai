export type StickyNodeMap = {
  [key: string]: StickyNode
}

export type Coodinate = {
  x: number
  y: number
}

export type GroupedIdea = {
  groupName: string
  ideaIDs: string[]
}

export type Config = {
  apiKey: string
  forcedContinuation: boolean
  language: 'en' | 'ja'
  retryGrouping: boolean
}

export type ChatGTPPrompt = {
  role: 'system' | 'assistant' | 'user'
  content: string
}
