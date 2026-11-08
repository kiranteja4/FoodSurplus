import { useEffect, useState } from 'react';
import { api } from './api/client.js';

export default function App() {
  const [status, setStatus] = useState('checking...');
  useEffect(() => {
    api
      .get('/health')
      .then((r) => setStatus(`API ${r.data.service}, database ${r.data.database}`))
      .catch(() => setStatus('API not reachable'));
  }, []);
  return (
    <main className='min-h-screen grid place-items-center p-6'>
      <div className='max-w-md text-center'>
        <h1 className='font-display text-4xl font-bold text-forest-700'>FoodSurplus</h1>
        <p className='mt-2 text-ink/70'>
          Reducing Food Waste. Connecting Surplus with Those in Need.
        </p>
        <p className='mt-6 rounded-lg bg-white px-4 py-3 text-sm shadow-sm'>{status}</p>
      </div>
    </main>
  );
}
