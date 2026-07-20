"use client";

import { useGoogleOAuth, type CredentialResponse } from "@react-oauth/google";
import { useEffect, useRef } from "react";

interface GoogleIdentityApi {
  accounts: {
    id: {
      initialize: (configuration: {
        client_id: string;
        callback: (response: CredentialResponse) => void;
      }) => void;
      renderButton: (
        parent: HTMLElement,
        configuration: {
          type: "standard";
          theme: "outline";
          size: "large";
          text: "continue_with";
          shape: "rectangular";
          logo_alignment: "left";
          width: number;
        },
      ) => void;
    };
  };
}

let initializedClientId: string | null = null;
let activeCredentialHandler: ((response: CredentialResponse) => void) | null = null;

const dispatchCredential = (response: CredentialResponse) => {
  activeCredentialHandler?.(response);
};

const getGoogleIdentity = (): GoogleIdentityApi | null => {
  const browserWindow = window as Window & { google?: GoogleIdentityApi };
  return browserWindow.google ?? null;
};

export function GoogleCredentialButton({
  onCredential,
  disabled = false,
}: {
  onCredential: (credential: string) => void;
  disabled?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { clientId, scriptLoadedSuccessfully } = useGoogleOAuth();

  useEffect(() => {
    const googleIdentity = getGoogleIdentity();
    const container = containerRef.current;
    if (!scriptLoadedSuccessfully || !googleIdentity || !container) return;

    const handler = (response: CredentialResponse) => {
      if (response.credential) onCredential(response.credential);
    };
    activeCredentialHandler = handler;

    if (initializedClientId !== clientId) {
      googleIdentity.accounts.id.initialize({
        client_id: clientId,
        callback: dispatchCredential,
      });
      initializedClientId = clientId;
    }

    container.replaceChildren();
    googleIdentity.accounts.id.renderButton(container, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "rectangular",
      logo_alignment: "left",
      width: 320,
    });

    return () => {
      if (activeCredentialHandler === handler) activeCredentialHandler = null;
      container.replaceChildren();
    };
  }, [clientId, onCredential, scriptLoadedSuccessfully]);

  if (!scriptLoadedSuccessfully) {
    return <p className="text-center text-sm text-slate-500">Loading Google sign-in…</p>;
  }

  return (
    <div
      className={disabled ? "pointer-events-none opacity-50" : undefined}
      aria-disabled={disabled}
    >
      <div ref={containerRef} className="flex min-h-11 justify-center" />
    </div>
  );
}
