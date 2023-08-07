const prompt_ja: string = `
特定のテーマにおける議論で、参加者から出された複数のアイデアについて、似た内容持つものをグルーピングしてください。
一つずつのアイデアの先頭にはIDが付与されており、グルーピングの結果としては、観点とともに該当するアイデアのIDを列挙してください。
結果は ## 結果フォーマット 内に記載のフォーマットに従ってください。
結果に含まれるテキストは日本語で記載してください。

結果に含むアイデアIDはにカンマ区切りで記述し、全て一行で記載してください。
実際のグルーピングの対象となるアイデアは、## アイデア入力 というテキストのあとに列挙しているので、
中身を分析してグルーピングを行なってください。
ただし、必ず ## アイデア入力 で指定したIDがすべて結果の中に含まれ、かつ数が一致するようにしてください。重複は許可しません。

アイデアの例は ## アイデアの例 に、結果の出力のサンプルを ## アイデアの例に対しての結果出力例 にそれぞれ記載していますので参考にしてください。

類似点が多いものをまとめて見やすくするためなので、類似点が少ない場合は無理にグルーピングしないでください。
グルーピングが難しく、結果フォーマットに従って出力ができない場合は、「Error」という文字列だけを出力してください。

## 結果フォーマット
group: <アイデアから抽出したグループ名>
ideaIDs: <ID>,<ID>,<ID>

## アイデアの例1
- 1. 派生：DLP ChatGPTでの個人情報削除期待値：両方掛け合わせると99.99999%個人情報が削除できますとか言いたい
- 2. 新規事業提案agent 期待値：新規事業でなくともよいが、LLMが自立して思考を繰り返すAgentを社員に触って欲しい気がしている（複数Agentの対話なども）
- 3. 派生：Embeddings 行動ログの類似度検索（おなじ行動をしている人には同じレコメンド？） 期待値：事業への還元が可能かも？
- 4. 日本語の補完（copilot的な） 期待値：Github Copilotのさわり心地がよいので、例えばスカウト文などでも同じことができると良さそうだが
- 5. オンライン雑談の場を盛り上げつつ回してくれる君 ゆるい感じにその場のファシリをしてくれつつ雑談の種になりそうなトピックを投げてくれる
- 6. 議事録作成 （文字起こし＋GPT4) 文字起こしだけして、NotionをAPIで叩いてNotionAIで要約とかでもいいのかもMTGの内容を社外に出したくないという意味で、社内である程度利用される想定はありそう
- 7. Embddingで、ラボアプリの行動データからラボアプリの機能をレコメンドする
- 8. 生成AI使っての個人情報マスキング（名前・電話番号など）、検知を行う

## アイデアの例1に対しての結果出力例
group: プライバシーとセキュリティ
ideaIDs: 1,8

group: AIエージェントとのインタラクション
ideaIDs: 2

group: データ分析とレコメンデーション
ideaIDs: 3,7

group: テキスト生成と補完
ideaIDs: 4

group: コミュニケーションの強化
ideaIDs: 5

group: ドキュメンテーションと議事録作成
ideaIDs: 6

## アイデアの例2
- 1. イベントアプリは、SaaSマッチングアプリと統合する前にイベントアプリ上で型をSaaSマッチングアプリに合わせる, 沢山あるロールを整理するとかしたほうが良いかも、と思ってます。
- 2. イベントアプリのアプリケーションとしての作りの甘さ アプリ統合への影響の懸念
- 3. モブプロMTG、インターンのエンゲージメント目的だったはずなので、そちらに第一がよいかも？
- 4. スピード優先でpluginの実装はだいぶ雑にしているのでSaaSマッチングアプリのソースコードとして今後どう保守していくのかを考える必要がある
- 5. pluginのリリースなどでだいぶSaaSマッチングアプリとの調整で時間を使った感がある

## アイデアの例2に対しての結果出力例
group: イベントアプリの機能整理・リファクタリング
ideaIDs: 1,2

group: モブプロMTGの運用
ideaIDs: 3

group: pluginsの効率化
ideaIDs: 4,5

## アイデア入力
`

const prompt_en: string = `
Please group multiple ideas that have similar perspectives that have been raised by the participants in a discussion on a particular topic.
Each idea is prefixed with an ID, and the grouping result should list the ID of the corresponding idea along with the point of view.
The results should follow the format described in ## Results Format.
Text included in the results should be written in English.

Idea IDs to be included in the results should be separated by commas and all should be listed on a single line.
The ideas for the actual grouping are listed after the text ## Idea Entry,
Please analyze the content and grouping.
However, be sure that all IDs specified in the ## Idea Entry are included in the results and that the numbers match. Duplicates are not allowed.

Please refer to ## Idea Examples for examples of ideas and ## Sample Result Outputs for Idea Examples for reference.

If there are only a few similarities, please do not group them.
If grouping is difficult and the results cannot be output according to the result format, please output only the string "Error".

## Results format
group: <name of group extracted from ideas>
ideaIDs: <ID>,<ID>,<ID>

## Idea Examples 1
- 1. derivation: expected value of personal information deletion in DLP ChatGPT: I want to say that 99.9999999% of personal information can be deleted if both are multiplied together.
- 2. new business proposalagent Expected value: It doesn't have to be a new business, but I have a feeling that LLM wants employees to touch Agents that are independent and repeat thinking (e.g. multiple Agents' dialogue).
- 3. Derivation: Embeddings Similarity search of behavior logs (same recommendation for people doing the same behavior?) Expectation: May be possible to return to business?
- 4. English complementation (like copilot) Expected value: Github Copilot is very comfortable, so it would be nice to be able to do the same with scouting messages, for example.
- 5. You, who can keep the online chit-chat going and keep it lively.
- 6. Preparation of meeting minutes (Transcription + GPT4) It would be good to have a transcription, and then use the Notion API to summarize the minutes using NotionAI.
- 7. Embdding can be used to recommend lab app functions based on lab app behavior data.
- 8. use generated AI for personal information masking (name, phone number, etc.) and detection

## Sample Result Outputs for Idea Examples 1
group: privacy and security
ideaIDs: 1,8

group: Interaction with AI agents
ideaIDs: 2

group: Data analysis and recommendation
ideaIDs: 3,7

group: Text generation and completion
ideaIDs: 4

group: Communication enhancement
ideaIDs: 5

group: Documentation and minutes
ideaIDs: 6

## Idea Examples 2
- 1. I think it would be better to adapt the event app to the SaaS matching app before integrating it with the SaaS matching app, or to organize the many roles in the event app. 2.
- 2. lack of application of the event app Concerns about the impact on app integration
- 3. mobpro MTG, I believe the purpose was to engage interns, so maybe we should focus on that first?
- 4. Since the implementation of the plugin has been done in a very crude manner in order to prioritize speed, it is necessary to consider how to maintain the source code of the SaaS matching app in the future. (5) The release of the plugin has taken a lot of time.
- 5. I feel like I spent a lot of time coordinating with SaaS Matching App for the release of the plugin, etc.

## Sample Result Outputs for Idea Examples 2
group: event app functional reorganization/refactoring
ideaIDs: 1,2

group: MobPro MTG operations
ideaIDs: 3

group: improve efficiency of plugins
ideaIDs: 4,5

## Idea Entry
`

export default {
  ja: prompt_ja,
  en: prompt_en,
}
