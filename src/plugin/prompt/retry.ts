import { ChatGTPPrompt } from '../../type/default'

const prompt_ja: ChatGTPPrompt = {
  role: 'user',
  content: `
いくつかのアイデアが結果に含まれていないようです。
含まれていないアイデアを入力するので、もう一度グループ化を試みてください。
結果は、[ベースの出力]を参照して、内容が近しい場合は既存のグループにIDを追加してください。
内容が近しいグループがない場合は、新しいグループを作成してください。

ただし出力結果は 結果フォーマット に従います。それ以外の出力は一切禁止します。謝罪も不要です。

結果フォーマット: ###
group: <アイデアから抽出したグループ名>
ideaIDs: <ID>,<ID>,<ID>
###

ベースの出力: ###
{{PREV_OUTPUT}}
###

含まれていないアイデア: ###
{{IDEAS}}
###
`,
}

const prompt_en: ChatGTPPrompt = {
  role: 'user',
  content: `
It appears that some ideas are not included in the results.
Enter the ideas that are not included, so try grouping them again.
Refer to the [Base Output] for the results and add the ID to the existing group if the content is close.
If there is no group with similar content, create a new group.

However, the output will follow the result format. Any other output is prohibited. No apologies are required.

Result format: ###
group: <name of group extracted from ideas>
ideaIDs: <ID>,<ID>,<ID>,<ID>
###

Base Output: ###
{{PREV_OUTPUT}}
###

ideas that are not included: ###
{{IDEAS}}
###
`,
}

export default {
  ja: prompt_ja,
  en: prompt_en,
}
