import type { SegmentedControlOption } from '../types.js';

type TSegmentedControlOptionItemProps<TValue extends string> = {
  option: SegmentedControlOption<TValue>;
  index: number;
  controlId: string;
  groupName: string;
  selectedValue: TValue | undefined;
  disabled: boolean;
  onSelect: (value: TValue) => void;
  registerItem: (value: TValue) => (element: HTMLLabelElement | null) => void;
};

export function SegmentedControlOptionItem<TValue extends string>({
  option,
  index,
  controlId,
  groupName,
  selectedValue,
  disabled,
  onSelect,
  registerItem,
}: TSegmentedControlOptionItemProps<TValue>) {
  const isSelected = option.value === selectedValue;
  const isOptionDisabled = disabled || Boolean(option.disabled);
  const optionId = `${controlId}-option-${index}`;

  return (
    <label
      ref={registerItem(option.value)}
      htmlFor={optionId}
      className="one-segmented-control__item"
      data-selector-item
      data-selected={isSelected || undefined}
      data-disabled={isOptionDisabled || undefined}
    >
      <input
        id={optionId}
        type="radio"
        className="one-segmented-control__input"
        name={groupName}
        value={option.value}
        checked={isSelected}
        disabled={isOptionDisabled}
        aria-label={option['aria-label']}
        onChange={() => onSelect(option.value)}
      />
      <span className="one-segmented-control__content">
        {option.icon && (
          <span className="one-segmented-control__icon" aria-hidden="true">
            {option.icon}
          </span>
        )}
        <span className="one-segmented-control__label">{option.label}</span>
      </span>
    </label>
  );
}
