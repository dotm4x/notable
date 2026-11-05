/** Descriptive metadata for a single icon, derived from its `icon.json`. */
export interface TIconMetadata {
  /** Kebab-case source folder name. */
  name: string;
  /** PascalCase React component exported from `@dotm4x/one/icons`. */
  component: string;
  /** Human-readable description. */
  description: string;
  /** Search terms for the icon. */
  keywords: string[];
  /** Groups the icon belongs to, such as `ui` or `navigation`. */
  categories: string[];
  /** Optional free-form tags. */
  tags: string[];
  /** Alternative names the icon may be known by. */
  aliases: string[];
  /** Intended contexts for using the icon. */
  useCases: string[];
  /** People who contributed the icon. */
  contributors: string[];
}
