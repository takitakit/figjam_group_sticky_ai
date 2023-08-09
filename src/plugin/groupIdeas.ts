import systemPrompt from './prompt/system'
import examplePrompt from './prompt/example'
import retryPrompt from './prompt/retry'

// import retryPromptTemplate from './retryPrompt'
import { GroupedIdea, Config, ChatGTPPrompt } from '../type/default'
import { PluginError } from './pluginError'

// ChatGPTを使ってアイデアをグループ化する
export async function groupIdeas(
  idea: string[],
  config: Config,
): Promise<GroupedIdea[]> {
  // Promptの作成
  const prompt = createPrompt(idea, config)

  // ChatGPTによる応答の取得
  const response = await getResponse(prompt, config)

  // ChatGPTの応答からグループを抽出
  let groups = parseGroups(response)

  // グループから重複するIdeaIDsを削除
  groups = removeDuplicatedIdeaIDs(groups)

  // グループから漏れたIdeaIDsを抽出
  const nonGroupedIdeas = extractNonGroupedIdeas(idea, groups)

  // 漏れがあった場合に再度グルーピングを試みる
  if (nonGroupedIdeas.length > 0 && config.retryGrouping) {
    console.log('retry grouping... nonGroupedIdeas:', nonGroupedIdeas.length)
    // Retry用のPromptの作成
    const retryPrompt = createRetryPrompt(
      nonGroupedIdeas,
      prompt,
      response,
      config,
    )

    // ChatGPTによる応答の取得
    const retryResponse = await getResponse(retryPrompt, config)

    // ChatGPTの応答からグループを抽出
    groups = parseGroups(retryResponse)

    groups = removeDuplicatedIdeaIDs(groups)

    const retryNonGroupedIdeas = extractNonGroupedIdeas(idea, groups)
    console.log('retryNonGroupedIdeas', retryNonGroupedIdeas)
  }

  // 選択されたIdeaの数がグループ化されたIdeaの数と一致しない場合にエラーをスロー
  let resultNum = groups.reduce((acc, idea) => acc + idea.ideaIDs.length, 0)
  if (idea.length !== resultNum && !config.forcedContinuation) {
    throw new PluginError(
      'plugin.error.discrepancyStickyNumber',
      `selected: ${idea.length} result: ${resultNum}`,
    )
  }

  return groups
}

// Promptの作成
function createPrompt(idea: string[], config: Config): ChatGTPPrompt[] {
  const prompt = []

  prompt.push(systemPrompt[config.language])
  prompt.push(...examplePrompt[config.language])
  prompt.push({
    role: 'user',
    content: idea.join('\n'),
  })
  console.log('prompt', prompt)

  return prompt
}

function createRetryPrompt(
  idea: string[],
  prevPrompt: ChatGTPPrompt[],
  prevResponse: string,
  config: Config,
): ChatGTPPrompt[] {
  const prompt = [...prevPrompt]
  const retry = { ...(retryPrompt[config.language] as ChatGTPPrompt) }
  retry['content'] = retry['content'].replace('{{IDEAS}}', idea.join('\n'))
  retry['content'] = retry['content'].replace('{{PREV_OUTPUT}}', prevResponse)

  prompt.push({
    role: 'assistant',
    content: prevResponse,
  })
  prompt.push(retry)

  console.log('prompt', prompt)

  return prompt
}

// ChatGPTによる応答の取得
async function getResponse(
  prompt: ChatGTPPrompt[],
  config: Config,
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: prompt,
      max_tokens: 1024,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.6,
      stop: [' Human:', ' AI:'],
    }),
  })

  // エラーハンドリング
  if (!response.ok) {
    throw new PluginError('plugin.error.apiStatusError', `${response.status}`)
  }

  const data = await response.json()
  const res = data.choices[0].message.content

  console.log('ChatGTP Response', res)

  return res
}

// ChatGPTの応答からグループを抽出
export function parseGroups(input: string): GroupedIdea[] {
  if (input.trim().startsWith('Error')) {
    throw new Error('plugin.error.apiResponseParseError')
  }

  const groups: GroupedIdea[] = []
  const lines = input.split('\n')
  // console.log('lines', lines)

  let groupName = ''
  let ideaIDs: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('group:')) {
      groupName = line.split(':')[1].trim()
    } else if (line.startsWith('ideaIDs:')) {
      ideaIDs = line
        .split(':')[1]
        .split(',')
        .map(id => id.trim())

      groups.push({
        groupName,
        ideaIDs,
      })

      // Reset for the next group
      groupName = ''
      ideaIDs = []
    }
  }

  return groups
}

// グループから重複するIdeaIDsを削除
export function removeDuplicatedIdeaIDs(groups: GroupedIdea[]): GroupedIdea[] {
  const seenIDs = new Set<string>()
  const newGroups: GroupedIdea[] = []

  for (const group of groups) {
    const uniqueIDs = group.ideaIDs.filter(id => !seenIDs.has(id))

    if (uniqueIDs.length > 0) {
      newGroups.push({
        groupName: group.groupName,
        ideaIDs: uniqueIDs,
      })

      uniqueIDs.forEach(id => seenIDs.add(id))
    }
  }

  return newGroups
}

// グループから漏れたIdeaIDsを抽出
export function extractNonGroupedIdeas(
  ideas: string[],
  groupedIdeas: GroupedIdea[],
): string[] {
  // const allIDs = ideas.map(idea => idea.split('.')[0].trim())

  let groupedIDs: string[] = []
  for (let group of groupedIdeas) {
    groupedIDs = groupedIDs.concat(group.ideaIDs)
  }

  return ideas.filter(idea => !groupedIDs.includes(idea.split('.')[0].trim()))

  // const nonGroupedIDs = allIDs.filter(id => !groupedIDs.includes(id))

  // return nonGroupedIDs
}

// 漏れがあった場合に再度グルーピングを試みる
// async function retryGroupIdeas(
//   idea: string[],
//   prevPrompt: ChatGTPPrompt[],
//   config: Config,
// ): Promise<GroupedIdea[]> {
//   const prompt = createRetryPrompt(idea, prevPrompt, config)

//   const response = await getResponse(prompt, config)

//   let groups = parseGroups(response)
//   groups = removeDuplicatedIdeaIDs(groups)

//   return groups
// }
