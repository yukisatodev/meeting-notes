# AI議事録・タスク抽出ツール

会議の音声をリアルタイムで文字起こしし、その内容をAIが要約・タスク抽出するツールです。
**クラウドAPIを一切使わず、無料で完結する構成**にこだわって開発しました。

## 特徴

- 🎙️ ブラウザの音声認識機能で、話した内容をリアルタイムに文字起こし
- 🤖 ローカルで動くAI(Ollama)が要約とTODOリストを自動生成
- 💾 議事録は自動でデータベースに保存され、後から一覧で確認可能
- 💰 従量課金のクラウドAPIは不使用。完全無料・オフラインでも動作

## 使用技術

| 分野 | 技術 |
|---|---|
| フロントエンド | HTML / CSS / JavaScript |
| 音声認識 | Web Speech API |
| バックエンド | Node.js / Express |
| AI要約・タスク抽出 | Ollama (gemma2) |
| データベース | SQLite (better-sqlite3) |

## セットアップ方法

### 1. 前提ソフトのインストール

- [Node.js](https://nodejs.org/) (LTS版)
- [Ollama](https://ollama.com/)

### 2. Ollamaでモデルをダウンロード

```bash
ollama run gemma2
```

初回はモデル(約5.4GB)のダウンロードが始まります。ダウンロード後は `/bye` で一旦抜けてOKです。

### 3. リポジトリをクローンして依存パッケージをインストール

```bash
git clone https://github.com/yukisatodev/meeting-notes.git
cd meeting-notes
npm install
```

### 4. サーバーを起動

```bash
node server.js
```

`サーバー起動: http://localhost:3000` と表示されればOKです。

### 5. index.htmlをブラウザで開く

`index.html` をダブルクリックしてブラウザ(Google Chrome推奨)で開きます。

## 使い方

1. 「録音開始」を押して話す(初回はマイクの使用許可が必要です)
2. 「停止」を押して録音終了
3. 「要約・タスク抽出」を押すと、AIが要約とタスクリストを生成
4. 「過去の議事録を見る」で、過去に保存した議事録を一覧で確認できます

## 今後の展望

- Reactでのリニューアル
- ログイン機能を追加し、複数ユーザー・チームでの利用に対応
- UIのさらなる改善

## 作者

[Yuki Sato](https://yukisatodev.github.io/)