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

export type AvatarSize = 'small' | 'medium' | 'large' | 'extra-large';

export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  size?: AvatarSize;
  children?: ReactNode;
};

export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
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
  const classes = ['bodypop-avatar', `bodypop-avatar--${size}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <AvatarContext.Provider
      value={{ activeSource, loadedSource, setLoadedSource }}
    >
      <span {...props} className={classes}>
        {!hasCustomFallback && (
          <span
            className="bodypop-avatar__fallback bodypop-avatar__fallback--default"
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
      className={['bodypop-avatar__image', className].filter(Boolean).join(' ')}
      hidden={!isLoaded}
      onError={handleError}
      onLoad={handleLoad}
      sizes={sizes}
      src={src}
      srcSet={srcSet}
    />
  );
}

function AvatarFallback({
  children,
  className,
  ...props
}: AvatarFallbackProps) {
  const { activeSource, loadedSource } = useAvatarContext();

  return (
    <span
      {...props}
      className={['bodypop-avatar__fallback', className]
        .filter(Boolean)
        .join(' ')}
      hidden={activeSource !== null && loadedSource === activeSource}
    >
      {children}
    </span>
  );
}

export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
