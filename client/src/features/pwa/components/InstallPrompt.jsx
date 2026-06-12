import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button.jsx';

export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault();
      setInstallEvent(event);
      setIsDismissed(false);
    }

    function handleInstalled() {
      setInstallEvent(null);
      setIsDismissed(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!installEvent) {
      return;
    }

    installEvent.prompt();
    await installEvent.userChoice.catch(() => null);
    setInstallEvent(null);
    setIsDismissed(true);
  }

  if (!installEvent || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] grid max-w-sm gap-3 rounded-card border border-border bg-surface p-4 text-sm shadow-panel">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-body">Install Personal OS</p>
          <p className="mt-1 text-muted">Open your command center faster from this device.</p>
        </div>
        <button
          aria-label="Dismiss install prompt"
          className="rounded-card p-1 text-muted transition hover:bg-surface-elevated hover:text-body focus-visible:outline-none focus-visible:shadow-focus"
          onClick={() => setIsDismissed(true)}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      </div>
      <Button onClick={handleInstall} size="sm" variant="secondary">
        <Download aria-hidden="true" size={16} />
        Install app
      </Button>
    </div>
  );
}
