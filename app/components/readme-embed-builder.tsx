"use client";

import { useState } from "react";

type ReadmeEmbedBuilderProps = {
  baseUrl: string;
};

const DEFAULT_LINES = [
  "初めまして、藪木と言います。",
  "フロントエンドエンジニアをやっています。",
];

const ReadmeEmbedBuilder = ({ baseUrl }: ReadmeEmbedBuilderProps) => {
  const [lines, setLines] = useState(DEFAULT_LINES);
  const [copyLabel, setCopyLabel] = useState("コピー");

  const markdown = buildMarkdown(baseUrl, lines);

  return (
    <div className="mt-8">
      <p className="text-2xl font-bold">HOW TO USE</p>
      <div className="mt-4 grid gap-3">
        {lines.map((line, index) => (
          <label key={index} className="grid gap-1">
            <input
              className="rounded-md border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none"
              placeholder={`Line ${index + 1} を入力`}
              value={line}
              onChange={(event) => {
                const nextLines = [...lines];
                nextLines[index] = event.target.value;
                setLines(nextLines);
              }}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="mt-3 bg-green-500 text-white px-4 py-2 rounded-md"
          type="button"
          onClick={() => {
            setLines([...lines, ""]);
          }}
        >
          追加
        </button>
      </div>
      <pre className="mt-4 overflow-auto rounded-md border border-zinc-700 bg-zinc-900 p-4 font-mono text-sm text-zinc-100">
        {markdown}
      </pre>
      <button
        className="mt-3"
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(markdown);
            setCopyLabel("コピー済み");
            setTimeout(() => {
              setCopyLabel("コピー");
            }, 1500);
          } catch {
            setCopyLabel("コピー失敗");
            setTimeout(() => {
              setCopyLabel("コピー");
            }, 1500);
          }
        }}
      >
        {copyLabel}
      </button>
    </div >
  );
};

const buildMarkdown = (baseUrl: string, lines: string[]) => {
  const filteredLines = lines.map((line) => line.trim()).filter(Boolean);
  const query = filteredLines
    .map((line) => `lines=${line}`)
    .join("&");

  return `![RPG](${baseUrl}/rpg.svg?${query}&charDuration=0.08&lineGap=1.5)`;
};

export default ReadmeEmbedBuilder;
