const prompt_ja = `
あるテーマについて複数のメンバーで話し合ったアイデアリストがあり、これをグループ化してアイデアの内容が近いグループを作りました。
具体例は ## グループ化されたアイデアの例 に掲載しています。

次に、同じテーマで追加のアイデアを出しました。
具体例は ## アイデア入力の例 に掲載しています。

これらのアイデアを一つずつ分析して、すでにあるグループの内容と比較し、一致度が高いと判断される場合はそのグループにIDを追加してください。
もしすべてのグループと内容が一致しない場合は、group: <グループ名> という形式で新しいグループを作成し、アイデアのIDを ideaIDs: <アイデアID>,<アイデアID>,... という形式で追加してください。
すべてのアイデアについて同様に分析とグループ化を行なってください。group: の部分は変えることは禁止します。
具体例を用いた結果の例は ## 結果の例 に掲載しています。

結果は、## グループ化されたアイデアのフォーマット に従い、それ以外の情報は出力しないでください。
実際の入力は ## アイデア入力、## グループ化されたアイデア入力 に記載します。

分析に問題があり、正しく結果を出力できない場合は 「Error」という文字列だけを出力してください。

## グループ化されたアイデアの例
group: データ分析とレコメンデーション
ideaIDs: 5,11,19,15

group: ドキュメントの要約と抽出
ideaIDs: 1,2,10,16,26,27,7,25

group: プライバシーとセキュリティ
ideaIDs: 12

group: スケジュール管理と最適化
ideaIDs: 13

group: AIエージェントとのインタラクション
ideaIDs: 14

group: プログラムのサポートと生成
ideaIDs: 17,21

group: マルチメディアの分析と生成
ideaIDs: 6,18,9,23

group: フィードバック分析と提案生成
ideaIDs: 24

## グループ化されたアイデアのフォーマット

group: <グループ名>
ideaIDs: <アイデアID>,<アイデアID>,...

グループの数だけ繰り返します。

## アイデア入力の例
3. RVCで社員の声を録音して、その社員のボイスチェンジャー作る機能
4. https://aws.amazon.com/jp/augmented-ai/  AWS A2Iを利用したAIのアウトプットのレビュー自動化  期待値：今後業務効率化を進めるに当たりAI活用を進めるなら、そのAIの出力が正しいかを判断するステップも自動化したい。AWS A2Iはそれができる...？
8. Bardマルチモーダル日本語で  期待値：具体的なユースケースは浮かばないが、可能性がかなり大きい技術なので、もしかするとBard日本語対応されるといらなくなるけど...
20. 軽量LLMに社内データ食わせてfine-tuning 期待値：社員向けではなく、技術ナレッジ貯めたいほうかも

## 追加アイデアリストのフォーマット
<ID>. <アイデア>

アイデアの数だけ繰り返します。

## 結果の例
group: データ分析とレコメンデーション
ideaIDs: 5,11,19,15

group: ドキュメントの要約と抽出
ideaIDs: 1,2,10,16,26,27,7,25

group: プライバシーとセキュリティ
ideaIDs: 12

group: スケジュール管理と最適化
ideaIDs: 13

group: AIエージェントとのインタラクション
ideaIDs: 14,8

group: プログラムのサポートと生成
ideaIDs: 17,21,4

group: マルチメディアの分析と生成
ideaIDs: 6,18,9,23,3

group: フィードバック分析と提案生成
ideaIDs: 24

group: 社内ナレッジデータベース
ideaIDs: 20

## アイデア入力
{{INPUT_IDEAS}}

## グループ化されたアイデア入力
{{GROUPT_IDEAS}}
`

const prompt_en = `
We have a list of ideas discussed by several members on a certain topic, which were grouped to create groups with similar idea content.
Specific examples can be found in ## Examples of grouped ideas.

Next, additional ideas were generated on the same theme.
Examples can be found in ## Examples of Idea Input.

Please analyze these ideas one by one, compare them to the content of the already existing groups, and if you find a good match, please add an ID to that group.
If the content does not match all groups, create a new group in the format group: <group name> and add the IDs of the ideas in the format ideaIDs: <idea ID>,<idea ID>,... and add the idea IDs in the form ideaIDs: <ideaID>,<ideaID>,....
Do the same analysis and grouping for all ideas, but do not change the group: part.
Example results with specific examples can be found in ## Example Results.

The results should follow the format ## Format for grouped ideas and no other information should be output.
The actual input is shown in ## Idea input, ## Grouped idea input.

If there is a problem with the analysis and the results cannot be output correctly, only the string "Error" should be output.

## Examples of grouped ideas
group: data analysis and recommendations
ideaIDs: 5,11,19,15

group: Document Summary and Extraction
ideaIDs: 1,2,10,16,26,27,7,25

group: Privacy and Security
ideaIDs: 12

group: scheduling and optimization
ideaIDs: 13

group: Interaction with AI agents
ideaIDs: 14

group: Program support and generation
ideaIDs: 17,21

group: Multimedia analysis and generation
ideaIDs: 6,18,9,23

group: Feedback analysis and proposal generation
ideaIDs: 24

## Format for grouped ideas
group: <group name
ideaIDs: <idea ID>,<idea ID>,...

Repeat for as many groups as there are.

## Examples of Idea Input
3. functionality to record an employee's voice with RVC and create a voice changer for that employee
4. https://aws.amazon.com/jp/augmented-ai/ Automate review of AI output using AWS A2I Expectation: If we are going to use AI to improve business efficiency in the future, we also want to automate the step of determining if the AI output is correct. AWS A2I can do that...?
8. Bard multimodal in Japanese Expected value: I can't think of a specific use case, but it is a technology with a lot of potential...
20. fine-tuning by feeding internal data to a lightweight LLM Expected value: Maybe not for employees, but to store technical knowledge...

## Format for additional ideas list
<ID>. <idea>.

Repeat for number of ideas.

## Example Results
group: data analysis and recommendations
ideaIDs: 5,11,19,15

group: Document Summary and Extraction
ideaIDs: 1,2,10,16,26,27,7,25

group: Privacy and Security
ideaIDs: 12

group: scheduling and optimization
ideaIDs: 13

group: Interaction with AI agents
ideaIDs: 14,8

group: Program support and generation
ideaIDs: 17,21,4

group: Multimedia analysis and generation
ideaIDs: 6,18,9,23,3

group: Feedback analysis and proposal generation
ideaIDs: 24

group: Internal knowledge database
ideaIDs: 20

## Idea input
{{INPUT_IDEAS}}

## Grouped idea input
{{GROUPT_IDEAS}}
`

export default {
  ja: prompt_ja,
  en: prompt_en,
}
