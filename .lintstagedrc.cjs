// .lintstagedrc.cjs
module.exports = {
    '*.{js,jsx}': ['eslint --fix', 'prettier --write'],
    '*.{json,md}': ['prettier --write'],
  };