export type TNumberFlowPiece =
  | { kind: 'digit'; key: string; digit: number; glyphs: readonly string[] }
  | { kind: 'text'; key: string; text: string };

const DIGIT_COUNT = 10;

export function resolveDigitGlyphs(
  locale: string | undefined,
): readonly string[] | undefined {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false });
  const glyphs = Array.from({ length: DIGIT_COUNT }, (_, digit) =>
    formatter.format(digit),
  );
  const isSingleCharacter = glyphs.every(
    (glyph) => Array.from(glyph).length === 1,
  );
  const isUnique = new Set(glyphs).size === DIGIT_COUNT;

  return isSingleCharacter && isUnique ? glyphs : undefined;
}

function isAnimatablePart(part: Intl.NumberFormatPart): boolean {
  return part.type === 'integer' || part.type === 'fraction';
}

function createTextPiece(
  part: Intl.NumberFormatPart,
  index: number,
): TNumberFlowPiece {
  return { kind: 'text', key: `${part.type}-${index}`, text: part.value };
}

export function createPieces(
  parts: readonly Intl.NumberFormatPart[],
  glyphs: readonly string[] | undefined,
): TNumberFlowPiece[] {
  const canAnimate =
    glyphs !== undefined &&
    parts.every(
      (part) =>
        !isAnimatablePart(part) ||
        Array.from(part.value).every((character) => glyphs.includes(character)),
    );

  if (glyphs === undefined || !canAnimate) {
    return parts.map(createTextPiece);
  }

  const integerDigitCount = parts.reduce(
    (count, part) =>
      part.type === 'integer' ? count + Array.from(part.value).length : count,
    0,
  );

  const pieces: TNumberFlowPiece[] = [];
  let integerDigitsSeen = 0;
  let fractionDigitsSeen = 0;

  parts.forEach((part, index) => {
    if (!isAnimatablePart(part)) {
      pieces.push(createTextPiece(part, index));
      return;
    }

    for (const character of part.value) {
      const digit = glyphs.indexOf(character);

      if (part.type === 'integer') {
        const place = integerDigitCount - 1 - integerDigitsSeen;
        integerDigitsSeen += 1;
        pieces.push({ kind: 'digit', key: `integer-${place}`, digit, glyphs });
      } else {
        pieces.push({
          kind: 'digit',
          key: `fraction-${fractionDigitsSeen}`,
          digit,
          glyphs,
        });
        fractionDigitsSeen += 1;
      }
    }
  });

  return pieces;
}
