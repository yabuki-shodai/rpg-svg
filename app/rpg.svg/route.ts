const DEFAULT_LINES = [
  "初めまして、藪木と言います。",
  "フロントエンドエンジニアをやっています。",
];

const SVG_WIDTH = 1200;
const SVG_HEIGHT = 320;
const DIALOGUE_X = 40;
const DIALOGUE_Y = 40;
const DIALOGUE_WIDTH = 1120;
const DIALOGUE_HEIGHT = 180;
const MAX_LINES = 3;
const CHARACTER_DURATION = 0.12;
const LINE_GAP_DURATION = 1;

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lines = parseLines(searchParams.getAll("lines"));
  const svg = createSvg(lines);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

const createSvg = (lines: string[]) => {
  const dialogueLines = lines.slice(0, MAX_LINES).map(escapeXml);
  const frameStates = createFrameStates(dialogueLines);
  const finalState = createFinalState(dialogueLines);
  const endTime = calculateEndTime(dialogueLines);
  const arrowBegin = `${endTime}s`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" role="img" aria-label="RPG dialogue box">
  <rect width="${SVG_WIDTH}" height="${SVG_HEIGHT}" fill="#050505" />
  <g transform="translate(${DIALOGUE_X} ${DIALOGUE_Y})">
    <rect
      x="0"
      y="0"
      width="${DIALOGUE_WIDTH}"
      height="${DIALOGUE_HEIGHT}"
      rx="22"
      fill="#050505"
      stroke="#ffffff"
      stroke-width="4"
    />
    <rect
      x="8"
      y="8"
      width="${DIALOGUE_WIDTH - 16}"
      height="${DIALOGUE_HEIGHT - 16}"
      rx="16"
      fill="none"
      stroke="rgba(255,255,255,0.25)"
      stroke-width="1.5"
    />
    ${frameStates}
    ${finalState}
    <text
      x="${DIALOGUE_WIDTH - 42}"
      y="${DIALOGUE_HEIGHT - 28}"
      fill="#ffffff"
      font-family="'Courier New', Courier, monospace"
      font-size="28"
      text-anchor="end"
      opacity="0"
    >▼
      <set attributeName="opacity" to="1" begin="${arrowBegin}" fill="freeze" />
      <animate
        attributeName="opacity"
        values="1;0.2;1"
        dur="900ms"
        repeatCount="indefinite"
        begin="${arrowBegin}"
      />
    </text>
  </g>
</svg>`;
};

const createFrameStates = (lines: string[]) => {
  let time = 0;
  const frames: string[] = [];

  lines.forEach((line, lineIndex) => {
    for (let charIndex = 1; charIndex <= line.length; charIndex += 1) {
      const visibleLine = line.slice(0, charIndex);
      const begin = time;
      const isLastCharacter = charIndex === line.length;
      const shouldPauseOnFullLine = isLastCharacter && lineIndex < lines.length - 1;
      const frameDuration = shouldPauseOnFullLine
        ? CHARACTER_DURATION + LINE_GAP_DURATION
        : CHARACTER_DURATION;
      time += frameDuration;
      const end = time;
      frames.push(createTextFrame(visibleLine, begin, end));
    }
  });

  return frames.join("");
};

const createFinalState = (lines: string[]) => {
  const endTime = `${calculateEndTime(lines)}s`;
  const finalLine = lines.at(-1) ?? "";

  return `<text
      x="0"
      y="50"
      fill="#ffffff"
      font-family="'Courier New', Courier, monospace"
      font-size="26"
      letter-spacing="1.1"
      visibility="hidden"
    >${createTspans(finalLine)}
      <set attributeName="visibility" to="visible" begin="${endTime}" fill="freeze" />
    </text>`;
};

const calculateEndTime = (lines: string[]) => {
  const totalCharacters = lines.reduce((sum, line) => sum + line.length, 0);
  const gapCount = Math.max(0, lines.length - 1);
  return Number(
    (totalCharacters * CHARACTER_DURATION + gapCount * LINE_GAP_DURATION).toFixed(
      2,
    ),
  );
};

const parseLines = (values: string[]) => {
  const normalized = values
    .map((value) => value.trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : DEFAULT_LINES;
};

const createTextFrame = (line: string, begin: number, end: number) => {
  return `<text
      x="0"
      y="50"
      fill="#ffffff"
      font-family="'Courier New', Courier, monospace"
      font-size="26"
      letter-spacing="1.1"
      visibility="hidden"
    >${createTspans(line)}
      <set attributeName="visibility" to="visible" begin="${begin.toFixed(2)}s" end="${end.toFixed(2)}s" />
    </text>`;
};

const createTspans = (line: string) => `<tspan x="36" dy="0">${line}</tspan>`;

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
