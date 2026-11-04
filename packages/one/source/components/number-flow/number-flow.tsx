import { useMemo, type CSSProperties } from 'react';
import type { TCssCustomProperties } from '../../internal/helpers/css-custom-properties.js';
import { createPieces, resolveDigitGlyphs } from './helpers/digits.js';
import { NumberFlowDigit } from './parts/digit.js';
import type { NumberFlowProps } from './types.js';
import './number-flow.css';

export type { NumberFlowProps } from './types.js';

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

  const classes = ['one-number-flow', className].filter(Boolean).join(' ');

  const inlineStyle: CSSProperties & TCssCustomProperties = { ...style };
  if (duration !== undefined) {
    inlineStyle['--_number-flow-duration'] = `${duration}ms`;
  }

  return (
    <span {...props} className={classes} style={inlineStyle}>
      <span className="one-number-flow__sr-only">{formatted}</span>
      <span className="one-number-flow__visual" aria-hidden="true">
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
