import { useMemo, type CSSProperties, type HTMLAttributes } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import './number-flow.css';

/** Props for {@link NumberFlow}, in addition to native `span` attributes. */
export type NumberFlowProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  'children'
> & {
  /** Number to display. Changes animate digit by digit. */
  value: number;
  /** Options passed to `Intl.NumberFormat`, such as currency or percent styles. */
  format?: Intl.NumberFormatOptions;
  /** BCP 47 locale for grouping and numerals. Defaults to the platform locale. */
  locale?: string;
  /** Transition duration in milliseconds. Defaults to the base motion duration. */
  duration?: number;
  /** Additional CSS class for the root element. */
  className?: string;
};

type NumberFlowPiece =
  | { kind: 'digit'; key: string; digit: number; glyphs: readonly string[] }
  | { kind: 'text'; key: string; text: string };

const DIGIT_COUNT = 10;

/**
 * Returns the locale's ten digit glyphs, indexed by digit value. Returns
 * `undefined` when the numbering system does not map one character per digit.
 */
function resolveDigitGlyphs(
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
): NumberFlowPiece {
  return { kind: 'text', key: `${part.type}-${index}`, text: part.value };
}

/**
 * Splits formatted parts into animated digits and static text. Integer digits
 * are keyed by place value from the right, so unchanged places keep their
 * elements. Fraction digits are keyed from the left. If any digit cannot be
 * mapped to a glyph, the whole value falls back to static text.
 */
function createPieces(
  parts: readonly Intl.NumberFormatPart[],
  glyphs: readonly string[] | undefined,
): NumberFlowPiece[] {
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

  const pieces: NumberFlowPiece[] = [];
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

function NumberFlowDigit({
  digit,
  glyphs,
}: {
  digit: number;
  glyphs: readonly string[];
}) {
  const style: CSSProperties & TCssCustomProperties = {
    '--notable-number-flow-digit': String(digit),
  };

  return (
    <span className="notable-number-flow__digit" data-digit={digit}>
      <span className="notable-number-flow__strip" style={style}>
        {glyphs.map((glyph, index) => (
          <span key={index} className="notable-number-flow__glyph">
            {glyph}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Displays a number that rolls digit by digit when its value changes. The
 * formatted value is exposed to assistive technology once, and the animated
 * digits are hidden from it, so intermediate frames are never announced.
 *
 * Formatting uses `Intl.NumberFormat`. Grouping, decimal separators, currency,
 * and percent signs stay static. The initial value renders without animation,
 * and reduced-motion users get an immediate change.
 */
export function NumberFlow({
  value,
  format,
  locale,
  duration,
  className,
  style,
  ...props
}: NumberFlowProps) {
  const { formatter, glyphs } = useMemo(
    () => ({
      formatter: new Intl.NumberFormat(locale, format),
      glyphs: resolveDigitGlyphs(locale),
    }),
    [locale, format],
  );

  const formatted = formatter.format(value);
  const pieces = createPieces(formatter.formatToParts(value), glyphs);

  const classes = ['notable-number-flow', className].filter(Boolean).join(' ');

  const inlineStyle: CSSProperties & TCssCustomProperties = { ...style };
  if (duration !== undefined) {
    inlineStyle['--notable-number-flow-duration'] = `${duration}ms`;
  }

  return (
    <span {...props} className={classes} style={inlineStyle}>
      <span className="notable-number-flow__sr-only">{formatted}</span>
      <span className="notable-number-flow__visual" aria-hidden="true">
        {pieces.map((piece) =>
          piece.kind === 'digit' ? (
            <NumberFlowDigit
              key={piece.key}
              digit={piece.digit}
              glyphs={piece.glyphs}
            />
          ) : (
            <span key={piece.key}>{piece.text}</span>
          ),
        )}
      </span>
    </span>
  );
}
