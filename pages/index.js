// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/log');
      const data = await res.json();
      setLogs(data.reverse());
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Webhook Request Dashboard</h1>
      {logs.length === 0 && <p>No requests yet...</p>}
      {logs.map((log, idx) => (
        <div key={idx} style={{ background: '#222', color: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 }}>
          <p><strong>Time:</strong> {log.time}</p>
          <p><strong>File:</strong> {log.fileName}</p>
          <pre style={{ background: '#111', padding: 10, borderRadius: 5 }}>{log.info}</pre>
        </div>
      ))}
    </main>
  );
}
