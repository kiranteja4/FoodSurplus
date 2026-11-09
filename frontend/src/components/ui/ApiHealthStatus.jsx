import { useEffect, useState } from 'react';
import { api } from '../../api/client.js';

function getLabel(status) {
  if (status.state === 'loading') return 'Checking service';
  if (status.state === 'error') return 'Service unavailable';
  const service = status.service || 'FoodSurplus API';
  if (status.database === 'connected') return `${service} · database connected`;
  return `${service} available · database ${status.database || 'status unknown'}`;
}

export default function ApiHealthStatus() {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState({ state: 'loading' });

  useEffect(() => {
    let isCurrent = true;
    setStatus({ state: 'loading' });

    api
      .get('/health')
      .then((response) => {
        if (!isCurrent) return;
        setStatus({
          state: 'success',
          service: response.data.service,
          database: response.data.database,
        });
      })
      .catch(() => {
        if (isCurrent) setStatus({ state: 'error' });
      });

    return () => {
      isCurrent = false;
    };
  }, [attempt]);

  const isHealthy = status.state === 'success' && status.database === 'connected';
  const tone = status.state === 'error' ? 'error' : isHealthy ? 'success' : 'info';

  return (
    <div className={`health-card health-card-${tone}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="flex min-w-0 items-start gap-3">
        <span className={`health-dot health-dot-${tone}`} aria-hidden="true" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold">{getLabel(status)}</span>
          {status.state === 'error' ? (
            <span className="mt-1 block text-xs leading-5 opacity-80">The platform service could not be reached.</span>
          ) : status.state === 'success' ? (
            <span className="mt-1 block text-xs leading-5 opacity-80">Live status from the FoodSurplus API.</span>
          ) : (
            <span className="mt-1 block text-xs leading-5 opacity-80">Contacting the FoodSurplus API…</span>
          )}
        </span>
      </span>
      {status.state === 'error' ? (
        <button
          type="button"
          className="health-retry"
          onClick={() => setAttempt((current) => current + 1)}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}
