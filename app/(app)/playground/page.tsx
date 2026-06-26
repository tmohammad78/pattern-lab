"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Trash2 } from "lucide-react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 items-center justify-center bg-[#0d1117] text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

const DEFAULT_CODE = `// Write JavaScript here
function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Pattern Lab"));
console.log([1, 2, 3].map(n => n * 2));
`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState<string[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function runCode() {
    setOutput([]);
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    const logs: string[] = [];
    const script = `
      const logs = [];
      const console = {
        log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
        error: (...args) => logs.push('[error] ' + args.join(' ')),
        warn: (...args) => logs.push('[warn] ' + args.join(' ')),
      };
      try {
        ${code}
        window.parent.postMessage({ type: 'playground-result', logs }, '*');
      } catch (e) {
        window.parent.postMessage({ type: 'playground-result', logs: ['Error: ' + e.message] }, '*');
      }
    `;

    function handleMessage(e: MessageEvent) {
      if (e.data?.type === "playground-result") {
        setOutput(e.data.logs);
        window.removeEventListener("message", handleMessage);
      }
    }
    window.addEventListener("message", handleMessage);

    doc.open();
    doc.write(`<script>${script}<\/script>`);
    doc.close();
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 lg:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Playground</h1>
        <p className="text-sm text-muted-foreground">
          Run JavaScript in the browser sandbox.
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
        <Card className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-2">
            <span className="text-sm font-medium">editor.js</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setCode(DEFAULT_CODE)}>
                <Trash2 className="h-3.5 w-3.5" />
                Reset
              </Button>
              <Button size="sm" onClick={runCode}>
                <Play className="h-3.5 w-3.5" />
                Run
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              language="javascript"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                padding: { top: 16 },
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </Card>

        <Card className="flex w-full flex-col lg:w-80">
          <div className="border-b border-border px-4 py-2">
            <span className="text-sm font-medium">Console</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
            {output.length === 0 ? (
              <p className="text-muted-foreground">Click Run to see output</p>
            ) : (
              output.map((line, i) => (
                <p key={i} className="mb-1 text-emerald-400">
                  {line}
                </p>
              ))
            )}
          </div>
        </Card>
      </div>

      <iframe ref={iframeRef} sandbox="allow-scripts" className="hidden" title="sandbox" />
    </div>
  );
}
