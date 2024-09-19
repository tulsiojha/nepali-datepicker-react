/* eslint-disable @typescript-eslint/no-var-requires */
// @ts-ignore
const { build } = require('esbuild');
const { sassPlugin } = require('esbuild-sass-plugin');
const { peerDependencies } = require('./package.json');

const entryFile = './src/datepicker/index.ts';
const shared = {
  bundle: true,
  entryPoints: [entryFile],
  loader: { '.js': 'jsx' },
  // Treat all dependencies in package.json as externals to keep bundle size to a minimum
  external: Object.keys(peerDependencies),
  logLevel: 'info',
  minify: true,
  sourcemap: false,
  plugins: [sassPlugin()],
};

build({
  ...shared,
  format: 'esm',
  outfile: './dist/index.mjs',
  target: ['esnext', 'node20.6.0'],
});

build({
  ...shared,
  format: 'cjs',
  outfile: './dist/index.js',
  target: ['esnext', 'node20.6.0'],
});
