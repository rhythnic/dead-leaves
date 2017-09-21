import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

var env = process.env.NODE_ENV
var config = {
  output: { format: 'umd' },
  name: 'DeadLeaves',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**'
    })
  ]
}

if (env === 'production') {
  config.plugins.push(uglify())
}

export default config
