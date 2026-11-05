import { Children, forwardRef, isValidElement, useRef } from 'react';
import { AnimatedHighlight } from '../../../internal/primitives/animated-highlight/animated-highlight.js';
import { useHighlightTarget } from '../../../internal/primitives/animated-highlight/use-highlight-target.js';
import { Drawer } from '../../drawer/drawer.js';
import { SidebarContext } from '../context.js';
import { sidebarHighlightSelector } from '../helpers/highlight.js';
import { useSidebarRoot } from '../hooks/use-sidebar-root.js';
import type { TSidebarInsetProps, TSidebarRootProps } from '../types.js';

export const SidebarInsetElement = forwardRef<
  HTMLDivElement,
  TSidebarInsetProps
>(function SidebarInsetElement({ className, ...props }, ref) {
  return (
    <div
      {...props}
      ref={ref}
      className={['one-sidebar__inset', className].filter(Boolean).join(' ')}
    />
  );
});

export const SidebarRoot = forwardRef<HTMLDivElement, TSidebarRootProps>(
  function SidebarRoot(
    {
      open,
      defaultOpen = true,
      onOpenChange,
      width = '16rem',
      collapsedWidth = '3rem',
      mobileWidth = '18rem',
      keyboardShortcut = 'b',
      animateOnHover = true,
      label = 'Sidebar',
      className,
      style,
      children,
      ...props
    },
    ref,
  ) {
    const sidebarRef = useRef<HTMLElement | null>(null);
    const {
      sidebarId,
      isMobile,
      isOpen,
      mobileOpen,
      setMobileOpen,
      setOpen,
      toggleSidebar,
      sidebarStyle,
      mobileDrawerStyle,
    } = useSidebarRoot({
      open,
      defaultOpen,
      onOpenChange,
      keyboardShortcut,
      width,
      collapsedWidth,
      mobileWidth,
    });
    const {
      handlePointerOver,
      handlePointerLeave,
      handleFocusCapture,
      handleBlurCapture,
    } = useHighlightTarget({
      enabled: animateOnHover,
      containerRef: sidebarRef,
      selector: sidebarHighlightSelector,
    });

    const context = {
      open: isOpen,
      isMobile,
      mobileOpen,
      sidebarId,
      setOpen,
      setMobileOpen,
      toggleSidebar,
    };
    const layoutChildren = Children.toArray(children);
    const sidebarChildren = layoutChildren.filter(
      (child) => !isValidElement(child) || child.type !== SidebarInsetElement,
    );
    const insetChildren = layoutChildren.filter(
      (child) => isValidElement(child) && child.type === SidebarInsetElement,
    );
    const classes = ['one-sidebar-layout', className].filter(Boolean).join(' ');

    const sidebar = (
      <nav
        ref={sidebarRef}
        id={sidebarId}
        aria-label={label}
        data-state={isMobile || isOpen ? 'expanded' : 'collapsed'}
        data-collapsible={isMobile || isOpen ? 'none' : 'icon'}
        data-animate-on-hover={animateOnHover ? 'true' : 'false'}
        className="one-sidebar"
        style={sidebarStyle}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={handleFocusCapture}
        onBlurCapture={handleBlurCapture}
      >
        <AnimatedHighlight
          className="one-sidebar__highlight"
          followTargetShape
        />
        {sidebarChildren}
      </nav>
    );

    return (
      <SidebarContext.Provider value={context}>
        <div
          {...props}
          ref={ref}
          className={classes}
          data-state={isOpen ? 'expanded' : 'collapsed'}
          data-mobile={isMobile ? 'true' : undefined}
          style={{ ...style }}
        >
          {isMobile ? (
            <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left">
              <Drawer.Content
                className="one-sidebar__mobile-drawer"
                showCloseButton={false}
                aria-label={label}
                style={mobileDrawerStyle}
              >
                {sidebar}
              </Drawer.Content>
            </Drawer>
          ) : (
            sidebar
          )}
          {insetChildren}
        </div>
      </SidebarContext.Provider>
    );
  },
);
