import {
  parseGroups,
  removeDuplicatedIdeaIDs,
  extractNonGroupedIdeas,
} from '../groupIdeas'
import { GroupedIdea } from '../../type/default'

test('グループ文字列が正常にパースできるか1', () => {
  const response: string = `
  group: AIによる自動化と効率化
  ideaIDs: 2,3
  
  group: 音声データの分析と活用
  ideaIDs: 1,4
  
  group: ミーティングの評価と分析
  ideaIDs: 5`

  const groups = parseGroups(response)

  expect(groups).toEqual([
    {
      groupName: 'AIによる自動化と効率化',
      ideaIDs: ['2', '3'],
    },
    {
      groupName: '音声データの分析と活用',
      ideaIDs: ['1', '4'],
    },
    {
      groupName: 'ミーティングの評価と分析',
      ideaIDs: ['5'],
    },
  ])
})

test('グループ文字列が正常にパースできるか2', () => {
  const response: string = `
  group:   AIによる自動化と効率化
  ideaIDs: 2,  3
  

  group: 音声データの分析と活用
  ideaIDs: 1,  4  
  
  group:   ミーティングの評価と分析
  ideaIDs:  5
  `

  const groups = parseGroups(response)

  expect(groups).toEqual([
    {
      groupName: 'AIによる自動化と効率化',
      ideaIDs: ['2', '3'],
    },
    {
      groupName: '音声データの分析と活用',
      ideaIDs: ['1', '4'],
    },
    {
      groupName: 'ミーティングの評価と分析',
      ideaIDs: ['5'],
    },
  ])
})

test('エラーを含むグループ文字列でエラーがスローされるか', () => {
  const response: string = `
  Error
  `

  expect(() => {
    parseGroups(response)
  }).toThrowError('plugin.error.apiResponseParseError')
})

test('グループデータから重複するIdeaIDsを削除できるか', () => {
  const groups: GroupedIdea[] = [
    {
      groupName: 'AIによる自動化と効率化',
      ideaIDs: ['2', '3'],
    },
    {
      groupName: '音声データの分析と活用',
      ideaIDs: ['1', '4', '5'],
    },
    {
      groupName: '動画データの分析と活用',
      ideaIDs: ['3', '2'],
    },
    {
      groupName: 'ミーティングの評価と分析',
      ideaIDs: ['5', '2', '6'],
    },
  ]

  expect(removeDuplicatedIdeaIDs(groups)).toEqual([
    {
      groupName: 'AIによる自動化と効率化',
      ideaIDs: ['2', '3'],
    },
    {
      groupName: '音声データの分析と活用',
      ideaIDs: ['1', '4', '5'],
    },
    {
      groupName: 'ミーティングの評価と分析',
      ideaIDs: ['6'],
    },
  ])
})

test('グループデータから非グループ化されたIdeaIDsを抽出できるか', () => {
  const groups: GroupedIdea[] = [
    {
      groupName: 'AIによる自動化と効率化',
      ideaIDs: ['2', '3'],
    },
    {
      groupName: '音声データの分析と活用',
      ideaIDs: ['1', '10'],
    },
    {
      groupName: 'ミーティングの評価と分析',
      ideaIDs: ['5'],
    },
  ]
  const ideaList = [
    '1. idea',
    '2. idea',
    '6. idea',
    '3. idea',
    '4. idea',
    '5. idea',
    '7. idea',
    '8. idea',
    '9. idea',
    '10. idea',
    '11. idea',
  ]

  expect(extractNonGroupedIdeas(ideaList, groups)).toEqual([
    '6. idea',
    '4. idea',
    '7. idea',
    '8. idea',
    '9. idea',
    '11. idea',
  ])
})
