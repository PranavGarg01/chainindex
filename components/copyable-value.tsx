"use client";

import { useState, type ReactNode } from "react";
import { useCopyFeedback } from "./copy-feedback";

type CopyableValueProps = {
  value: string;
  label?: string;
  message?: string;
  variant?: "plain" | "field" | "table";
  truncate?: boolean;
  children?: ReactNode;
  className?: string;
  code?: boolean;
  showCopyIcon?: boolean;
  copyIconPosition?: "left" | "right";
};

export function CopyableValue({
  value,
  label,
  message,
  variant = "plain",
  truncate = false,
  children,
  className = "",
  code = false,
  showCopyIcon = false,
  copyIconPosition = "right",
}: CopyableValueProps) {
  const copy = useCopyFeedback();
  const [copied, setCopied] = useState(false);
  const copyLabel = label ?? message?.replace(/ copied$/i, "") ?? "value";
  const feedback = message ?? `${copyLabel} copied`;
  const content = children ?? value;

  return (
    <button
      type="button"
      className={`copyable-value copyable-${variant} ${truncate ? "is-truncated" : ""} ${showCopyIcon ? "has-copy-icon" : ""} ${showCopyIcon && copyIconPosition === "left" ? "copy-icon-left" : ""} ${copied ? "is-copied" : ""} ${className}`}
      aria-label={`Copy ${copyLabel}: ${value}`}
      onClick={(event) => {
        event.stopPropagation();
        void copy(value, feedback);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1000);
      }}
    >
      {code ? <code>{content}</code> : <span>{content}</span>}
      {showCopyIcon &&
        (copied ? (
          <svg className="copy-icon copy-success-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="m3 8 3 3 7-7" />
          </svg>
        ) : (
          <svg className="copy-icon" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="5" y="5" width="8" height="8" rx="1" />
            <path d="M3 11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V3" />
          </svg>
        ))}
    </button>
  );
}
