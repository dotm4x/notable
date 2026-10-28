import { fireEvent, render, screen } from '@testing-library/react';
import { CircleHelp } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from './avatar.js';
import { Avatar as PublicAvatar } from '../../index.js';

describe('Avatar', () => {
  it('renders a default fallback icon', () => {
    const { container } = render(<Avatar data-testid="avatar" />);

    expect(screen.getByTestId('avatar')).toHaveClass('notable-avatar--medium');
    expect(
      container.querySelector('.notable-avatar__fallback--default'),
    ).toBeInTheDocument();
  });

  it('renders the image after it loads and hides the fallback', () => {
    render(
      <Avatar>
        <Avatar.Image src="/avatar.png" alt="Max Perez" />
        <Avatar.Fallback>MX</Avatar.Fallback>
      </Avatar>,
    );

    const image = screen.getByAltText('Max Perez');
    const fallback = screen.getByText('MX');

    expect(image).toHaveAttribute('hidden');
    expect(fallback).toBeVisible();

    fireEvent.load(image);

    expect(image).not.toHaveAttribute('hidden');
    expect(fallback).not.toBeVisible();
  });

  it('hides the default icon when an image loads', () => {
    const { container } = render(
      <Avatar>
        <Avatar.Image src="/avatar.png" alt="Max Perez" />
      </Avatar>,
    );
    const defaultFallback = container.querySelector(
      '.notable-avatar__fallback--default',
    );

    expect(defaultFallback).toBeVisible();
    fireEvent.load(screen.getByAltText('Max Perez'));
    expect(defaultFallback).not.toBeVisible();
  });

  it('renders custom fallback content when no image is provided', () => {
    render(
      <Avatar>
        <Avatar.Fallback>
          <CircleHelp aria-hidden="true" data-testid="fallback-icon" />
          <span>Help</span>
        </Avatar.Fallback>
      </Avatar>,
    );

    expect(screen.getByTestId('fallback-icon')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeVisible();
  });

  it('renders custom fallback after image failure', () => {
    render(
      <Avatar>
        <Avatar.Image src="/broken.png" alt="Alex" />
        <Avatar.Fallback>AL</Avatar.Fallback>
      </Avatar>,
    );

    const image = screen.getByAltText('Alex');
    fireEvent.error(image);

    expect(image).toHaveAttribute('hidden');
    expect(screen.getByText('AL')).toBeVisible();
  });

  it('shows the default icon when an image fails without a custom fallback', () => {
    const { container } = render(
      <Avatar>
        <Avatar.Image src="/broken.png" alt="Sam" />
      </Avatar>,
    );

    fireEvent.error(screen.getByAltText('Sam'));

    expect(
      container.querySelector('.notable-avatar__fallback--default'),
    ).toBeVisible();
  });

  it('resets the image state when its source changes', () => {
    const { rerender } = render(
      <Avatar>
        <Avatar.Image src="/first.png" alt="A user" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar>,
    );

    fireEvent.load(screen.getByAltText('A user'));

    rerender(
      <Avatar>
        <Avatar.Image src="/second.png" alt="A user" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar>,
    );

    expect(screen.getByAltText('A user')).toHaveAttribute('hidden');
    expect(screen.getByText('AB')).toBeVisible();

    fireEvent.load(screen.getByAltText('A user'));

    expect(screen.getByAltText('A user')).not.toHaveAttribute('hidden');
    expect(screen.getByText('AB')).not.toBeVisible();

    fireEvent.error(screen.getByAltText('A user'));
    expect(screen.getByText('AB')).toBeVisible();

    rerender(
      <Avatar>
        <Avatar.Image src="/third.png" alt="A user" />
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar>,
    );

    expect(screen.getByAltText('A user')).toHaveAttribute('hidden');
    expect(screen.getByText('AB')).toBeVisible();

    fireEvent.load(screen.getByAltText('A user'));
    expect(screen.getByAltText('A user')).not.toHaveAttribute('hidden');
    expect(screen.getByText('AB')).not.toBeVisible();
  });

  it.each(['small', 'medium', 'large', 'extra-large'] as const)(
    'supports the %s size',
    (size) => {
      render(<Avatar size={size} data-testid="avatar" />);

      expect(screen.getByTestId('avatar')).toHaveClass(
        `notable-avatar--${size}`,
      );
    },
  );

  it('forwards classes and HTML attributes', () => {
    render(
      <Avatar
        className="custom-avatar"
        id="profile-avatar"
        title="Profile"
        data-testid="avatar"
        aria-label="Profile avatar"
      />,
    );

    expect(screen.getByTestId('avatar')).toHaveClass('custom-avatar');
    expect(screen.getByTestId('avatar')).toHaveAttribute(
      'id',
      'profile-avatar',
    );
    expect(screen.getByTestId('avatar')).toHaveAccessibleName('Profile avatar');
  });

  it('preserves image alt text and native image attributes', () => {
    render(
      <Avatar>
        <Avatar.Image
          src="/avatar.png"
          alt="Taylor"
          srcSet="/avatar-2x.png 2x"
          sizes="40px"
          data-testid="avatar-image"
          onLoad={vi.fn()}
        />
      </Avatar>,
    );

    expect(screen.getByTestId('avatar-image')).toHaveAttribute('alt', 'Taylor');
    expect(screen.getByTestId('avatar-image')).toHaveAttribute(
      'srcset',
      '/avatar-2x.png 2x',
    );
    expect(screen.getByTestId('avatar-image')).toHaveAttribute('sizes', '40px');
  });

  it('exports Avatar with its compound components publicly', () => {
    expect(PublicAvatar).toBe(Avatar);
    expect(PublicAvatar.Image).toBe(Avatar.Image);
    expect(PublicAvatar.Fallback).toBe(Avatar.Fallback);
  });
});
