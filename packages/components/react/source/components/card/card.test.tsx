import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './card.js';
import { Card as PublicCard } from '../../index.js';

describe('Card', () => {
  it('renders a div with the card class by default', () => {
    // Arrange, Act
    render(<Card data-testid="card">Body</Card>);

    // Assert
    const card = screen.getByTestId('card');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('notable-card');
  });

  it('renders the semantic element selected with as', () => {
    render(
      <Card as="article" data-testid="card">
        Body
      </Card>,
    );

    expect(screen.getByTestId('card').tagName).toBe('ARTICLE');
  });

  it('applies padding none as a modifier class', () => {
    render(
      <Card padding="none" data-testid="card">
        Body
      </Card>,
    );

    expect(screen.getByTestId('card')).toHaveClass(
      'notable-card--padding-none',
    );
  });

  it('does not apply the padding none modifier by default', () => {
    render(<Card data-testid="card">Body</Card>);

    expect(screen.getByTestId('card')).not.toHaveClass(
      'notable-card--padding-none',
    );
  });

  it('merges custom className and forwards native attributes and style', () => {
    render(
      <Card
        className="custom"
        data-testid="card"
        id="billing"
        style={{ marginTop: 4 }}
      >
        Body
      </Card>,
    );

    const card = screen.getByTestId('card');
    expect(card).toHaveClass('notable-card', 'custom');
    expect(card).toHaveAttribute('id', 'billing');
    expect(card.style.marginTop).toBe('4px');
  });

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLElement>();
    render(<Card ref={ref}>Body</Card>);

    expect(ref.current).toHaveClass('notable-card');
  });

  it('renders compound parts with their classes and default elements', () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Billing</Card.Title>
          <Card.Description>Manage your plan.</Card.Description>
        </Card.Header>
        <Card.Content>Current plan: Pro</Card.Content>
        <Card.Footer>
          <button type="button">Save</button>
        </Card.Footer>
      </Card>,
    );

    const title = screen.getByRole('heading', { level: 3, name: 'Billing' });
    expect(title).toHaveClass('notable-card__title');
    expect(screen.getByText('Manage your plan.')).toHaveClass(
      'notable-card__description',
    );
    expect(screen.getByText('Manage your plan.').tagName).toBe('P');
    expect(screen.getByText('Current plan: Pro')).toHaveClass(
      'notable-card__content',
    );
    expect(screen.getByText('Save').parentElement).toHaveClass(
      'notable-card__footer',
    );
    expect(screen.getByText('Billing').parentElement).toHaveClass(
      'notable-card__header',
    );
  });

  it('renders Card.Title with the as prop', () => {
    render(<Card.Title as="h2">Settings</Card.Title>);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Settings' }),
    ).toBeInTheDocument();
  });

  it('renders Card.Description as a div when requested', () => {
    render(<Card.Description as="div">Details</Card.Description>);

    expect(screen.getByText('Details').tagName).toBe('DIV');
  });

  it('forwards refs from compound parts', () => {
    const headerRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLElement>();
    const descriptionRef = createRef<HTMLElement>();
    const contentRef = createRef<HTMLDivElement>();
    const footerRef = createRef<HTMLDivElement>();

    render(
      <Card>
        <Card.Header ref={headerRef}>
          <Card.Title ref={titleRef}>Title</Card.Title>
          <Card.Description ref={descriptionRef}>Description</Card.Description>
        </Card.Header>
        <Card.Content ref={contentRef}>Content</Card.Content>
        <Card.Footer ref={footerRef}>Footer</Card.Footer>
      </Card>,
    );

    expect(headerRef.current).toHaveClass('notable-card__header');
    expect(titleRef.current).toHaveClass('notable-card__title');
    expect(descriptionRef.current).toHaveClass('notable-card__description');
    expect(contentRef.current).toHaveClass('notable-card__content');
    expect(footerRef.current).toHaveClass('notable-card__footer');
  });

  it('is exported from the package entry point', () => {
    expect(PublicCard).toBe(Card);
    expect(PublicCard.Header).toBe(Card.Header);
    expect(PublicCard.Title).toBe(Card.Title);
    expect(PublicCard.Description).toBe(Card.Description);
    expect(PublicCard.Content).toBe(Card.Content);
    expect(PublicCard.Footer).toBe(Card.Footer);
  });
});
