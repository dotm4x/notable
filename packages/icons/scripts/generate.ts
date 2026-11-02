import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import { XMLParser } from 'fast-xml-parser';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svgRoot = join(packageRoot, 'source', 'icons', 'svg');
const componentsRoot = join(packageRoot, 'source', 'icons', 'components');
const schemaPath = join(packageRoot, 'source', 'icons', 'metadata.schema.json');

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  allowBooleanAttributes: true,
});

const SUPPORTED_ELEMENTS = new Set([
  'path',
  'circle',
  'rect',
  'line',
  'polyline',
  'polygon',
  'ellipse',
]);

function toPascalCase(name: string): string {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid JSON in ${path}: ${(error as Error).message}`);
  }
}

const ajv = new Ajv({ allErrors: true });
const validateSchema = ajv.compile(readJson(schemaPath) as object);

function validateMetadata(
  iconName: string,
  metadata: unknown,
  filePath: string,
): void {
  const { $schema: _schema, ...payload } = (metadata ?? {}) as Record<
    string,
    unknown
  >;
  void _schema;
  const valid = validateSchema(payload);
  if (!valid) {
    const errors = (validateSchema.errors ?? [])
      .map((e) => `${e.instancePath || '/'} ${e.message}`)
      .join('; ');
    throw new Error(
      `Invalid metadata for "${iconName}" (${filePath}): ${errors}`,
    );
  }
  const m = metadata as Record<string, unknown>;
  if (m.name !== iconName) {
    throw new Error(
      `Metadata name mismatch for "${iconName}" (${filePath}): expected "${iconName}", got "${String(m.name)}".`,
    );
  }
}

function toNumber(value: unknown): string | number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && /^-?\\d+(\\.\\d+)?$/.test(value))
    return Number(value);
  return String(value);
}

function parseSvg(
  iconName: string,
  filePath: string,
  svg: string,
): Array<[string, Record<string, string | number>]> {
  const doc = xmlParser.parse(svg) as Record<string, unknown>;
  const root = doc.svg as Record<string, unknown> | undefined;
  if (!root)
    throw new Error(`Missing root <svg> in icon "${iconName}" (${filePath}).`);

  const nodes: Array<[string, Record<string, string | number>]> = [];
  for (const [key, value] of Object.entries(root)) {
    if (key.startsWith('@_')) continue;
    const entries = Array.isArray(value) ? value : [value];
    for (const entry of entries as Array<Record<string, unknown>>) {
      const tag = key.toLowerCase();
      if (!SUPPORTED_ELEMENTS.has(tag)) {
        throw new Error(
          `Unsupported SVG element "${tag}" in icon "${iconName}" (${filePath}).`,
        );
      }
      const attrs: Record<string, string | number> = {};
      if (entry && typeof entry === 'object') {
        for (const [attrKey, attrValue] of Object.entries(
          entry as Record<string, unknown>,
        )) {
          if (attrKey === '#text') {
            throw new Error(
              `Text nodes are not supported in icon "${iconName}" (${filePath}).`,
            );
          }
          if (!attrKey.startsWith('@_')) {
            throw new Error(
              `Nested elements are not supported in icon "${iconName}" (${filePath}).`,
            );
          }
          const rawName = attrKey.slice(2);
          const jsxName =
            rawName === 'class'
              ? 'className'
              : rawName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
          attrs[jsxName] = toNumber(attrValue);
        }
      }
      if (Object.keys(attrs).length === 0) {
        throw new Error(
          `SVG element "${tag}" in icon "${iconName}" (${filePath}) has no attributes.`,
        );
      }
      nodes.push([tag, attrs]);
    }
  }
  if (nodes.length === 0) {
    throw new Error(
      `No SVG elements found in icon "${iconName}" (${filePath}).`,
    );
  }
  return nodes;
}

function buildJSDoc(metadata: Record<string, unknown>): string {
  const lines: string[] = ['/**'];
  const description =
    typeof metadata.description === 'string'
      ? metadata.description
      : `${toPascalCase(String(metadata.name))} icon.`;
  lines.push(` * ${description}`);
  lines.push(' */');
  return lines.join('\n');
}

function generateComponent(
  iconName: string,
  metadata: Record<string, unknown>,
  nodes: Array<[string, Record<string, string | number>]>,
): string {
  const componentName = toPascalCase(iconName);
  const nodeLiteral = nodes
    .map(([tag, attrs]) => {
      const attrEntries = Object.entries(attrs)
        .map(([key, value]) => `      ${key}: ${JSON.stringify(value)},`)
        .join('\n');
      return `  [\n    '${tag}',\n    {\n${attrEntries}\n    },\n  ],`;
    })
    .join('\n');
  const jsdoc = buildJSDoc(metadata);
  return `import { createIcon } from '../../../internal/helpers/create-icon.js';
import type { TIconNode } from '../../../internal/primitives/icon.js';

const iconNode: TIconNode = [
${nodeLiteral}
] as TIconNode;

${jsdoc}
export const ${componentName} = createIcon({
  name: '${componentName}',
  iconNode,
});
`;
}

function main(): void {
  if (!existsSync(schemaPath)) {
    throw new Error(`Metadata schema not found: ${schemaPath}`);
  }
  readJson(schemaPath);

  const iconDirs = readdirSync(svgRoot, { withFileTypes: true })
    .filter((entry: { isDirectory: () => boolean }) => entry.isDirectory())
    .map((entry: { name: string }) => entry.name)
    .sort();

  type Prepared = {
    iconName: string;
    metadata: Record<string, unknown>;
    nodes: Array<[string, Record<string, string | number>]>;
    component: string;
    indexContent: string;
  };
  const prepared: Prepared[] = [];

  for (const iconName of iconDirs) {
    const iconDir = join(svgRoot, iconName);
    const svgPath = join(iconDir, 'icon.svg');
    const jsonPath = join(iconDir, 'icon.json');

    if (!existsSync(svgPath)) {
      throw new Error(`Missing icon.svg for "${iconName}" (${svgPath}).`);
    }
    if (!existsSync(jsonPath)) {
      throw new Error(`Missing icon.json for "${iconName}" (${jsonPath}).`);
    }

    const svg = readFileSync(svgPath, 'utf8');
    const metadata = readJson(jsonPath);
    validateMetadata(iconName, metadata, jsonPath);
    const nodes = parseSvg(iconName, svgPath, svg);
    prepared.push({
      iconName,
      metadata: metadata as Record<string, unknown>,
      nodes,
      component: generateComponent(
        iconName,
        metadata as Record<string, unknown>,
        nodes,
      ),
      indexContent: `export * from './${iconName}.js';\n`,
    });
  }

  const names = new Map<string, string>();
  for (const item of prepared) {
    const pascal = toPascalCase(item.iconName);
    if (names.has(pascal)) {
      throw new Error(
        `Duplicate component name "${pascal}" from icons "${names.get(pascal)}" and "${item.iconName}".`,
      );
    }
    names.set(pascal, item.iconName);
  }

  function writeFileIfChanged(filePath: string, content: string): void {
    if (existsSync(filePath)) {
      const current = readFileSync(filePath, 'utf8');
      if (current === content) return;
    }
    mkdirSync(join(filePath, '..'), { recursive: true });
    writeFileSync(filePath, content, 'utf8');
  }

  for (const item of prepared) {
    const componentDir = join(componentsRoot, item.iconName);
    mkdirSync(componentDir, { recursive: true });
    writeFileIfChanged(
      join(componentDir, `${item.iconName}.tsx`),
      item.component,
    );
    writeFileIfChanged(join(componentDir, 'index.ts'), item.indexContent);
  }

  const generatedBarrel = join(packageRoot, 'source', 'generated.ts');
  const barrelContent =
    prepared
      .map(
        (item) =>
          `export * from './icons/components/${item.iconName}/index.js';`,
      )
      .sort()
      .join('\n') + '\n';
  writeFileIfChanged(generatedBarrel, barrelContent);

  console.log(`Generated ${prepared.length} icons.`);
}

main();
