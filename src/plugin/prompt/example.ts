import { ChatGTPPrompt } from '../../type/default'

const prompt_ja: ChatGTPPrompt[] = [
  {
    role: 'user',
    content: `
1. 派生：DLP ChatGPTでの個人情報削除期待値：両方掛け合わせると99.99999%個人情報が削除できますとか言いたい
2. 新規事業提案agent 期待値：新規事業でなくともよいが、LLMが自立して思考を繰り返すAgentを社員に触って欲しい気がしている（複数Agentの対話なども）
3. 派生：Embeddings 行動ログの類似度検索（おなじ行動をしている人には同じレコメンド？） 期待値：事業への還元が可能かも？
4. 日本語の補完（copilot的な） 期待値：Github Copilotのさわり心地がよいので、例えばスカウト文などでも同じことができると良さそうだが
5. オンライン雑談の場を盛り上げつつ回してくれる君 ゆるい感じにその場のファシリをしてくれつつ雑談の種になりそうなトピックを投げてくれる
6. 議事録作成 （文字起こし＋GPT4) 文字起こしだけして、NotionをAPIで叩いてNotionAIで要約とかでもいいのかもMTGの内容を社外に出したくないという意味で、社内である程度利用される想定はありそう
7. Embddingで、ラボアプリの行動データからラボアプリの機能をレコメンドする
8. 生成AI使っての個人情報マスキング（名前・電話番号など）、検知を行う
`,
  },
  {
    role: 'assistant',
    content: `
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
`,
  },
  {
    role: 'user',
    content: `
1. イベントアプリは、SaaSマッチングアプリと統合する前にイベントアプリ上で型をSaaSマッチングアプリに合わせる, 沢山あるロールを整理するとかしたほうが良いかも、と思ってます。
2. イベントアプリのアプリケーションとしての作りの甘さ アプリ統合への影響の懸念
3. モブプロMTG、インターンのエンゲージメント目的だったはずなので、そちらに第一がよいかも？
4. スピード優先でpluginの実装はだいぶ雑にしているのでSaaSマッチングアプリのソースコードとして今後どう保守していくのかを考える必要がある
5. pluginのリリースなどでだいぶSaaSマッチングアプリとの調整で時間を使った感がある   
`,
  },
  {
    role: 'assistant',
    content: `
group: アプリケーション統合の懸念
ideaIDs: 1,2

group: モブプロMTGの再確認
ideaIDs: 3

group: pluginの進め方、保守性
ideaIDs: 4,5
`,
  },
]

const prompt_en: ChatGTPPrompt[] = [
  {
    role: 'user',
    content: `
1. derivation: personal information deletion expectation in DLP ChatGPT: I want to say that 99.9999999% of personal information can be deleted when both are multiplied together.
2. new business proposalagent Expected value: It doesn't have to be a new business, but I feel that LLM wants employees to touch Agents that are independent and repeat thinking (e.g. multiple Agents' dialogue).
3. Derivation: Embeddings Similarity search of behavior logs (same recommendation for people doing the same behavior?) Expectation: May be possible to return to business? 
4. Japanese complementation (like copilot) Expected value: Github Copilot is very comfortable, so it would be nice to be able to do the same with scouting messages, for example.
5. You, who can keep the online chit-chat going and keep it lively.
6. (Transcription + GPT4) It would be good to have a transcription, and then use the Notion API to summarize the minutes using NotionAI.
7. Embdding can be used to recommend lab app functions based on lab app behavior data.
8. use generated AI for personal information masking (name, phone number, etc.) and detection
`,
  },
  {
    role: 'assistant',
    content: `
group: privacy and security
ideaIDs: 1,8

group: Interaction with AI agents
ideaIDs: 2

group: Data analysis and recommendations
ideaIDs: 3,7

group: Text generation and completion
ideaIDs: 4

group: Communication enhancement
ideaIDs: 5

group: Documentation and minutes
ideaIDs: 6
`,
  },
  {
    role: 'user',
    content: `
1. think it would be better to adapt the event app to the SaaS matching app before integrating it with the SaaS matching app, or to organize the many roles in the event app.
2. lack of application of the event app Concerns about the impact on app integration
3. mobpro MTG, I believe the purpose was to engage interns, so maybe we should focus on that first?
4. Since the implementation of the plugin has been done in a very crude manner in order to prioritize speed, it is necessary to consider how to maintain the source code of the SaaS matching app in the future. (5) The release of the plugin has taken a lot of time.
5. I feel like I spent a lot of time coordinating with SaaS Matching App for the release of the plugin, etc.   
`,
  },
  {
    role: 'assistant',
    content: `
group: application integration concerns
ideaIDs: 1,2

group: mobpro MTG reconfirmation
ideaIDs: 3

group: how to proceed with plugin, maintainability
ideaIDs: 4,5
`,
  },
]

export default {
  ja: prompt_ja,
  en: prompt_en,
}
