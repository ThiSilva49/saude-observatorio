"use client";

import { useEffect, useState } from "react";

const DISMISSED_KEY = "observatorio-saude:install-dismissed";

export function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone || dismissed) return null;
  if (!isIOS && !deferredPrompt) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    const promptEvent = deferredPrompt as Event & {
      prompt: () => void;
      userChoice: Promise<{ outcome: string }>;
    };
    promptEvent.prompt();
    await promptEvent.userChoice;
    setDeferredPrompt(null);
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-sm">
      {isIOS ? (
        <p className="text-[var(--text-secondary)]">
          Instale este app: toque em compartilhar{" "}
          <span aria-hidden>⎋</span> e depois em &quot;Adicionar à Tela de
          Início&quot;.
        </p>
      ) : (
        <p className="text-[var(--text-secondary)]">
          Instale este app no seu celular para acesso rápido.
        </p>
      )}
      <div className="flex shrink-0 items-center gap-2">
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            className="min-h-9 rounded-lg bg-[var(--series-1)] px-3 py-1.5 text-sm font-medium text-white"
          >
            Instalar
          </button>
        )}
        <button
          onClick={dismiss}
          aria-label="Fechar"
          className="min-h-9 min-w-9 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
