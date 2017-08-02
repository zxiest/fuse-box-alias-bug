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
  // } = require('../fuse-box')
} = require('fuse-box')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const res = rel => resolve(__dirname, rel)

// cli args
const opts = {
  boolean: [
    'run',
    'bundle',
    'cache',
    'sourcemaps',
    'debug',
    'production',
    'development',
    'help',
  ],
  number: ['port'],
  string: ['watch', 'hmr', 'NODE_ENV'],
  default: {
    debug: false,
    sourcemaps: false,
    watch: 'src/**',
    port: 4445,
    run: true,
    hmr: true,
    bundle: false,
    cache: true,
    hash: false,
  },
  alias: {
    help: ['h'],
    cache: ['c'],
    debug: ['d'],
    production: ['p'],
    port: ['dev'],
    fonts: 'build/fonts',
    images: 'build/images',
    img: 'build/images',
    shared: '~/src/shared',
    utils: '~/src/utils',
    auth: '~/src/auth',
    Console: '~/src/Console',
    stores: '~/stores',
    $: '~',
  },
}
let argv = fwf(process.argv.slice(2), opts)

// @TODO: can use `hash` for filenames if needed
let {port, watch, run, bundle, hmr, cache, hash, sourcemaps, debug, help} = argv
let {production, development, NODE_ENV} = argv
NODE_ENV = NODE_ENV || production ? 'production' : 'development'
if (NODE_ENV === 'production') production = true

// TODO: remove
production = true

if (production) cache = false
// cache = false

// setup
const dist = `${__dirname}/build/`
const browsers = ['> 1%', 'ie >= 8']
const autoprefixerPlugin = autoprefixer({browsers})
const cssnanoPlugin = cssnano({reduceIdents: false})
let postcssConfig = []

// @NOTE: always enabled,
// @ABDO if it makes any issues mapping styling, just comment out
// if (production)
postcssConfig = [autoprefixerPlugin, cssnanoPlugin]

const cssResourcePluginConfig = {
  // @see comment below with img base64
  // inline: true,
  macros: {
    build: dist,
    $build: dist,
  },
  dist,
}
const babelPresetEnv = [
  'env',
  {
    targets: {
      browsers,
      uglify: true,
    },
    debug: true,
  },
]

// debugging
log.fmtobj({production, development, NODE_ENV}).echo()
if (help) log.fmtobj(argv).bold('--help ').exit()
console.log(autoprefixerPlugin.info())

// build config
let fuse = new FuseBox({
  cache,
  // cache: true,
  log: debug,
  debug,
  homeDir: './',
  alias: {
    fonts: '~/build/fonts',
    images: '~/build/images',
    img: '~/build/img',
    libs: '~/src/libs',
    listview: '~/src/components/abstract/List.jsx',
    chain: '~/src/console/chain.jsx',
    console: '~/src/console',
    actions: '~/src/actions',
    components: '~/src/components',
    reducers: '~/src/reducers',
    utils: '~/src/utils',
  },
  // sourcemaps: true,
  output: 'build/$name.js',
  // modulesFolder: 'modules',
  plugins: [
    EnvPlugin({NODE_ENV}),
    JSONPlugin(),
    BabelPlugin({
      // limit2project: false,
      config: {
        sourceMaps: true,
        // @NOTE: can change back to this if needed
        // 'es2015', 'stage-2',
        presets: ['react', babelPresetEnv],
        plugins: [
          'babel-plugin-transform-decorators-legacy',
          'babel-plugin-transform-class-properties',
          'babel-plugin-transform-object-rest-spread',
          'babel-plugin-transform-es2015-spread',
        ].map(require.resolve),
      },
    }),
    WebIndexPlugin({
      template: 'index.html',
    }),
    [
      SassPlugin({
        indentedSyntax: false,
        sourceComments: true,
        errLogToConsole: true,

        // @NOTE: for replacing paths
        // importer: true,
        // macros: {
        //   $build: dist,
        //   build: dist,
        // },
      }),
      // CSSResourcePlugin(cssResourcePluginConfig),
      // http://fuse-box.org/plugins/postcss-plugin#postcss-plugin
      // https://github.com/fuse-box/fuse-box/blob/master/src/plugins/stylesheet/PostCSSPlugin.ts
      PostCSSPlugin(postcssConfig),
      CSSPlugin({
        group: 'app.css',
        outFile: res(`build/app.css`),
      }),
    ],
    [
      CSSResourcePlugin(cssResourcePluginConfig),
      PostCSSPlugin(postcssConfig),
      CSSPlugin({
        group: 'seess.css',
        outFile: res(`build/seess.css`),
      }),
    ],
    // @NOTE: is for loading it alone without resources when needed
    // ...but inlining our images and fonts makes style file ~1mb so.
    //
    // CSSPlugin({
    //   group: 'seess.css',
    //   outFile: res(`build/seess.css`),
    // }),
    // ImageBase64Plugin(),
  ]//.concat(production ? [UglifyJSPlugin()] : []),
})

if (!production) fuse.dev()

const bundler = fuse.bundle('bundle').instructions(
  `> src/index.jsx
    +[node-modules/react-toolbox/**/*.sass]
    +[src/stylesheets/**/*.sass]
    +[src/stylesheets/**/*.css]
    `
)

if (!production) bundler.sourceMaps({project: true, vendor: false})
if (!production) bundler.watch('src/**').hmr()

fuse.run()
