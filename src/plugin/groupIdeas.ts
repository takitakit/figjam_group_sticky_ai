import promptTemplate from './prompt'
import retryPromptTemplate from './retryPrompt'
import { GroupedIdea, Config } from '../type/default'
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
  const nonGroupedIDs = extractNonGroupedIdeaIDs(idea, groups)

  // 漏れがあった場合に再度グルーピングを試みる
  if (nonGroupedIDs.length > 0 && config.retryGrouping) {
    groups = await retryGroupIdeas(idea, response, config)
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
function createPrompt(idea: string[], config: Config): string {
  const prompt = promptTemplate[config.language] + idea.join('\n')
  return prompt
}

// ChatGPTによる応答の取得
async function getResponse(prompt: string, config: Config): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
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

  return res
}

// ChatGPTの応答からグループを抽出
function parseGroups(input: string): GroupedIdea[] {
  if (input.trim().startsWith('Error')) {
    throw new Error('plugin.error.apiResponseParseError')
  }

  const groups: GroupedIdea[] = []
  const lines = input.split('\n')

  let groupName = ''
  let ideaIDs: string[] = []

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('group:')) {
      groupName = lines[i].split(':')[1].trim()
    } else if (lines[i].startsWith('ideaIDs:')) {
      ideaIDs = lines[i]
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
function removeDuplicatedIdeaIDs(groups: GroupedIdea[]): GroupedIdea[] {
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
function extractNonGroupedIdeaIDs(
  ideas: string[],
  groupedIdeas: GroupedIdea[],
): string[] {
  const allIDs = ideas.map(idea => idea.split('.')[0].trim())

  let groupedIDs: string[] = []
  for (let group of groupedIdeas) {
    groupedIDs = groupedIDs.concat(group.ideaIDs)
  }

  const nonGroupedIDs = allIDs.filter(id => !groupedIDs.includes(id))

  return nonGroupedIDs
}

// 漏れがあった場合に再度グルーピングを試みる
async function retryGroupIdeas(
  idea: string[],
  groupedIdeas: string,
  config: Config,
): Promise<GroupedIdea[]> {
  let prompt = retryPromptTemplate[config.language]
  prompt = prompt.replace('{{INPUT_IDEAS}}', idea.join('\n'))
  prompt = prompt.replace('{{GROUPT_IDEAS}}', groupedIdeas)

  const response = await getResponse(prompt, config)

  let groups = parseGroups(response)
  groups = removeDuplicatedIdeaIDs(groups)

  return groups
}
