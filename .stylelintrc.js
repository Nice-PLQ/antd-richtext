module.exports = {
  extends: ['stylelint-config-standard-scss'],
  rules: {
    'block-no-empty': true,
    'color-no-invalid-hex': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind']
      }
    ]
  },
};
