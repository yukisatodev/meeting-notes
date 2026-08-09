const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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
    res.json({ raw: data.response });
  } catch (err) {
    console.error('Ollama連携エラー:', err);
    res.status(500).json({ error: 'Ollamaとの通信に失敗しました' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});