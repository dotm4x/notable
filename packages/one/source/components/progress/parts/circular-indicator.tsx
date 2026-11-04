import type { CSSProperties } from 'react';

export function CircularIndicator({
  percentage,
}: {
  percentage: number | undefined;
}) {
  const arcStyle: CSSProperties | undefined =
    percentage === undefined
      ? undefined
      : { strokeDashoffset: 100 - percentage };

  return (
    <svg className="one-progress__svg" aria-hidden="true" focusable="false">
      <circle className="one-progress__track" cx="50%" cy="50%" />
      <circle
        className="one-progress__arc"
        cx="50%"
        cy="50%"
        pathLength={100}
        style={arcStyle}
      />
    </svg>
  );
}
