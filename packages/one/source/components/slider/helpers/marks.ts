import type { ReactNode } from 'react';
import type { TSliderMark } from '../types.js';

type TResolvedSliderMark = { value: number; label?: ReactNode };

export function hasMarkLabel(label: ReactNode): boolean {
  return label !== undefined && label !== null && typeof label !== 'boolean';
}

export function getSliderMarks(
  marks: readonly TSliderMark[],
  markInterval: number | undefined,
  min: number,
  max: number,
): TResolvedSliderMark[] {
  const resolvedMarks = new Map<number, TResolvedSliderMark>();

  marks.forEach((mark) => {
    const value = typeof mark === 'number' ? mark : mark.value;

    if (!Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(
        'Slider marks must be finite values within min and max.',
      );
    }

    resolvedMarks.set(value, {
      value,
      ...(typeof mark === 'number' ? {} : { label: mark.label }),
    });
  });

  if (markInterval !== undefined) {
    if (!Number.isFinite(markInterval) || markInterval <= 0) {
      throw new RangeError(
        'Slider markInterval must be a finite positive number.',
      );
    }

    const markCount = Math.floor((max - min) / markInterval);

    // shortcut: interval-generated marks are capped at 501, raise only if dense tracks are required.
    if (markCount > 500) {
      throw new RangeError(
        'Slider markInterval cannot create more than 501 marks.',
      );
    }

    for (let index = 0; index <= markCount; index += 1) {
      const value = Number((min + index * markInterval).toPrecision(12));
      resolvedMarks.set(value, resolvedMarks.get(value) ?? { value });
    }
    resolvedMarks.set(max, resolvedMarks.get(max) ?? { value: max });
  }

  return [...resolvedMarks.values()].sort(
    (first, second) => first.value - second.value,
  );
}

export function getMarkPercentage(
  value: number,
  min: number,
  max: number,
): number {
  return max === min ? 50 : ((value - min) / (max - min)) * 100;
}

export function isMarkActive(
  value: number,
  currentValues: readonly number[],
  isRange: boolean,
  min: number,
): boolean {
  if (isRange) {
    return (
      value >= Math.min(...currentValues) && value <= Math.max(...currentValues)
    );
  }

  return value <= (currentValues[0] ?? min);
}
