export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'remove',
        'docs',
        'refactor',
        'test',
        'chore',
        'style',
        'perf',
        'build',
        'ci',
        'revert',
      ],
    ],
  },
};
