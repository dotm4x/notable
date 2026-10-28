import { createRef, useState } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { animate as motionAnimate } from 'motion/react';
import { Tabs } from './tabs.js';
import { Tabs as PublicTabs } from '../../index.js';

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, animate: vi.fn(actual.animate) };
});

function BasicTabs({ defaultValue = 'preview' }: { defaultValue?: string }) {
  return (
    <Tabs defaultValue={defaultValue}>
      <Tabs.List aria-label="Example">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
        <Tabs.Trigger value="disabled" disabled>
          Disabled
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">Preview panel</Tabs.Content>
      <Tabs.Content value="code">Code panel</Tabs.Content>
      <Tabs.Content value="disabled">Disabled panel</Tabs.Content>
    </Tabs>
  );
}

function setTabPositions(
  tablist: HTMLElement,
  orientation: 'horizontal' | 'vertical',
) {
  Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]')).forEach(
    (tab, index) => {
      const left = orientation === 'horizontal' ? index * 100 : 0;
      const top = orientation === 'vertical' ? index * 40 : 0;
      vi.spyOn(tab, 'getBoundingClientRect').mockReturnValue({
        x: left,
        y: top,
        left,
        top,
        right: left + 100,
        bottom: top + 40,
        width: 100,
        height: 40,
        toJSON: () => ({}),
      });
    },
  );
}

describe('Tabs', () => {
  it('exposes its compound parts from the public entry point', () => {
    expect(PublicTabs).toBe(Tabs);
    expect(Object.keys(Tabs)).toEqual(
      expect.arrayContaining(['List', 'Trigger', 'Content']),
    );
  });

  it('renders semantic tab controls and the selected content', () => {
    render(<BasicTabs />);

    expect(
      screen.getByRole('tablist', { name: 'Example' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Preview panel');
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-controls',
      screen.getByText('Code panel').closest('[role="tabpanel"]')?.id,
    );
  });

  it('selects the default value and keeps inactive panels hidden in the DOM', async () => {
    render(<BasicTabs defaultValue="code" />);

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Code panel');
    expect(screen.getByText('Preview panel')).toBeInTheDocument();
    const previewPanel = screen
      .getByText('Preview panel')
      .closest('[role="tabpanel"]');
    await waitFor(() => {
      expect(previewPanel).toHaveAttribute('hidden');
    });
  });

  it('supports uncontrolled selection by click and calls onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs defaultValue="preview" onValueChange={onValueChange}>
        <Tabs.List aria-label="Example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
      </Tabs>,
    );

    setTabPositions(screen.getByRole('tablist'), 'horizontal');
    await user.click(screen.getByRole('tab', { name: 'Code' }));

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() =>
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Code panel'),
    );
    expect(onValueChange).toHaveBeenCalledWith('code');
    await waitFor(() => {
      expect(screen.getByRole('tabpanel')).toHaveAttribute(
        'data-activation-direction',
        'right',
      );
    });
  });

  it('supports controlled selection without changing until the parent updates', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs value="preview" onValueChange={onValueChange}>
        <Tabs.List aria-label="Example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
      </Tabs>,
    );

    await user.click(screen.getByRole('tab', { name: 'Code' }));

    expect(onValueChange).toHaveBeenCalledWith('code');
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Preview panel');
  });

  it('handles controlled value changes from the parent', async () => {
    const { rerender } = render(
      <Tabs value="preview">
        <Tabs.List aria-label="Example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
      </Tabs>,
    );

    rerender(
      <Tabs value="code">
        <Tabs.List aria-label="Example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() =>
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Code panel'),
    );
  });

  it('skips disabled tabs during keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<BasicTabs />);

    setTabPositions(screen.getByRole('tablist'), 'horizontal');
    const previewTab = screen.getByRole('tab', { name: 'Preview' });
    previewTab.focus();
    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() => {
      expect(screen.getByRole('tabpanel')).toHaveAttribute(
        'data-activation-direction',
        'right',
      );
    });
    expect(screen.getByRole('tab', { name: 'Disabled' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('supports Home and End keyboard navigation', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="preview">
        <Tabs.List aria-label="Navigation">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
          <Tabs.Trigger value="api">API</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
        <Tabs.Content value="api">API panel</Tabs.Content>
      </Tabs>,
    );

    setTabPositions(screen.getByRole('tablist'), 'horizontal');
    screen.getByRole('tab', { name: 'Preview' }).focus();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'API' })).toHaveFocus();

    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveFocus();
  });

  it('uses vertical keyboard navigation for vertical tabs', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="preview" orientation="vertical">
        <Tabs.List aria-label="Vertical example">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
      </Tabs>,
    );

    setTabPositions(screen.getByRole('tablist'), 'vertical');
    screen.getByRole('tab', { name: 'Preview' }).focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() => {
      expect(screen.getByRole('tabpanel')).toHaveAttribute(
        'data-activation-direction',
        'down',
      );
    });
    expect(screen.getByRole('tablist')).toHaveAttribute(
      'aria-orientation',
      'vertical',
    );
  });

  it.each([
    {
      orientation: 'horizontal' as const,
      key: '{ArrowLeft}',
      direction: 'left',
    },
    { orientation: 'vertical' as const, key: '{ArrowUp}', direction: 'up' },
  ])(
    'animates toward the previous tab in $orientation orientation',
    async ({ orientation, key, direction }) => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="code" orientation={orientation}>
          <Tabs.List aria-label="Previous tab direction">
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="preview">Preview panel</Tabs.Content>
          <Tabs.Content value="code">Code panel</Tabs.Content>
        </Tabs>,
      );

      setTabPositions(screen.getByRole('tablist'), orientation);
      const codeTab = screen.getByRole('tab', { name: 'Code' });
      codeTab.focus();
      await user.keyboard(key);

      expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await waitFor(() => {
        expect(screen.getByRole('tabpanel')).toHaveAttribute(
          'data-activation-direction',
          direction,
        );
      });
    },
  );

  it('forwards native attributes, classes, and refs', () => {
    const rootRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLElement>();
    render(
      <Tabs ref={rootRef} defaultValue="tab" data-testid="tabs">
        <Tabs.List aria-label="Attributes">
          <Tabs.Trigger
            ref={triggerRef}
            value="tab"
            className="custom-trigger"
            title="Current tab"
          >
            Current
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab">Current panel</Tabs.Content>
      </Tabs>,
    );

    expect(rootRef.current).toBe(screen.getByTestId('tabs'));
    const trigger = screen.getByRole('tab', { name: 'Current' });
    expect(triggerRef.current).toBe(trigger);
    expect(trigger).toHaveClass('notable-tabs__trigger', 'custom-trigger');
    expect(trigger).toHaveAttribute('title', 'Current tab');
    expect(trigger).toHaveAttribute('type', 'button');
  });

  it('renders one sliding indicator in the tab list', () => {
    const { container } = render(<BasicTabs />);

    const indicator = container.querySelector('.notable-tabs__indicator');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('.notable-tabs__list')).toHaveClass(
      'notable-tabs__list',
    );
    expect(container.querySelector('.notable-tabs__list')).not.toHaveClass(
      'notable-selector',
    );
  });

  it('applies the vertical layout and indicator axis to the tab list', () => {
    const { container } = render(
      <Tabs defaultValue="settings" orientation="vertical">
        <Tabs.List aria-label="Settings sections">
          <Tabs.Trigger value="account">Account</Tabs.Trigger>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">Account panel</Tabs.Content>
        <Tabs.Content value="settings">Settings panel</Tabs.Content>
      </Tabs>,
    );

    expect(container.querySelector('.notable-tabs')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    expect(container.querySelector('.notable-tabs__indicator')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
    expect(screen.getByRole('tablist')).toHaveClass('notable-tabs__list');
    expect(screen.getByRole('tablist')).not.toHaveClass('notable-selector');
  });

  it.each([
    {
      orientation: 'horizontal' as const,
      firstRect: [0, 0, 100, 40],
      secondRect: [100, 0, 100, 40],
      listRect: [0, 0, 200, 40],
      start: [40, 20],
      end: [150, 20],
    },
    {
      orientation: 'vertical' as const,
      firstRect: [0, 0, 100, 40],
      secondRect: [0, 40, 100, 40],
      listRect: [0, 0, 100, 80],
      start: [50, 20],
      end: [50, 60],
    },
  ])(
    'selects tabs when dragging the indicator with $orientation orientation',
    async ({ orientation, firstRect, secondRect, listRect, start, end }) => {
      const onValueChange = vi.fn();
      render(
        <Tabs
          defaultValue="preview"
          orientation={orientation}
          onValueChange={onValueChange}
        >
          <Tabs.List aria-label="Draggable tabs">
            <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
            <Tabs.Trigger value="code">Code</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="preview">Preview panel</Tabs.Content>
          <Tabs.Content value="code">Code panel</Tabs.Content>
        </Tabs>,
      );

      const list = screen.getByRole('tablist');
      const previewTab = screen.getByRole('tab', { name: 'Preview' });
      const codeTab = screen.getByRole('tab', { name: 'Code' });
      const rect = ([left, top, width, height]: number[]) => ({
        x: left,
        y: top,
        left,
        top,
        right: left + width,
        bottom: top + height,
        width,
        height,
        toJSON: () => ({}),
      });
      vi.spyOn(list, 'getBoundingClientRect').mockReturnValue(rect(listRect));
      vi.spyOn(previewTab, 'getBoundingClientRect').mockReturnValue(
        rect(firstRect),
      );
      vi.spyOn(codeTab, 'getBoundingClientRect').mockReturnValue(
        rect(secondRect),
      );

      const pointerEvent = (
        target: Element,
        type: string,
        [clientX, clientY]: number[],
      ) => {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.defineProperties(event, {
          clientX: { value: clientX },
          clientY: { value: clientY },
          pointerId: { value: 1 },
          button: { value: 0 },
        });
        target.dispatchEvent(event);
      };

      pointerEvent(previewTab, 'pointerdown', start);
      pointerEvent(list, 'pointermove', end);
      pointerEvent(list, 'pointerup', end);

      expect(document.activeElement).toBe(codeTab);
      expect(onValueChange).toHaveBeenCalledWith('code');
      await waitFor(() => {
        expect(codeTab).toHaveAttribute('aria-selected', 'true');
      });
    },
  );

  it('keeps the previous tab selected when the indicator is released over a disabled tab', async () => {
    // Arrange
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="preview" onValueChange={onValueChange}>
        <Tabs.List aria-label="Draggable tabs with disabled end">
          <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
          <Tabs.Trigger value="code">Code</Tabs.Trigger>
          <Tabs.Trigger value="disabled" disabled>
            Disabled
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="preview">Preview panel</Tabs.Content>
        <Tabs.Content value="code">Code panel</Tabs.Content>
        <Tabs.Content value="disabled">Disabled panel</Tabs.Content>
      </Tabs>,
    );

    const list = screen.getByRole('tablist');
    const previewTab = screen.getByRole('tab', { name: 'Preview' });
    const codeTab = screen.getByRole('tab', { name: 'Code' });
    const disabledTab = screen.getByRole('tab', { name: 'Disabled' });
    const rect = (left: number, width: number) => ({
      x: left,
      y: 0,
      left,
      top: 0,
      right: left + width,
      bottom: 40,
      width,
      height: 40,
      toJSON: () => ({}),
    });
    vi.spyOn(list, 'getBoundingClientRect').mockReturnValue(rect(0, 300));
    vi.spyOn(previewTab, 'getBoundingClientRect').mockReturnValue(rect(0, 100));
    vi.spyOn(codeTab, 'getBoundingClientRect').mockReturnValue(rect(100, 100));
    vi.spyOn(disabledTab, 'getBoundingClientRect').mockReturnValue(
      rect(200, 100),
    );

    const pointerEvent = (target: Element, type: string, clientX: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, {
        clientX: { value: clientX },
        clientY: { value: 20 },
        pointerId: { value: 1 },
        button: { value: 0 },
      });
      target.dispatchEvent(event);
    };

    // Act
    pointerEvent(previewTab, 'pointerdown', 40);
    pointerEvent(list, 'pointermove', 240);
    pointerEvent(list, 'pointerup', 240);

    // Assert
    expect(onValueChange).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(previewTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});

function ControlledTabs() {
  const [value, setValue] = useState<string | null>('preview');

  return (
    <Tabs value={value} onValueChange={setValue}>
      <Tabs.List aria-label="Stateful example">
        <Tabs.Trigger value="preview">Preview</Tabs.Trigger>
        <Tabs.Trigger value="code">Code</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="preview">Preview panel</Tabs.Content>
      <Tabs.Content value="code">Code panel</Tabs.Content>
    </Tabs>
  );
}

describe('Tabs controlled state integration', () => {
  it('updates when the controlled parent accepts a selection', async () => {
    const user = userEvent.setup();
    render(<ControlledTabs />);

    await user.click(screen.getByRole('tab', { name: 'Code' }));

    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await waitFor(() =>
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Code panel'),
    );
  });

  describe('panel transitions', () => {
    function ThreeTabs({
      orientation,
    }: {
      orientation?: 'horizontal' | 'vertical';
    }) {
      return (
        <Tabs defaultValue="a" orientation={orientation}>
          <Tabs.List aria-label="Example">
            <Tabs.Trigger value="a">A</Tabs.Trigger>
            <Tabs.Trigger value="b">B</Tabs.Trigger>
            <Tabs.Trigger value="c">C</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="a">Panel A</Tabs.Content>
          <Tabs.Content value="b">
            <button type="button">Inside B</button>
          </Tabs.Content>
          <Tabs.Content value="c">Panel C</Tabs.Content>
        </Tabs>
      );
    }

    const panelOf = (text: string) =>
      screen.getByText(text).closest<HTMLElement>('[role="tabpanel"]');

    it('keeps the outgoing panel visible but inert until its exit finishes', async () => {
      const user = userEvent.setup();
      render(<ThreeTabs />);

      await user.click(screen.getByRole('tab', { name: 'B' }));

      expect(panelOf('Panel A')).not.toHaveAttribute('hidden');
      expect(panelOf('Panel A')).toHaveAttribute('inert');
      expect(panelOf('Panel A')).toHaveAttribute('tabindex', '-1');
      await waitFor(() => {
        expect(panelOf('Panel A')).toHaveAttribute('hidden');
      });
    });

    it.each(['horizontal', 'vertical'] as const)(
      'ends with only the last selected panel visible after rapid %s switching',
      async (orientation) => {
        const user = userEvent.setup();
        render(<ThreeTabs orientation={orientation} />);

        await user.click(screen.getByRole('tab', { name: 'B' }));
        await user.click(screen.getByRole('tab', { name: 'A' }));
        await user.click(screen.getByRole('tab', { name: 'C' }));

        await waitFor(() => {
          expect(panelOf('Panel A')).toHaveAttribute('hidden');
          expect(panelOf('Inside B')).toHaveAttribute('hidden');
        });
        expect(panelOf('Panel C')).not.toHaveAttribute('hidden');
        expect(panelOf('Panel C')).not.toHaveAttribute('inert');
        expect(screen.queryByRole('button', { name: 'Inside B' })).toBeNull();
      },
    );

    it('hides inactive panels immediately when reduced motion is preferred', async () => {
      const user = userEvent.setup();
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      try {
        render(<ThreeTabs />);
        await user.click(screen.getByRole('tab', { name: 'C' }));

        await waitFor(() => {
          expect(panelOf('Panel A')).toHaveAttribute('hidden');
        });
        expect(panelOf('Panel C')).not.toHaveAttribute('hidden');
      } finally {
        window.matchMedia = originalMatchMedia;
      }
    });
  });
});

type RecordedAnimation = {
  target: unknown;
  keyframes: Record<string, unknown>;
  stop: ReturnType<typeof vi.fn>;
  finish: () => void;
  then: (onFinished: () => void) => void;
};

describe('Tabs transition lifecycle', () => {
  const recordedAnimations: RecordedAnimation[] = [];

  beforeEach(() => {
    recordedAnimations.length = 0;
    vi.mocked(motionAnimate).mockImplementation(((
      target: unknown,
      keyframes: Record<string, unknown>,
    ) => {
      let onFinished: (() => void) | undefined;
      const recorded: RecordedAnimation = {
        target,
        keyframes,
        stop: vi.fn(),
        finish: () => onFinished?.(),
        then: (callback) => {
          onFinished = callback;
        },
      };
      recordedAnimations.push(recorded);
      return recorded as unknown as ReturnType<typeof motionAnimate>;
    }) as typeof motionAnimate);
  });

  afterEach(() => {
    vi.mocked(motionAnimate).mockReset();
  });

  function TwoTabs() {
    return (
      <Tabs defaultValue="a">
        <Tabs.List aria-label="Lifecycle">
          <Tabs.Trigger value="a">A</Tabs.Trigger>
          <Tabs.Trigger value="b">B</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="a">Panel A</Tabs.Content>
        <Tabs.Content value="b">Panel B</Tabs.Content>
      </Tabs>
    );
  }

  const panelOf = (text: string) =>
    screen.getByText(text).closest<HTMLElement>('[role="tabpanel"]');
  // Exit animations fade to opacity 0; enter animations use keyframe arrays.
  const exitsOf = (text: string) =>
    recordedAnimations.filter(
      (animation) =>
        animation.target === panelOf(text) && animation.keyframes.opacity === 0,
    );
  const entersOf = (text: string) =>
    recordedAnimations.filter(
      (animation) =>
        animation.target === panelOf(text) &&
        Array.isArray(animation.keyframes.opacity),
    );

  it('stops an in-flight exit when the panel is reselected and ignores its late completion', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TwoTabs />);

    // Act
    await user.click(screen.getByRole('tab', { name: 'B' }));
    const [firstExit] = exitsOf('Panel A');
    await user.click(screen.getByRole('tab', { name: 'A' }));
    await user.click(screen.getByRole('tab', { name: 'B' }));
    const secondExit = exitsOf('Panel A').at(-1);

    // Assert
    expect(firstExit).toBeDefined();
    expect(firstExit?.stop).toHaveBeenCalled();
    expect(secondExit).not.toBe(firstExit);

    act(() => firstExit?.finish());
    expect(panelOf('Panel A')).not.toHaveAttribute('hidden');

    act(() => secondExit?.finish());
    expect(panelOf('Panel A')).toHaveAttribute('hidden');
  });

  it('resumes a reversed exit from its current opacity instead of a full enter', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<TwoTabs />);

    // Act
    await user.click(screen.getByRole('tab', { name: 'B' }));
    await user.click(screen.getByRole('tab', { name: 'A' }));

    // Assert
    expect(entersOf('Panel A').at(-1)?.keyframes.opacity).toEqual([null, 1]);
    expect(panelOf('Panel A')).not.toHaveAttribute('hidden');
  });

  it('stops an in-flight exit when the tabs unmount', async () => {
    // Arrange
    const user = userEvent.setup();
    const { unmount } = render(<TwoTabs />);
    await user.click(screen.getByRole('tab', { name: 'B' }));
    const [exit] = exitsOf('Panel A');

    // Act
    unmount();

    // Assert
    expect(exit?.stop).toHaveBeenCalled();
  });
});

describe('Tabs animated highlight', () => {
  function getHighlightedTabs(tablist: HTMLElement) {
    return Array.from(
      tablist.querySelectorAll<HTMLElement>('[data-highlighted]'),
    );
  }

  it('renders one shared highlight as the first child of the tab list', () => {
    // Arrange
    render(<BasicTabs />);

    // Act
    const tablist = screen.getByRole('tablist', { name: 'Example' });

    // Assert
    const highlights = tablist.querySelectorAll('.notable-animated-highlight');
    expect(highlights).toHaveLength(1);
    expect(tablist.firstElementChild).toBe(highlights[0]);
    expect(highlights[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('moves the highlight to the pointer-hovered tab and clears it on leave', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<BasicTabs />);
    const tablist = screen.getByRole('tablist', { name: 'Example' });
    const code = screen.getByRole('tab', { name: 'Code' });

    // Act
    await user.hover(code);

    // Assert
    expect(getHighlightedTabs(tablist)).toEqual([code]);

    // Act
    await user.unhover(code);

    // Assert
    expect(getHighlightedTabs(tablist)).toEqual([]);
  });

  it('keeps a single highlight target while the pointer moves between tabs', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<BasicTabs />);
    const tablist = screen.getByRole('tablist', { name: 'Example' });
    const preview = screen.getByRole('tab', { name: 'Preview' });
    const code = screen.getByRole('tab', { name: 'Code' });

    // Act
    await user.hover(preview);
    await user.hover(code);

    // Assert
    expect(getHighlightedTabs(tablist)).toEqual([code]);
  });

  it('never highlights a disabled tab', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<BasicTabs />);
    const tablist = screen.getByRole('tablist', { name: 'Example' });
    const disabled = screen.getByRole('tab', { name: 'Disabled' });

    // Act
    await user.hover(disabled);

    // Assert
    expect(getHighlightedTabs(tablist)).toEqual([]);
  });

  it('highlights the keyboard-focused tab when it matches :focus-visible', async () => {
    // Arrange
    const user = userEvent.setup();
    const originalMatches = Element.prototype.matches;
    vi.spyOn(Element.prototype, 'matches').mockImplementation(function (
      this: Element,
      selector: string,
    ) {
      if (selector === ':focus-visible') {
        return this === document.activeElement;
      }
      return originalMatches.call(this, selector);
    });
    render(<BasicTabs />);
    const tablist = screen.getByRole('tablist', { name: 'Example' });
    const preview = screen.getByRole('tab', { name: 'Preview' });

    // Act
    await user.tab();

    // Assert
    expect(document.activeElement).toBe(preview);
    expect(getHighlightedTabs(tablist)).toEqual([preview]);
  });
});
