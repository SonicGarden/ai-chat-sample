/** @type {import("stylelint").Config} */
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  plugins: ['stylelint-order'],
  rules: {
    'comment-empty-line-before': null,
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
  },
  allowEmptyInput: true,
};
