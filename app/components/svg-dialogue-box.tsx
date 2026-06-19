"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_SPEED = 80;
const DEFAULT_WIDTH = 720;
const DEFAULT_HEIGHT = 220;
const HORIZONTAL_PADDING = 28;
const TOP_PADDING = 34;
const BOTTOM_PADDING = 34;
const FONT_SIZE = 20;
const LINE_HEIGHT = 30;
const CORNER_RADIUS = 18;
const BORDER_WIDTH = 4;
const ARROW_OFFSET_X = 34;
const ARROW_OFFSET_Y = 24;
const MIN_CHARS_PER_LINE = 8;

export type SvgDialogueBoxProps = {
  text: string;
  speed?: number;
  width?: number;
  height?: number;
  onComplete?: () => void;
};

const SvgDialogueBox = ({
  text,
  speed = DEFAULT_SPEED,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  onComplete,
}: SvgDialogueBoxProps) => {
  return (
    <SvgDialogueBoxInner
      key={`${text}:${speed}:${width}:${height}`}
      text={text}
      speed={speed}
      width={width}
      height={height}
      onComplete={onComplete}
    />
  );
};

const SvgDialogueBoxInner = ({
  text,
  speed = DEFAULT_SPEED,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  onComplete,
}: SvgDialogueBoxProps) => {
  const [visibleText, setVisibleText] = useState("");
  const [isComplete, setIsComplete] = useState(text.length === 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const clearTypingTimer = () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const typeNextCharacter = () => {
      if (indexRef.current >= text.length) {
        setIsComplete(true);
        timeoutRef.current = null;
        return;
      }

      const nextIndex = indexRef.current + 1;
      indexRef.current = nextIndex;
      setVisibleText(text.slice(0, nextIndex));
      timeoutRef.current = setTimeout(typeNextCharacter, speed);
    };

    if (text.length > 0) {
      timeoutRef.current = setTimeout(typeNextCharacter, speed);
    }

    return () => {
      clearTypingTimer();
    };
  }, [speed, text]);

  const handleAdvance = () => {
    if (!isComplete) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      indexRef.current = text.length;
      setVisibleText(text);
      setIsComplete(true);
      return;
    }

    onComplete?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleAdvance();
  };

  const maxCharsPerLine = useMemo(() => {
    const usableWidth = width - HORIZONTAL_PADDING * 2 - 44;
    const estimatedChars = Math.floor(usableWidth / (FONT_SIZE * 0.95));
    return Math.max(MIN_CHARS_PER_LINE, estimatedChars);
  }, [width]);

  const lines = useMemo(
    () => splitTextIntoLines(visibleText, maxCharsPerLine),
    [maxCharsPerLine, visibleText],
  );

  const textStartX = HORIZONTAL_PADDING;
  const textStartY = TOP_PADDING + FONT_SIZE * 0.8;
  const arrowX = width - ARROW_OFFSET_X;
  const arrowY = height - ARROW_OFFSET_Y;
  const innerWidth = width - BORDER_WIDTH * 2 - 10;
  const innerHeight = height - BORDER_WIDTH * 2 - 10;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="button"
      tabIndex={0}
      aria-label="RPG dialogue box"
      onClick={handleAdvance}
      onKeyDown={handleKeyDown}
      style={{
        cursor: "pointer",
        display: "block",
        width: "100%",
        maxWidth: `${width}px`,
        height: "auto",
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x={2}
        y={2}
        width={width - 4}
        height={height - 4}
        rx={CORNER_RADIUS}
        fill="#050505"
        stroke="#ffffff"
        strokeWidth={BORDER_WIDTH}
      />
      <rect
        x={7}
        y={7}
        width={innerWidth}
        height={innerHeight}
        rx={CORNER_RADIUS - 4}
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={1.5}
      />
      <text
        x={textStartX}
        y={textStartY}
        fill="#ffffff"
        fontFamily="'Courier New', Courier, monospace"
        fontSize={FONT_SIZE}
        letterSpacing="1.2"
      >
        {lines.map((line, index) => (
          <tspan
            key={`${index}-${line}`}
            x={textStartX}
            dy={index === 0 ? 0 : LINE_HEIGHT}
          >
            {line}
          </tspan>
        ))}
      </text>
      <text
        x={arrowX}
        y={arrowY}
        fill="#ffffff"
        fontFamily="'Courier New', Courier, monospace"
        fontSize={22}
        textAnchor="end"
        opacity={isComplete ? 1 : 0.75}
      >
        ▼
        <animate
          attributeName="opacity"
          values={isComplete ? "1;0.2;1" : "0.75;0.2;0.75"}
          dur="900ms"
          repeatCount="indefinite"
        />
      </text>
      <rect
        x={HORIZONTAL_PADDING}
        y={TOP_PADDING}
        width={width - HORIZONTAL_PADDING * 2}
        height={Math.max(
          0,
          height - TOP_PADDING - BOTTOM_PADDING - LINE_HEIGHT,
        )}
        fill="transparent"
        pointerEvents="none"
      />
    </svg>
  );
};

const splitTextIntoLines = (
  text: string,
  maxCharsPerLine: number,
): string[] => {
  if (text.length === 0) {
    return [""];
  }

  const lines: string[] = [];

  for (let index = 0; index < text.length; index += maxCharsPerLine) {
    lines.push(text.slice(index, index + maxCharsPerLine));
  }

  return lines;
};

export default SvgDialogueBox;
