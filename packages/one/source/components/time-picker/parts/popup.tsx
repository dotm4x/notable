import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { Popover } from '../../popover/popover.js';
import {
  firstEnabledHour,
  HOURS_12,
  HOURS_24,
  pad,
  periodHours,
  to12,
} from '../helpers/time.js';
import type { TTimePickerState } from '../hooks/use-time-picker.js';
import { TimeColumn, TimeOption } from './columns.js';

type TTimePickerPopupProps = {
  picker: TTimePickerState;
};

export function TimePickerPopup({ picker }: TTimePickerPopupProps) {
  const {
    format,
    constraints,
    dayPeriods,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    minuteChoices,
    hovered,
    setHovered,
    selectHour,
    selectHour12,
    selectMinute,
    selectPeriod,
    isHourEnabled,
    isHour12Enabled,
    isMinuteEnabled,
    hourName,
    minuteName,
    periodName,
  } = picker;
  // One hovered key is shared by all columns, so a single highlight moves between them.
  const hoverProps = (key: string) => ({
    highlighted: hovered === key,
    onHover: (hovering: boolean) => setHovered(hovering ? key : null),
  });

  return (
    <Popover.Content
      aria-label="Choose time"
      align="start"
      className="one-time-picker__popup"
    >
      <div className="one-time-picker__panel">
        <AnimatedHighlight followTargetShape />
        <TimeColumn legend="Hour">
          {format === '24h'
            ? HOURS_24.map((hour) => (
                <TimeOption
                  key={hour}
                  name={hourName}
                  value={String(hour)}
                  label={pad(hour)}
                  checked={selectedHour === hour}
                  disabled={!isHourEnabled(hour)}
                  {...hoverProps(`hour-${hour}`)}
                  onSelect={() => selectHour(hour)}
                />
              ))
            : HOURS_12.map((hour12) => (
                <TimeOption
                  key={hour12}
                  name={hourName}
                  value={String(hour12)}
                  label={pad(hour12)}
                  checked={
                    selectedHour !== undefined && to12(selectedHour) === hour12
                  }
                  disabled={!isHour12Enabled(hour12)}
                  {...hoverProps(`hour-${hour12}`)}
                  onSelect={() => selectHour12(hour12)}
                />
              ))}
        </TimeColumn>
        <TimeColumn legend="Minute">
          {minuteChoices.map((minute) => (
            <TimeOption
              key={minute}
              name={minuteName}
              value={String(minute)}
              label={pad(minute)}
              checked={selectedMinute === minute}
              disabled={!isMinuteEnabled(minute)}
              {...hoverProps(`minute-${minute}`)}
              onSelect={() => selectMinute(minute)}
            />
          ))}
        </TimeColumn>
        {format === '12h' && (
          <TimeColumn legend="AM/PM">
            {(['am', 'pm'] as const).map((period) => (
              <TimeOption
                key={period}
                name={periodName}
                value={period}
                label={dayPeriods[period]}
                checked={selectedPeriod === period}
                disabled={
                  firstEnabledHour(constraints, periodHours(period)) ===
                  undefined
                }
                {...hoverProps(`period-${period}`)}
                onSelect={() => selectPeriod(period)}
              />
            ))}
          </TimeColumn>
        )}
      </div>
    </Popover.Content>
  );
}
