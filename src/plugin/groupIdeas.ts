import promptTemplate from './prompt'
import retryPromptTemplate from './retryPrompt'
import { GroupedIdea, Config } from './default.d'
import { PluginError } from './pluginError'

// group ideas using ChatGPT
export async function groupIdeas(
  idea: string[],
  config: Config,
): Promise<GroupedIdea[]> {
  console.log('groupIdeas')

  const prompt = promptTemplate[config.language] + idea.join('\n')
  console.log('prompt', prompt)

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
    .catch(error => {
      throw new PluginError('plugin.error.apiRequestError', `${error.message}`)
    })
    .then(response => {
      if (!response.ok) {
        throw new PluginError(
          'plugin.error.apiStatusError',
          `${response.status}`,
        )
      }
      return response
    })

  const data = await response.json()
  const res = data.choices[0].message.content

  console.log('response', res)

  let groups = parseGroups(res)
  groups = removeDuplicatedIdeaIDs(groups)

  let resultNum = groups.reduce((acc, idea) => acc + idea.ideaIDs.length, 0)
  if (idea.length !== resultNum && !config.forcedContinuation) {
    // if (true) {
    const debug = []
    groups.map(idea => {
      debug.push(...idea.ideaIDs)
    })
    console.log('debug', debug)

    // The number of selected stickies differs from the number of stickies in the analysis results.
    throw new PluginError(
      'plugin.error.discrepancyStickyNumber',
      `selected: ${idea.length} result: ${resultNum}`,
    )
  }

  const nonGroupedIDs = extractNonGroupedIdeaIDs(idea, groups)
  if (nonGroupedIDs.length > 0) {
    // IDに漏れがある
    // 漏れがあったアイデアについて、再度グルーピングを試みる
    groups = await retryGroupIdeas(idea, res, config)
  }

  return groups
}

// ChatGPTの結果をパースする
function parseGroups(input: string): GroupedIdea[] {
  console.log('parseGroups')

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

// remove duplicate IdeaIDs
function removeDuplicatedIdeaIDs(groups: GroupedIdea[]): GroupedIdea[] {
  // Set to store IDs confirmed so far
  const seenIDs = new Set<string>()

  // Create a new group array
  const newGroups: GroupedIdea[] = []

  for (const group of groups) {
    // Filter for IDs in the current group that have not yet been confirmed
    const uniqueIDs = group.ideaIDs.filter(id => !seenIDs.has(id))

    // If uniqueIDs is not empty, add as a new group
    if (uniqueIDs.length > 0) {
      newGroups.push({
        groupName: group.groupName,
        ideaIDs: uniqueIDs,
      })

      // If uniqueIDs is not empty, add IDs contained in uniqueIDs as a new group to seenIDs
      uniqueIDs.forEach(id => seenIDs.add(id))
    }
  }

  return newGroups
}

// グループから漏れたアイデアIDを抽出する
function extractNonGroupedIdeaIDs(
  ideas: string[],
  groupedIdeas: GroupedIdea[],
): string[] {
  // まずはすべてのIDを取得
  const allIDs = ideas.map(idea => idea.split('.')[0].trim())

  // グループ化されているIDを取得
  let groupedIDs: string[] = []
  for (let group of groupedIdeas) {
    groupedIDs = groupedIDs.concat(group.ideaIDs)
  }

  // グループ化されていないIDをフィルタリング
  const nonGroupedIDs = allIDs.filter(id => !groupedIDs.includes(id))

  return nonGroupedIDs
}

async function retryGroupIdeas(
  idea: string[],
  groupedIdeas: string,
  config: Config,
): Promise<GroupedIdea[]> {
  console.log('retryGroupIdeas')

  let prompt = retryPromptTemplate[config.language]
  // アイデア入力を置き換える
  prompt = prompt.replace('{{INPUT_IDEAS}}', idea.join('\n'))
  prompt = prompt.replace('{{GROUPT_IDEAS}}', groupedIdeas)
  console.log('prompt', prompt)

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
    .catch(error => {
      throw new PluginError('plugin.error.apiRequestError', `${error.message}`)
    })
    .then(response => {
      if (!response.ok) {
        throw new PluginError(
          'plugin.error.apiStatusError',
          `${response.status}`,
        )
      }
      return response
    })

  const data = await response.json()
  const res = data.choices[0].message.content

  console.log('response', res)

  let groups = parseGroups(res)
  groups = removeDuplicatedIdeaIDs(groups)

  console.log('groups', groupedIdeas)

  return groups
}
