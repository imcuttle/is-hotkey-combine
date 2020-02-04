import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'index.js',
    output: [
      { file: pkg.module, format: 'es' },
      { file: pkg.main, format: 'cjs' },
    ],
    plugins: [
      babel({
        babelrc: true,
      })
    ]
  }
];
