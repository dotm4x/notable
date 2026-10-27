export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'add',
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
