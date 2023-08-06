import promptTemplate from './prompt'
import { GroupedIdea, Config } from './default.d'
import { PluginError } from './PluginError'

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

  return parseGroups(res)
}

// ChatGPTのレスポンスをパースする
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

  console.log('groups', groups)

  return groups
}
