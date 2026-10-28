import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Empty } from './empty.js';
import { Empty as PublicEmpty } from '../../index.js';

describe('Empty', () => {
  it('renders a div with the empty class by default', () => {
    render(<Empty data-testid="empty">Body</Empty>);

    const empty = screen.getByTestId('empty');
    expect(empty.tagName).toBe('DIV');
    expect(empty).toHaveClass('notable-empty');
    expect(empty).not.toHaveClass('notable-empty--variant-outline');
    expect(empty).not.toHaveClass('notable-empty--size-compact');
  });

  it('exposes every compound member on the root at runtime', () => {
    expect(Empty.Header).toBeTypeOf('object');
    expect(Empty.Media).toBeTypeOf('object');
    expect(Empty.Title).toBeTypeOf('object');
    expect(Empty.Description).toBeTypeOf('object');
    expect(Empty.Content).toBeTypeOf('object');
  });

  it('is exported through the package entry point with its members', () => {
    expect(PublicEmpty).toBe(Empty);
    expect(PublicEmpty.Header).toBe(Empty.Header);
  });

  it('renders the full namespace composition', () => {
    render(
      <Empty>
        <Empty.Header>
          <Empty.Media variant="icon">
            <svg aria-hidden="true" />
          </Empty.Media>
          <Empty.Title>No projects yet</Empty.Title>
          <Empty.Description>Create your first project.</Empty.Description>
        </Empty.Header>
        <Empty.Content>
          <button type="button">Create project</button>
        </Empty.Content>
      </Empty>,
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'No projects yet' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Create your first project.').tagName).toBe('P');
    expect(
      screen.getByRole('button', { name: 'Create project' }),
    ).toBeInTheDocument();
  });

  it('renders without optional parts', () => {
    render(
      <Empty>
        <Empty.Title>Nothing here</Empty.Title>
      </Empty>,
    );

    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeVisible();
    expect(
      document.querySelector('.notable-empty__description'),
    ).not.toBeInTheDocument();
  });

  it('applies the outline and surface variant modifiers', () => {
    const { rerender } = render(
      <Empty variant="outline" data-testid="empty">
        Body
      </Empty>,
    );

    expect(screen.getByTestId('empty')).toHaveClass(
      'notable-empty--variant-outline',
    );

    rerender(
      <Empty variant="surface" data-testid="empty">
        Body
      </Empty>,
    );

    expect(screen.getByTestId('empty')).toHaveClass(
      'notable-empty--variant-surface',
    );
  });

  it('applies the compact and spacious size modifiers', () => {
    const { rerender } = render(
      <Empty size="compact" data-testid="empty">
        Body
      </Empty>,
    );

    expect(screen.getByTestId('empty')).toHaveClass(
      'notable-empty--size-compact',
    );

    rerender(
      <Empty size="spacious" data-testid="empty">
        Body
      </Empty>,
    );

    expect(screen.getByTestId('empty')).toHaveClass(
      'notable-empty--size-spacious',
    );
  });

  it('merges custom classes and forwards native attributes and refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Empty ref={ref} className="custom" id="empty-id" data-testid="empty">
        Body
      </Empty>,
    );

    const empty = screen.getByTestId('empty');
    expect(empty).toHaveClass('notable-empty', 'custom');
    expect(empty).toHaveAttribute('id', 'empty-id');
    expect(ref.current).toBe(empty);
  });

  it('renders arbitrary children inside the root', () => {
    render(
      <Empty>
        <span>Custom child</span>
      </Empty>,
    );

    expect(screen.getByText('Custom child')).toBeInTheDocument();
  });
});

describe('Empty.Header', () => {
  it('renders children in a header region with a custom class', () => {
    render(
      <Empty.Header className="custom" data-testid="header">
        <span>Header content</span>
      </Empty.Header>,
    );

    const header = screen.getByTestId('header');
    expect(header).toHaveClass('notable-empty__header', 'custom');
    expect(header).toContainElement(screen.getByText('Header content'));
  });

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Empty.Header ref={ref}>Header</Empty.Header>);

    expect(ref.current).toHaveClass('notable-empty__header');
  });
});

describe('Empty.Media', () => {
  it('renders custom media without the icon modifier by default', () => {
    render(
      <Empty.Media data-testid="media">
        <img
          alt="Team illustration"
          src="data:image/gif;base64,R0lGODlhAQABAAAAACw="
        />
      </Empty.Media>,
    );

    const media = screen.getByTestId('media');
    expect(media).toHaveClass('notable-empty__media');
    expect(media).not.toHaveClass('notable-empty__media--variant-icon');
    expect(
      screen.getByRole('img', { name: 'Team illustration' }),
    ).toBeInTheDocument();
  });

  it('applies the icon modifier for the icon variant', () => {
    render(
      <Empty.Media variant="icon" data-testid="media">
        <svg aria-hidden="true" />
      </Empty.Media>,
    );

    expect(screen.getByTestId('media')).toHaveClass(
      'notable-empty__media--variant-icon',
    );
  });

  it('keeps decorative icons out of the accessibility tree', () => {
    render(
      <Empty.Media variant="icon">
        <svg aria-hidden="true" data-testid="icon" />
      </Empty.Media>,
    );

    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});

describe('Empty.Title', () => {
  it('renders an h3 heading by default', () => {
    render(<Empty.Title>No results</Empty.Title>);

    const title = screen.getByRole('heading', {
      level: 3,
      name: 'No results',
    });
    expect(title).toHaveClass('notable-empty__title');
  });

  it('renders the heading level selected with as', () => {
    render(<Empty.Title as="h2">Section empty</Empty.Title>);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Section empty' }),
    ).toBeInTheDocument();
  });

  it('forwards refs and native attributes', () => {
    const ref = createRef<HTMLElement>();

    render(
      <Empty.Title ref={ref} id="title-id">
        Title
      </Empty.Title>,
    );

    expect(ref.current).toHaveAttribute('id', 'title-id');
  });
});

describe('Empty.Description', () => {
  it('renders a paragraph by default', () => {
    render(<Empty.Description>Nothing matches.</Empty.Description>);

    expect(screen.getByText('Nothing matches.').tagName).toBe('P');
  });

  it('renders a div when as is set to div', () => {
    render(
      <Empty.Description as="div">
        <ul>
          <li>First tip</li>
        </ul>
      </Empty.Description>,
    );

    const description = screen.getByText('First tip').closest('div');
    expect(description).toHaveClass('notable-empty__description');
  });

  it('supports inline links that remain independently accessible', () => {
    render(
      <Empty.Description>
        Read the <a href="/docs">documentation</a> for more.
      </Empty.Description>,
    );

    expect(screen.getByRole('link', { name: 'documentation' })).toHaveAttribute(
      'href',
      '/docs',
    );
  });
});

describe('Empty.Content', () => {
  it('renders multiple actions in order', () => {
    render(
      <Empty.Content data-testid="content">
        <button type="button">Create</button>
        <button type="button">Import</button>
      </Empty.Content>,
    );

    expect(screen.getByTestId('content')).toHaveClass('notable-empty__content');
    expect(
      screen.getAllByRole('button').map((button) => button.textContent),
    ).toEqual(['Create', 'Import']);
  });

  it('renders supplementary form controls', () => {
    render(
      <Empty.Content>
        <input aria-label="Search" type="search" />
      </Empty.Content>,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search' }),
    ).toBeInTheDocument();
  });

  it('forwards refs', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Empty.Content ref={ref}>Actions</Empty.Content>);

    expect(ref.current).toHaveClass('notable-empty__content');
  });
});
