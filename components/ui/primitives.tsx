import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

type SurfaceTone = "default" | "muted" | "expanded";

export function Surface({
  tone = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { tone?: SurfaceTone }) {
  return <div className={`ui-surface ui-surface-${tone} ${className}`.trim()} {...props} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof BaseButton> & { variant?: "primary" | "secondary" | "ghost" }) {
  return <BaseButton className={`button ${variant} ${className}`.trim()} {...props} />;
}

export function TestnetBadge({ children = "Testnet" }: { children?: ReactNode }) {
  return <span className="badge testnet">{children}</span>;
}
