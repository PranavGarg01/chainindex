"use client";

import { createContext, useCallback, useContext, type ReactNode } from "react";

type CopyFeedback = (value: string, message: string) => Promise<void>;
const CopyFeedbackContext = createContext<CopyFeedback | null>(null);

export function CopyFeedbackProvider({ children }: { children: ReactNode }) {
  const copy = useCallback(async (value: string, nextMessage: string) => {
    void nextMessage;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
  }, []);
  return <CopyFeedbackContext.Provider value={copy}>{children}</CopyFeedbackContext.Provider>;
}

export function useCopyFeedback(): CopyFeedback {
  const context = useContext(CopyFeedbackContext);
  if (!context) throw new Error("useCopyFeedback must be used inside CopyFeedbackProvider");
  return context;
}
