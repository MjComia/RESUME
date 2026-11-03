"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Token {
  type: "comment" | "string" | "keyword" | "number" | "fn" | "plain";
  value: string;
}

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "export",
  "default",
  "import",
  "from",
  "type",
  "interface",
  "switch",
  "case",
  "async",
  "await",
  "if",
  "else",
  "new",
  "true",
  "false",
  "null",
  "SELECT",
  "FROM",
  "WHERE",
  "GROUP",
  "BY",
  "ORDER",
  "WITH",
  "AS",
  "OVER",
  "PARTITION",
  "DESC",
  "ASC",
  "IN",
  "AND",
  "NOT",
  "LIKE",
  "ROUND",
  "SUM",
  "COUNT",
  "AVG",
  "ROW_NUMBER",
  "DENSE_RANK",
  "DATE_FORMAT",
  "JOIN",
  "LEFT",
  "ON",
  "def",
  "for",
  "in",
  "class",
]);

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//") || trimmed.startsWith("--") || trimmed.startsWith("#")) {
    return [{ type: "comment", value: line }];
  }

  const regex =
    /(\/\/.*$|--.*$|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?%?\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()|\b[A-Za-z_][A-Za-z0-9_]*\b)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        type: "plain",
        value: line.slice(lastIndex, match.index),
      });
    }
    const text = match[0];
    if (text.startsWith("//") || text.startsWith("--")) {
      tokens.push({ type: "comment", value: text });
    } else if (
      text.startsWith('"') ||
      text.startsWith("'") ||
      text.startsWith("`")
    ) {
      tokens.push({ type: "string", value: text });
    } else if (/^\d/.test(text)) {
      tokens.push({ type: "number", value: text });
    } else if (KEYWORDS.has(text) || KEYWORDS.has(text.toUpperCase()) && text === text.toUpperCase() && text.length > 1) {
      tokens.push({ type: "keyword", value: text });
    } else if (line[match.index + text.length] === "(") {
      tokens.push({ type: "fn", value: text });
    } else {
      tokens.push({ type: "plain", value: text });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ type: "plain", value: line.slice(lastIndex) });
  }

  return tokens;
}

interface SyntaxCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  compact?: boolean;
}

export function SyntaxCodeBlock({
  code,
  language = "tsx",
  filename,
  compact = false,
}: SyntaxCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.replace(/\n$/, "").split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable
    }
  };

  return (
    <div className="rounded-md border border-slate-800 bg-[#080d18] text-slate-200 overflow-hidden font-mono text-xs sm:text-[13px]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/90 bg-[#0d1424]">
        <div className="flex items-center gap-2 min-w-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#14D9C4]" />
          <span className="truncate text-slate-300 text-xs">
            {filename || language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 uppercase">{language}</span>
          <button
            type="button"
            suppressHydrationWarning
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Copy code snippet"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#14D9C4]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className={`overflow-x-auto ${compact ? "py-2.5 px-2" : "py-3.5 px-3"}`}
      >
        <pre className="leading-relaxed">
          <code>
            {lines.map((line, idx) => {
              const tokens = tokenizeLine(line);
              return (
                <div key={idx} className="table-row">
                  <span className="table-cell select-none pr-3 text-right text-slate-600 tabular-nums text-[11px] w-7">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">
                    {tokens.length === 0 ? " " : null}
                    {tokens.map((tok, tIdx) => {
                      switch (tok.type) {
                        case "comment":
                          return (
                            <span key={tIdx} className="text-slate-500 italic">
                              {tok.value}
                            </span>
                          );
                        case "keyword":
                          return (
                            <span
                              key={tIdx}
                              className="text-[#14D9C4] font-medium"
                            >
                              {tok.value}
                            </span>
                          );
                        case "string":
                          return (
                            <span key={tIdx} className="text-sky-300">
                              {tok.value}
                            </span>
                          );
                        case "number":
                          return (
                            <span key={tIdx} className="text-[#F59E0B]">
                              {tok.value}
                            </span>
                          );
                        case "fn":
                          return (
                            <span key={tIdx} className="text-amber-200">
                              {tok.value}
                            </span>
                          );
                        default:
                          return <span key={tIdx}>{tok.value}</span>;
                      }
                    })}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
}

