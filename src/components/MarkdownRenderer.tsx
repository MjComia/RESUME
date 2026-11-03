"use client";

import React from "react";
import { SyntaxCodeBlock } from "@/components/SyntaxCodeBlock";

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern =
    /(!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;

  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }

    if (match[1].startsWith("![")) {
      const alt = match[2];
      const src = match[3];
      parts.push(
        <img
          key={`img-${key++}`}
          src={src}
          alt={alt}
          className="my-4 rounded-md border border-hairline max-h-96 w-auto"
        />
      );
    } else if (match[4] && match[5]) {
      parts.push(
        <a
          key={`link-${key++}`}
          href={match[5]}
          target={match[5].startsWith("http") ? "_blank" : undefined}
          rel={match[5].startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-code underline underline-offset-4 hover:opacity-85"
        >
          {match[4]}
        </a>
      );
    } else if (match[6]) {
      parts.push(
        <code
          key={`code-${key++}`}
          className="font-mono text-[0.875em] px-1.5 py-0.5 rounded bg-elevated border border-hairline text-code"
        >
          {match[6]}
        </code>
      );
    } else if (match[7]) {
      parts.push(
        <strong key={`strong-${key++}`} className="font-semibold text-ink">
          {match[7]}
        </strong>
      );
    } else if (match[8]) {
      parts.push(
        <em key={`em-${key++}`} className="italic">
          {match[8]}
        </em>
      );
    }

    lastIdx = pattern.lastIndex;
  }

  if (lastIdx < text.length) {
    parts.push(text.slice(lastIdx));
  }

  return parts;
}

export function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Fenced code block
    if (line.trim().startsWith("```")) {
      const lang = line.trim().slice(3).trim() || "code";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // consume closing ```
      blocks.push(
        <div key={`cb-${i}`} className="my-6">
          <SyntaxCodeBlock code={codeLines.join("\n")} language={lang} />
        </div>
      );
      continue;
    }

    // Standalone image line
    const imgMatch = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      blocks.push(
        <figure key={`fig-${i}`} className="my-6">
          <img
            src={imgMatch[2]}
            alt={imgMatch[1]}
            className="w-full rounded-md border border-hairline bg-panel"
          />
          {imgMatch[1] && (
            <figcaption className="mt-2 font-mono text-xs text-muted">
              {imgMatch[1]}
            </figcaption>
          )}
        </figure>
      );
      i++;
      continue;
    }

    // Headings
    if (line.startsWith("### ")) {
      blocks.push(
        <h3
          key={`h3-${i}`}
          className="font-mono text-lg font-semibold text-ink mt-8 mb-3 tracking-tight"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="font-mono text-xl sm:text-2xl font-semibold text-ink mt-10 mb-4 pb-2 border-b border-hairline tracking-tight"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push(
        <h1
          key={`h1-${i}`}
          className="font-mono text-2xl sm:text-3xl font-bold text-ink mt-10 mb-4 tracking-tight"
        >
          {renderInline(line.slice(2))}
        </h1>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.trim().startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote
          key={`bq-${i}`}
          className="my-6 pl-4 py-1 border-l-2 border-data bg-data/5 rounded-r-sm text-ink/90 italic"
        >
          {renderInline(quoteLines.join(" "))}
        </blockquote>
      );
      continue;
    }

    // Markdown Table
    if (
      line.includes("|") &&
      i + 1 < lines.length &&
      /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(lines[i + 1])
    ) {
      const parseRow = (r: string) =>
        r
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((cell) => cell.trim());

      const headers = parseRow(line);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|") && lines[i].trim()) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      blocks.push(
        <div
          key={`tbl-${i}`}
          className="my-6 overflow-x-auto rounded-md border border-hairline"
        >
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-elevated border-b border-hairline font-mono text-xs text-muted">
              <tr>
                {headers.map((h, hIdx) => (
                  <th key={hIdx} className="px-4 py-2.5 font-medium">
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline bg-panel">
              {rows.map((r, rIdx) => (
                <tr key={rIdx}>
                  {r.map((cell, cIdx) => (
                    <td
                      key={cIdx}
                      className="px-4 py-2.5 text-ink/90 tabular-nums"
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul
          key={`ul-${i}`}
          className="my-4 space-y-2 list-disc pl-6 text-ink/90 marker:text-code"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol
          key={`ol-${i}`}
          className="my-4 space-y-2 list-decimal pl-6 text-ink/90 marker:font-mono marker:text-data"
        >
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].trim().startsWith("```") &&
      !lines[i].startsWith("#") &&
      !lines[i].trim().startsWith("> ") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`p-${i}`} className="my-4 text-ink/90 leading-relaxed">
        {renderInline(paraLines.join(" "))}
      </p>
    );
  }

  return <div className="max-w-[68ch] text-base">{blocks}</div>;
}

