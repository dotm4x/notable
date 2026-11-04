import type { CSSProperties } from 'react';
import type { TCssCustomProperties } from '../../../internal/helpers/css-custom-properties.js';

export function NumberFlowDigit({
  digit,
  glyphs,
}: {
  digit: number;
  glyphs: readonly string[];
}) {
  const style: CSSProperties & TCssCustomProperties = {
    '--_number-flow-digit': String(digit),
  };

  return (
    <span className="one-number-flow__digit" data-digit={digit}>
      <span className="one-number-flow__strip" style={style}>
        {glyphs.map((glyph, index) => (
          <span key={index} className="one-number-flow__glyph">
            {glyph}
          </span>
        ))}
      </span>
    </span>
  );
}
