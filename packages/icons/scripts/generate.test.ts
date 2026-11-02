import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

describe('icon generator', () => {
  it('runs successfully', () => {
    execFileSync(
      'node',
      ['--experimental-strip-types', 'scripts/generate.ts'],
      { stdio: 'inherit' },
    );
  });

  it('generates components', () => {
    expect(
      existsSync('source/icons/components/arrow-right/arrow-right.tsx'),
    ).toBe(true);
    const content = readFileSync(
      'source/icons/components/arrow-right/arrow-right.tsx',
      'utf8',
    );
    expect(content).toContain('createIcon');
    expect(content).toContain('ArrowRight');
  });

  it('generates barrel', () => {
    expect(existsSync('source/generated.ts')).toBe(true);
  });
});
