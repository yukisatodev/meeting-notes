import { useState } from 'react';
import Recorder from './components/Recorder';
import Summary from './components/Summary';
import History from './components/History';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSaved = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="wrap">
      <div className="eyebrow">In Progress / Portfolio</div>
      <h1>AI議事録・タスク抽出ツール</h1>

      <Recorder onTranscriptChange={setTranscript} />
      <Summary transcript={transcript} onSaved={handleSaved} />
      <History refreshKey={refreshKey} />

      <a className="back-link" href="https://yukisatodev.github.io/">← Yuki Sato</a>
    </div>
  );
}

export default App;