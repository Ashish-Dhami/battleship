export default {
  extends: ['stylelint-config-standard'],
  ignoreFiles: ['node_modules/**', 'dist/**', 'coverage/**'],
  rules: {
    'selector-class-pattern': [
      '^[a-z][a-zA-Z0-9]*(_[a-zA-Z0-9]+)?$',
      {
        message: 'Class names must be camelCase with optional _modifier (e.g. button, button_primary)',
      },
    ],
  },
}

