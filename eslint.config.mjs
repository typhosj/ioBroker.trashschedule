import config from '@iobroker/eslint-config';

export default [
    ...config,
    {
        ignores: [
            '.dev-server/',
            '.vscode/',
            '*.test.js',
            '**/*.test.js',
            'test/**/*.js',
            '*.config.mjs',
            'build',
            'dist',
            'admin/build',
            'admin/words.js',
            'admin/admin.d.ts',
            'admin/blockly.js',
            '**/adapter-config.d.ts',
            'widgets/**/*.js',
            'widgets/**/*.ts',
        ],
    },
    {
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-param': 'off',
            'jsdoc/require-param-description': 'off',
            'jsdoc/require-returns-description': 'off',
            'jsdoc/require-returns-check': 'off',
            'jsdoc/reject-any-type': 'off',
            'jsdoc/check-tag-names': 'off',
            'jsdoc/check-types': 'off',
            'jsdoc/require-property-description': 'off',
        },
    },
];
