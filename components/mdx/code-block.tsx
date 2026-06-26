"use client";

import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = "javascript", title }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0d1117]">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {title ?? language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-emerald-300">{code}</code>
      </pre>
    </div>
  );
}

export function ComplexityBadge({
  value,
  type = "time",
}: {
  value: string;
  type?: "time" | "space";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-2 py-0.5 font-mono text-xs font-medium",
        type === "time"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-cyan-500/15 text-cyan-400"
      )}
    >
      {value}
    </span>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <blockquote className="border-l-4 border-primary bg-primary/5 px-5 py-4 italic text-foreground/90 rounded-r-lg">
      {children}
    </blockquote>
  );
}
