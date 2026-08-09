import { useState } from 'react';

function Summary({ transcript, onSaved }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSummarize = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('http://localhost:3000/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = await res.json();
      const parsed = JSON.parse(data.raw);
      setResult(parsed);
      onSaved?.();
    } catch (err) {
      setError('エラーが発生しました: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-label">02 — Summary</div>
      <button onClick={handleSummarize} disabled={loading || !transcript}>
        要約・タスク抽出
      </button>

      {loading && <p className="hint">要約中...(少し時間がかかります)</p>}
      {error && <p className="hint">{error}</p>}

      {result && (
        <div className="result">
          <h3>要約</h3>
          <p>{result.summary}</p>
          <h3>タスク</h3>
          <ul>
            {result.todos.map((todo, i) => (
              <li key={i}>{todo}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Summary;