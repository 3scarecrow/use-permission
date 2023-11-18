import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { dts } from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/use-permission.umd.min.js',
      format: 'umd',
      name: 'use-permission',
    },
    plugins: [
      typescript(),
      resolve(),
      buble({
        objectAssign: 'Object.assign'
      }),
      terser()
    ],
    external: ['vue'],
  },{
    input: 'src/index.ts',
    plugins: [dts()],
    output: {
        format: 'esm',
        file: 'dist/use-permission.d.ts',
    },
  }
]