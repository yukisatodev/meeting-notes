import { useState, useRef } from 'react';

function Recorder({ onTranscriptChange }) {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported] = useState(
    !!(window.SpeechRecognition || window.webkitSpeechRecognition)
  );
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += text + '\n';
        } else {
          interimTranscript += text;
        }
      }
      const combined = finalTranscriptRef.current + interimTranscript;
      setTranscript(combined);
      onTranscriptChange(combined);
    };

    recognition.onerror = (event) => {
      console.error('音声認識エラー:', event.error);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  if (!isSupported) {
    return (
      <div className="panel">
        <div className="panel-label">01 — Recording</div>
        <p>このブラウザは音声認識に対応していません。Google Chromeでお試しください。</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="panel-label">01 — Recording</div>
      <button className={isRecording ? 'recording' : ''} onClick={handleClick}>
        {isRecording ? '停止' : '録音開始'}
      </button>
      <div className="transcript-box">
        {transcript || 'ここに文字起こしが表示されます'}
      </div>
    </div>
  );
}

export default Recorder;
