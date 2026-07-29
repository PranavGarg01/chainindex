"use client";

import { useState } from "react";
import { useCopyFeedback } from "./copy-feedback";

export function CopyButton({
  value,
  label = "Copy",
  compact = false,
}: {
  value: string;
  label?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copyWithFeedback = useCopyFeedback();
  const copy = async () => {
    await copyWithFeedback(value, label.includes("ID") ? "Chain ID copied" : "RPC copied");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button
      className={`button ${compact ? "copy-compact" : "secondary"}`}
      onClick={copy}
      type="button"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
