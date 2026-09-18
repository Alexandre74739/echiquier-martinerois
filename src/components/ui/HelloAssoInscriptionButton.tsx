"use client";

type Props = {
  widgetUrl: string;
  label: string;
  className?: string;
};

/** Ouvre le formulaire HelloAsso dans une fenêtre popup plutôt qu'en iframe : depuis mars 2026,
    HelloAsso bloque elle-même l'affichage de sa mire de paiement en iframe (X-Frame-Options/CSP,
    pour empêcher le clickjacking sur les pages bancaires). La popup garde le site ouvert en
    arrière-plan, contrairement à un nouvel onglet qui remplace la navigation en cours. */
function openHelloAssoPopup(url: string) {
  const width = 480;
  const height = 720;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  const popup = window.open(
    url,
    "helloasso-inscription",
    `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes`
  );

  if (!popup) {
    // Popup bloquée par le navigateur : on retombe sur une navigation classique.
    window.location.href = url;
    return;
  }
  popup.focus();
}

export function HelloAssoInscriptionButton({ widgetUrl, label, className }: Props) {
  return (
    <button
      type="button"
      onClick={() => openHelloAssoPopup(widgetUrl)}
      className={`${className} cursor-pointer`}
    >
      {label}
    </button>
  );
}
