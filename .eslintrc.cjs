// .eslintrc.cjs
module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'prettier' // Make sure prettier is last to override other configs
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', 'import'],
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'warn', // Warn about missing prop types
      'react/display-name': 'off',
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      
      // Hook rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // General rules
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      
      // Import rules
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-named-as-default': 'off', // Turn off this rule globally
    },
    // Ignore certain files and folders
    ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/'],
  };