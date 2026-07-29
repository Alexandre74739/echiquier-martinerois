"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Image from "next/image";

type ZoomableImageProps = {
  src: string;
  alt: string;
  imgClassName?: string;
};

/** Image en `fill` (parent positionné/dimensionné requis) cliquable pour l'agrandir en modal plein écran. */
export function ZoomableImage({ src, alt, imgClassName }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleOpen(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  function handleClose(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="absolute inset-0 block w-full h-full cursor-zoom-in"
        aria-label={`Agrandir l'image : ${alt}`}
      >
        <Image src={src} alt={alt} fill className={imgClassName} />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-50 bg-noir/90 flex items-center justify-center p-4 sm:p-8"
          onClick={handleClose}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-blanc text-4xl leading-none hover:text-red transition-colors"
            aria-label="Fermer"
          >
            ×
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
            <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
          </div>
        </div>
      )}
    </>
  );
}
