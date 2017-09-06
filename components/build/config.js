import path from 'path'
import node from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import aliases from './alias.js'

const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

const builds = {
  build: {
    plugins: [
      uglify(),
    ],
  },
  dev: {
    sourcemap: 'inline',
  },
}

function genConfig(opts) {
  const config = {
    input: resolve('src/js/index.js'),
    output: {
      name: 'components',
      file: 'dist/js/components.js',
      format: 'umd',
    },
    plugins: [
      node(),
      babel({
        include: resolve('src'),
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
    ].concat(opts.plugins || []),
  }

  Object.keys(opts).forEach(key => {
    if (key === 'plugins') return
    config[key] = opts[key]
  })

  return config
}

let config
if (process.env.TARGET) {
  config = genConfig(builds[process.env.TARGET])
} else {
  console.error('Usage: rollup --environment TARGET:[target]')
}

export default config
