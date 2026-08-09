import { useState, useEffect } from 'react';

function History({ refreshKey }) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/meetings');
      const data = await res.json();
      setMeetings(data);
      setLoaded(true);
    } catch (err) {
      console.error('履歴取得エラー:', err);
    } finally {
      setLoading(false);
    }
  };

  // 要約が保存されるたびに(refreshKeyが変わるたびに)、
  // すでに一覧を開いていた場合は自動で再取得する
  useEffect(() => {
    if (loaded) {
      loadHistory();
    }
  }, [refreshKey]);

  return (
    <div className="panel">
      <div className="panel-label">03 — History</div>
      <button onClick={loadHistory} disabled={loading}>
        過去の議事録を見る
      </button>

      {loading && <p className="hint">読み込み中...</p>}

      {loaded && meetings.length === 0 && (
        <p className="hint">まだ議事録が保存されていません。</p>
      )}

      <div className="history-list">
        {meetings.map((m) => (
          <div className="history-item" key={m.id}>
            <div className="date">{m.created_at}</div>
            <div className="summary">{m.summary}</div>
            <ul>
              {m.todos.map((todo, i) => (
                <li key={i}>{todo}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default History;