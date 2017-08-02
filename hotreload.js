const {resolve} = require('path')
const fwf = require('funwithflags')
const log = require('fliplog')

const {
  FuseBox,
  SVGPlugin,
  CSSPlugin,
  PostCSSPlugin,
  WebIndexPlugin,
  BabelPlugin,
  SassPlugin,
  JSONPlugin,
  CSSModules,
  EnvPlugin,
  UglifyJSPlugin,
  ImageBase64Plugin,
  CSSResourcePlugin,
  QuantumPlugin,
} = require('fuse-box')

const res = rel => resolve(__dirname, rel)
const babelPresetEnv = ['env', {targets: {chrome: 59}}]

// build config
let fuse = new FuseBox({
  cache: true,
  homeDir: './',
  log: false,
  alias: {
    fonts: 'build/fonts',
    images: 'build/images',
    img: 'build/images',
    shared: '~/src/shared',
    utils: '~/src/utils',
    auth: '~/src/auth',
    Console: '~/src/Console',
    stores: '~/stores',
    $: '~'
  },
  //
  //libs: '~/libs',
    // listview: '~/components/abstract/List.jsx',
    // chain: '~/console/chain.jsx',
    // console: '~/console',
    // actions: '~/actions',
    // components: '~/components',
    // reducers: '~/reducers',
    // utils: '~/utils',

  // sourcemaps: true,
  output: 'build/$name.js',
  // modulesFolder: 'modules',
  plugins: [
    EnvPlugin({NODE_ENV: 'development'}),
    JSONPlugin(),
    BabelPlugin({
      config: {
        // sourceMaps: true,
        presets: ['react', babelPresetEnv],
        plugins: [
          'babel-plugin-transform-decorators-legacy',
          'babel-plugin-transform-class-properties',
          'babel-plugin-transform-object-rest-spread',
          'babel-plugin-transform-es2015-spread',
        ].map(require.resolve),
      },
    }),
          // 'babel-plugin-module-resolver',
    WebIndexPlugin({
      template: 'index.html',
    }),
    [
      SassPlugin({
        indentedSyntax: false,
        sourceComments: true,
        errLogToConsole: true,
      }),
      CSSPlugin({}),
    ],
    [CSSPlugin({})],
  ],
})

fuse.dev()

const bundler = fuse.bundle('bundle').instructions(
  `> src/index.jsx
    +[node-modules/react-toolbox/**/*.sass]
    +[src/**/*.scss]
    +[src/**/*.sass]
    +[src/**/*.css]
    `
)

// bundler.sourceMaps({project: true, vendor: false})
bundler.watch('src/**').hmr()
fuse.run()
