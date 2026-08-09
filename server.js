const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('meetings.db');

// 議事録を保存するテーブルを作成(すでにあれば何もしない)
db.exec(`
  CREATE TABLE IF NOT EXISTS meetings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transcript TEXT NOT NULL,
    summary TEXT NOT NULL,
    todos TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// フロントエンド(index.html)から文字起こしテキストを受け取り、
// Ollamaに要約・タスク抽出をリクエストするエンドポイント
app.post('/summarize', async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || transcript.trim() === '') {
    return res.status(400).json({ error: '文字起こしテキストが空です' });
  }

  const prompt = `以下は会議の文字起こしです。この内容を要約し、実行すべきタスク(TODO)をリストアップしてください。

出力は必ず以下のJSON形式のみで返してください。JSON以外の文章は含めないでください。

{
  "summary": "会議の要約文",
  "todos": ["タスク1", "タスク2"]
}

文字起こし:
${transcript}`;

  try {
    const ollamaRes = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemma2',
        prompt: prompt,
        stream: false
      })
    });

    const data = await ollamaRes.json();
    const parsed = JSON.parse(data.response);

    // データベースに保存
    const stmt = db.prepare('INSERT INTO meetings (transcript, summary, todos) VALUES (?, ?, ?)');
    stmt.run(transcript, parsed.summary, JSON.stringify(parsed.todos));

    res.json({ raw: data.response });
  } catch (err) {
    console.error('Ollama連携エラー:', err);
    res.status(500).json({ error: 'Ollamaとの通信に失敗しました' });
  }
});

// 保存済みの議事録一覧を取得するエンドポイント
app.get('/meetings', (req, res) => {
  const rows = db.prepare('SELECT * FROM meetings ORDER BY created_at DESC').all();
  const meetings = rows.map(row => ({
    ...row,
    todos: JSON.parse(row.todos)
  }));
  res.json(meetings);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});