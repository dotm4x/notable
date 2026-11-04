import { Autocomplete as BaseAutocomplete } from '@base-ui/react/autocomplete';
import { forwardRef, Fragment } from 'react';
import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { Shortcut } from '../../shortcut/shortcut.js';
import { useCommandContext } from '../context.js';
import { joinClassNames } from '../../../internal/helpers/join-class-names.js';
import { isCommandGroup } from '../helpers/filter.js';
import type {
  CommandGroup,
  CommandItem,
  CommandItemProps,
  CommandListProps,
} from '../types.js';

export const CommandItemPart = forwardRef<HTMLDivElement, CommandItemProps>(
  function CommandItemPart({ item, className, ...props }, ref) {
    const { selectItem } = useCommandContext('Command.Item');

    return (
      <BaseAutocomplete.Item
        ref={ref}
        value={item}
        disabled={item.disabled}
        className={joinClassNames('one-command__item', className)}
        {...props}
        onClick={() => selectItem(item)}
      >
        {item.icon && (
          <span className="one-command__item-icon" aria-hidden="true">
            {item.icon}
          </span>
        )}
        <span className="one-command__item-text">
          {item.label}
          {item.description && (
            <span className="one-command__item-description">
              {item.description}
            </span>
          )}
        </span>
        {item.shortcut && item.shortcut.length > 0 && (
          <span className="one-command__item-shortcut">
            {item.shortcut.map((key, index) => (
              <Shortcut key={`${key}-${index}`}>{key}</Shortcut>
            ))}
          </span>
        )}
      </BaseAutocomplete.Item>
    );
  },
);

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(
  function CommandList({ className, children, ...props }, ref) {
    const renderItem =
      children ?? ((item: CommandItem) => <CommandItemPart item={item} />);

    return (
      <div className="one-command__list-frame">
        <AnimatedHighlight />
        <BaseAutocomplete.List
          ref={ref}
          aria-label="Commands"
          className={joinClassNames('one-command__list', className)}
          {...props}
        >
          {(entry: CommandItem | CommandGroup, index: number) =>
            isCommandGroup(entry) ? (
              <BaseAutocomplete.Group
                key={entry.label}
                items={entry.items}
                className="one-command__group"
              >
                <BaseAutocomplete.GroupLabel className="one-command__group-label">
                  {entry.label}
                </BaseAutocomplete.GroupLabel>
                <BaseAutocomplete.Collection>
                  {(item: CommandItem, itemIndex: number) => (
                    <Fragment key={item.value}>
                      {renderItem(item, itemIndex)}
                    </Fragment>
                  )}
                </BaseAutocomplete.Collection>
              </BaseAutocomplete.Group>
            ) : (
              <Fragment key={entry.value}>{renderItem(entry, index)}</Fragment>
            )
          }
        </BaseAutocomplete.List>
      </div>
    );
  },
);
