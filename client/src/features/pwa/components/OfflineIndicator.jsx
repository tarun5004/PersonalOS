import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

function readOnlineState() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(readOnlineState);

  useEffect(() => {
    function handleOnlineChange() {
      setIsOnline(readOnlineState());
    }

    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);

    return () => {
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[60] inline-flex items-center gap-2 rounded-card border border-warning/40 bg-[var(--warning-subtle)] px-4 py-3 text-sm font-semibold text-[var(--warning-text)] shadow-panel">
      <WifiOff aria-hidden="true" size={17} />
      Offline mode
    </div>
  );
}
