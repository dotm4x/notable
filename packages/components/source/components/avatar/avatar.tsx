import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
} from 'react';
import './avatar.css';

/** Available avatar sizes. */
export type AvatarSize = 'small' | 'medium' | 'large' | 'extra-large';

/** Props for the {@link Avatar} root component. */
export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Size inherited by the image and fallback content. */
  size?: AvatarSize;
  /** Compose `Avatar.Image`, `Avatar.Fallback`, or both as children. */
  children?: ReactNode;
};

/** Native image attributes accepted by `Avatar.Image`. */
export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

/** Props for `Avatar.Fallback`. */
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  /** Text, an icon, or other fallback content. */
  children?: ReactNode;
};

type AvatarContextValue = {
  activeSource: string | null;
  loadedSource: string | null;
  setLoadedSource: (source: string | null) => void;
};

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = useContext(AvatarContext);

  if (!context) {
    throw new Error(
      'Avatar.Image and Avatar.Fallback must be used within Avatar.',
    );
  }

  return context;
}

/**
 * Root component for composing an image and fallback content. Shows a built-in
 * user icon when no custom fallback is provided or the image is unavailable.
 */
function AvatarRoot({
  children,
  className,
  size = 'medium',
  ...props
}: AvatarProps) {
  const [loadedSource, setLoadedSource] = useState<string | null>(null);
  const childItems = Children.toArray(children);
  const imageChild = childItems.find(
    (child): child is ReactElement<AvatarImageProps> =>
      isValidElement<AvatarImageProps>(child) && child.type === Avatar.Image,
  );
  const activeSource =
    imageChild && (imageChild.props.src || imageChild.props.srcSet)
      ? JSON.stringify([
          imageChild.props.src ?? '',
          imageChild.props.srcSet ?? '',
          imageChild.props.sizes ?? '',
        ])
      : null;
  const hasCustomFallback = childItems.some(
    (child) => isValidElement(child) && child.type === Avatar.Fallback,
  );
  const classes = ['notable-avatar', `notable-avatar--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <AvatarContext.Provider
      value={{ activeSource, loadedSource, setLoadedSource }}
    >
      <span {...props} className={classes}>
        {!hasCustomFallback && (
          <span
            className="notable-avatar__fallback notable-avatar__fallback--default"
            aria-hidden="true"
            hidden={activeSource !== null && loadedSource === activeSource}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </span>
        )}
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

/**
 * Shows the avatar image after it loads and accepts native image attributes.
 * Renders no image when both `src` and `srcSet` are omitted.
 */
function AvatarImage({
  alt,
  className,
  onError,
  onLoad,
  sizes,
  src,
  srcSet,
  ...props
}: AvatarImageProps) {
  const { loadedSource, setLoadedSource } = useAvatarContext();
  const sourceKey = JSON.stringify([src ?? '', srcSet ?? '', sizes ?? '']);
  const isLoaded = loadedSource === sourceKey;

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoadedSource(sourceKey);
    onLoad?.(event);
  };

  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    setLoadedSource(null);
    onError?.(event);
  };

  if (!src && !srcSet) {
    return null;
  }

  return (
    <img
      {...props}
      alt={alt}
      className={['notable-avatar__image', className].filter(Boolean).join(' ')}
      hidden={!isLoaded}
      onError={handleError}
      onLoad={handleLoad}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
    />
  );
}

/** Shows fallback content until the current image has loaded. */
function AvatarFallback({
  children,
  className,
  ...props
}: AvatarFallbackProps) {
  const { activeSource, loadedSource } = useAvatarContext();

  return (
    <span
      {...props}
      className={['notable-avatar__fallback', className]
        .filter(Boolean)
        .join(' ')}
      hidden={activeSource !== null && loadedSource === activeSource}
    >
      {children}
    </span>
  );
}

/**
 * Compound avatar component. Compose `Avatar.Image` and `Avatar.Fallback` as
 * children of the root component.
 */
export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
