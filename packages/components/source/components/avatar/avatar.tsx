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

/** Tamaños disponibles para el avatar. */
export type AvatarSize = 'small' | 'medium' | 'large' | 'extra-large';

/** Propiedades del componente raíz {@link Avatar}. */
export type AvatarProps = HTMLAttributes<HTMLSpanElement> & {
  /** Tamaño heredado por la imagen y el contenido alternativo. */
  size?: AvatarSize;
  /** Permite componer aquí `Avatar.Image` o `Avatar.Fallback`, o ambos. */
  children?: ReactNode;
};

/** Atributos nativos de imagen aceptados por `Avatar.Image`. */
export type AvatarImageProps = ImgHTMLAttributes<HTMLImageElement>;

/** Propiedades de `Avatar.Fallback`. */
export type AvatarFallbackProps = HTMLAttributes<HTMLSpanElement> & {
  /** Texto, icono u otro contenido alternativo. */
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
 * Componente raíz para combinar una imagen y contenido alternativo. Muestra
 * un icono de usuario integrado si no se proporciona un contenido alternativo
 * personalizado o si la imagen no está disponible.
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
 * Muestra la imagen del avatar cuando termina de cargar y acepta atributos
 * nativos de imagen. No renderiza una imagen si faltan `src` y `srcSet`.
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

/** Muestra el contenido alternativo hasta que carga la imagen actual. */
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
 * Componente compuesto de avatar. Combina `Avatar.Image` y `Avatar.Fallback`
 * como elementos secundarios del componente raíz.
 */
export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
});
