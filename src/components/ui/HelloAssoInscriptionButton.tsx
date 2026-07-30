"use client";

import { useEffect, useState, type MouseEvent } from "react";

const HELLOASSO_ORIGIN = "https://www.helloasso.com";

type Props = {
  widgetUrl: string;
  label: string;
  className?: string;
};

export function HelloAssoInscriptionButton({ widgetUrl, label, className }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [height, setHeight] = useState(750);

  useEffect(() => {
    if (!open) return;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== HELLOASSO_ORIGIN) return;
      const dataHeight = e.data?.height;
      if (typeof dataHeight === "number") {
        setHeight((h) => Math.max(h, dataHeight));
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("message", onMessage);
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleOpen() {
    setLoading(true);
    setOpen(true);
  }

  function handleClose(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  }

  return (
    <>
      <button type="button" onClick={handleOpen} className={`${className} cursor-pointer`}>
        {label}
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Inscription — ${label}`}
          className="fixed inset-0 z-50 bg-noir/90 flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-blanc text-4xl leading-none hover:text-red transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            ×
          </button>
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-blanc shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {loading && (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-gris">
                <span
                  className="h-8 w-8 animate-spin rounded-full border-2 border-gris-clair border-t-red"
                  aria-hidden="true"
                />
                <p className="text-sm">Chargement du formulaire…</p>
              </div>
            )}
            <iframe
              title={`Inscription HelloAsso — ${label}`}
              src={widgetUrl}
              scrolling="auto"
              onLoad={() => setLoading(false)}
              style={{
                width: "100%",
                height: loading ? 0 : height,
                border: "none",
                display: "block",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
