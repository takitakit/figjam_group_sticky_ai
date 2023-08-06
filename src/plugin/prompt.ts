const prompt = `特定のテーマにおける議論で、参加者から出された複数のアイデアについて、似た観点をもつものをグルーピングしてください。
一つずつのアイデアの先頭にはIDが付与されており、グルーピングの結果としては、観点とともに該当するアイデアのIDを列挙してください。
結果は ## 結果フォーマット 内に記載のフォーマットに従ってください。

結果に含むアイデアIDはにカンマ区切りで記述し、全て一行で記載してください。
実際のグルーピングの対象となるアイデアは、## アイデア入力 というテキストのあとに列挙しているので、
中身を分析してグルーピングを行なってください。

アイデアの例は ## アイデアの例 に、結果の出力のサンプルを ## アイデアの例に対しての結果出力例 にそれぞれ記載していますので参考にしてください。

類似点が多いものをまとめて見やすくするためなので、類似点が少ない場合は無理にグルーピングしないでください。
グルーピングが難しく、結果フォーマットに従って出力ができない場合は、「エラー」という文字列だけを出力してください。

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

export default prompt
