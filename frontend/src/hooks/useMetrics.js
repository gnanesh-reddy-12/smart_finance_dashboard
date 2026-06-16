import { useState, useEffect } from 'react';

// Module-level cache — only one fetch across all components
let _cache = null;

export const useMetrics = () => {
  const [metrics, setMetrics] = useState(_cache);
  const [loading, setLoading] = useState(!_cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (_cache) {
      setMetrics(_cache);
      setLoading(false);
      return;
    }

    fetch('/api/metrics')
      .then(res => {
        if (!res.ok) throw new Error(`Metrics API returned ${res.status}`);
        return res.json();
      })
      .then(data => {
        _cache = data;
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { metrics, loading, error };
};
