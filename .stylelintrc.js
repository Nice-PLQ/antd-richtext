module.exports = {
  extends: [],
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
