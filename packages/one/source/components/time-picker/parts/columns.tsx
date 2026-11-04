import type { ReactNode } from 'react';
import { revealSelection } from '../helpers/reveal-selection.js';

type TTimeColumnProps = {
  legend: string;
  children: ReactNode;
};

export function TimeColumn({ legend, children }: TTimeColumnProps) {
  return (
    <fieldset className="one-time-picker__column">
      <legend className="one-time-picker__legend">{legend}</legend>
      <div className="one-time-picker__list" ref={revealSelection}>
        {children}
      </div>
    </fieldset>
  );
}

type TTimeOptionProps = {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled: boolean;
  highlighted: boolean;
  onHover: (hovering: boolean) => void;
  onSelect: () => void;
};

export function TimeOption({
  name,
  value,
  label,
  checked,
  disabled,
  highlighted,
  onHover,
  onSelect,
}: TTimeOptionProps) {
  return (
    <label
      className="one-time-picker__option"
      data-selected={checked ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-highlighted={highlighted ? '' : undefined}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
    >
      <input
        className="one-time-picker__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onSelect}
      />
      <span>{label}</span>
    </label>
  );
}
