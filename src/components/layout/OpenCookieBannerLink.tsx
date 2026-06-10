"use client";

import { useCookies } from "@/src/components/providers/CookieProvider";

export function OpenCookieBannerLink() {
  const { openBanner } = useCookies();
  return (
    <button
      onClick={openBanner}
      className="text-red hover:underline"
    >
      Gérer mes cookies
    </button>
  );
}
