"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import SvgDialogueBox from "@/app/components/svg-dialogue-box";

const DEFAULT_LINES = [
  "ようこそ。ここが会話画面です。",
  "クリックすると全文表示、もう一度で次へ進みます。",
] as const;

const DEFAULT_SPEED = 80;

export default function RpgPage() {
  const searchParams = useSearchParams();
  const serializedParams = searchParams.toString();
  const speed = parseSpeed(searchParams.get("speed"));
  const lines = parseLines(searchParams.getAll("links"));

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px 16px",
        background: "#06080d",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "860px",
        }}
      >
        <RpgStage key={serializedParams} lines={lines} speed={speed} />
      </section>
    </main>
  );
}

type RpgStageProps = {
  lines: string[];
  speed: number;
};

function RpgStage({ lines, speed }: RpgStageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleComplete = () => {
    setCurrentIndex((current) => (current + 1) % lines.length);
  };

  return (
    <SvgDialogueBox
      text={lines[currentIndex]}
      speed={speed}
      width={800}
      height={160}
      onComplete={handleComplete}
    />
  );
}

function parseSpeed(value: string | null): number {
  if (value === null) {
    return DEFAULT_SPEED;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SPEED;
  }

  return parsed;
}

function parseLines(values: string[]): string[] {
  const normalized = values.map((value) => value.trim()).filter(Boolean);
  return normalized.length > 0 ? normalized : [...DEFAULT_LINES];
}
