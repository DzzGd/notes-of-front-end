## 传统的问题

+ 同一页面引入多个js(`<script>`)文件, 不便于维护
+ js文件间互相引用属性变量没有门槛, 没有引用机制, 引用关系复杂

## webpack 是什么

+ Bulndler 模块打包工具

## 配置文件

将会以 webpack 默认配置文件打包
```shell
npx webpack
```


默认自定义配置文件 `webpack.config.js`
```shell
npx webpack
```

`webpack.config.js`:

```javascript
const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}
```


指定自定义配置文件

```shell
npx webpack --config _webpackconfig.js
```

## 设置package.json的script脚本

```
"scripts": {
  "build": "webpack"
}
```

## webpack-cli作用

让 `webpack` 和 `npx webpack` 指令可用

## 打包输出内容

`Chunks:` 打包的Id

`Chunk Names:` 打包名称

## Loader 是什么

是一种打包方案, 告诉 `webpack` 怎么打包指定(`.png`, `.txt`, `.avi`...)的文件

添加 module对象在 配置文件中

```javascript
const path = require('path')
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [ // 处理各种格式文件 规则
      {
        test: /\.jpg$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  }
}
```

## loader 打包图片

### fileLoader

文件路径打包工具, `options` 功能:

```javascript
module: {
  rules: [
    {
      test: /\.(jpg|png|gif)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name]_dz.[ext]', // 表示placeholder, 占位符,
          chunkFilename: '[name].chunk.js', // 非入口文件的其他文件 输出文件名
          outputPath: 'images/' // 打包到指定目录
        }
      }
    }
  ]
}
```


**name:** 表示打包后的名称, 其中值为一个字符串 `[].[]` 中的 `[]` 表示placeholder, 占位符, 以怎样的名称打包

比如引入源文件 `cxx.jpg`

```javascript 
import jpg from './cxx.jpg'
```

打包后的图片名称就是: `cxx_dz.jpg`

它还可以是一个 `函数`, 最终还是需要返回一个 `placeholder` 字符串

```javascript
options: {
  name: function (resourcePath, resourceQuery) {
    // `resourcePath` - `/absolute/path/to/file.js`
    // `resourceQuery` - `?foo=bar`
    if (process.env.NODE_ENV === 'development') {
      return '[path][name].[ext]';
    }
    return '[contenthash].[ext]';
  }
}
```

**outputPath:** 表示打包后的路径, 并且通过`模块引入`时自动带上路径名

```javascript
import img from './cxx.jpg'
console.log(img) // -->  images/cxx.jpg
```

同样, 它也可以是一个 `函数`:

```javascript
options: {
  name: '[name]_dz.[ext]',
  outputPath: function (url, resourcePath, context) {
  // url -> cxx_dz.jpg
  // `resourcePath` is original absolute path to asset
  // `context` is directory where stored asset (`rootContext`) or `context` option

  // To get relative path you can use
  // const relativePath = path.relative(context, resourcePath);
    return `images/${url}`
  }
}
```

其中参数 `url` 表示, 经过 `options`中 `name`占位符转换后的文件名称路径, 说白了也就是转换后的文件名(可能会带上了路径)

### url-Loader

和 `file-loader` 具有相同的功能, 多了一个图片处理(limit)的配置项

```javascript
options: {
  name: '[name]_dz.[ext]', // 表示placeholder, 占位符,
  outputPath: 'images/', // 打包到指定目录
  limit: 40480 // 单位字节b, 
}
```

+ limit: 表示图片大于 `limit` 值时, 将会把完整图片打包到 `dist`, 否则将会 把图片转成 `base64` 格式打包到 `bundle.js` 中

## 打包样式

### css-loader

```javascript
{
  test: /.css$/,
  use: ['style-loader', 'css-loader']
}
```

要使用两个loader来打包样式, 因此 `use` 是一个数组

**css-loader:**, 分析出各个 css 文件之间的关系, 最终合并成一个css
**style-loader:**, 将解析出css文件挂载到页面中的 `style` 中

穿插一个 node-sass 包的方法, 在目录下 建一个 `.npmrc` 的文件 添加一下配置

```
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
electron_mirror=https://npm.taobao.org/mirrors/electron/
registry=https://registry.npm.taobao.org
```

### sass-loader

同样处理 `sass` 样式的 `loader` 为 `sass-loader`, 但是要安装 `node-sass`, `sass-loader`(如果是scss还需安装`scss-loader`)

```shell
npm i node-sass sass-loader scss-loader -D
```

并且配置webpack

```javascript
{
  test: /.(scss|css)$/,
  use: ['style-loader', 'css-loader', 'sass-loader']
}
```

注意 scss 和 css 的配置项不能同时存在, 会报错. 因为 sass-loader 已经具备了处理css的能力

+ 遇到 sass 文件, 首先会使用sass-loader 进行翻译, 成 css 文件
+ 然后 css-loader再集中css文件
+ style-loader再挂载到页面中去

### 自动添加厂商前缀 postcss-loader

通过 新添加 `postcss.config.js` 文件并配置:

```javascript
module.exports = {
  plugins: [
    require('autoprefixer')
  ]
}
```

`autoprefixer` 是一个自动配置 postcss的库

### 样式打包的串联性

如果有 `index.scss` , `head.scss`, `base.css` 3个样式文件, 其中 index.scss 为:

```css
@import './head.scss';
@import './base.css';
```

打包时, 遇到 `@import './base.css'` 时不会去运行 `post-loader` 和 `sass-loader`, 因此需要做一些改进

```javascript
{
  test: /.(css|scss)$/, // 需要注意的是 这里的 test 要同时满足 css, scss 因为被sass-loader执行后会被转换成css, 如果只有scss 就不会执行 @import 引入的里面的 postcss-loader相关转换
  use: ['style-loader', {
    loader: 'css-loader',
    options: {
      importLoaders: 2
    }
  }, 'sass-loader', 'postcss-loader']
}
```

`importLoaders` 遇到 @ 时表示依然会去执行 `sass-loader`, `postcss-loader`这前面两个 `loader`

### 模块化 css

因为引入的样式具有全局性, 有可能引入的一个模块(js)同时引入了一个css样式, 但是在另一个模块(js)中并不想被其他的css样式影响, 因此需要和js模块一样不污染全局的思想, 引入 模块化css
```css
/* base  */
.box {
  background-color: red;
}
```
```javascript
import css from './base.css';

<div  id="div"> </div>

id.addClass(css.box)
```

## plugins 插件 提高打包便捷

在某些打包过程中节点中 实现某些操作
安装插件库 `html-webpack-plugin`

然后配置 `webpack.config.js` 选项

```javascript
module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      // ...
    ]
  plugins: [
    new htmlWebpackPlugin()
  ]
}
```

打包结束后, 自动生成一个html文件, 并把打包生成的js自动引入到html中

### 配置 html-webpack-plugin

```javascript
plugins: [
  new htmlWebpackPlugin({
    template: './src/index.html'
  })
]
```

+ template 找一个模板来作为最终打包的html文件, 先生成模板, 再注入 `script` 标签

## 删除 dist 目录内容

安装库 `clean-wenpack-plugin`

需要注意的是

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
```

中 `require()` 返回的是一个对象, 包含了 一个 `CleanWebpackPlugin` 方法

## Entry与Output基础配置

### Entry

打包的入口

```javascript
entry: {
  main: './src/index.js',
  sub: './src/index.js'
}
```

如果entry为一个对象, 那么每一个 key 都为 模块的名称, 如果 entry 为字符串, 默认为 `main`

### output

打包输出相关的配置

```javascript
output: {
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist'),
  publicPath: 'https://www.dzzlcxx.top/'
}
```

同样 输出的js模块包名可以用占位符 `[name].js` 来自定义文件名, name 为 entry 对象里的键名

`publicPath` 表示在htmlwebpackplugin打包是注入的 script 标签 里的 资源路径自动添加上 publicPath里的值

## sourcemap 配置

表示一个映射关系, 他知道dist目录下main.js文件的有问题的一行是在 src目录下原js文件的具体哪一行

```javascript
devtool: 'source-map
```

不同的值, 打包效率也会不同, 提示效果也不相同


如果是 `development` 然后打包的情况最好使用 `cheap-module-eval-source-map`

如果是 `production` 环境最好使用 `cheap-module-source-map`
+ source-map 表示将映射文件单独打包成一个文件
+ module 不仅打包业务代码的映射, 还包括loader和其它库
+ cheap 表示将只将映射的 行 进行打包, 不包括第几列, 并只打包业务代码
+ inline 表示将映射打包进js中

## DevServer 提升开发效率

之前打包时, 总是会先 `webpack` 命令打包, 然后再打开 `html` 查看效果, 这样效率非常低下.

### webpack -- watch

监听文件变化, 自动打包

配置 `package.json`

```javascript
"scripts": {
  "build": "webpack",
  "watch": "webpack --watch"
}
```

### DevServer

配置 `webpack.config.js`

```javascript
devServer: {
  contentBase: './dist',
  open: true,
  port: 8090
}
```

+ contentBase 表示开启的服务器根路径
+ open 表示运行 devserver 时, 自动打开浏览器
+ port 开启的服务器的端口号

然后开启 `devSver`, 配置 `package.json`

```javascript
"scripts": {
  "build": "webpack",
  "watch": "webpack --watch",
  "dev": "webpack-dev-server"
}
```

## Hot Module Replacement(hmr)

热模块替换, 当我们使用 devserver 时, 改变js文件时, 会直接刷新页面而不是, 局部修改我们的页面 这样带来很大开销 和 不便

因此使用 `hmr` 来进行 热更新

配置`webpack.config,js`

```javascript
const webpack = require('webpack')

// ... 

devServer: {
  contentBase: './dist',
  open: true,
  port: 8080,
  hot: true,
  hotOnly: true
}

// ...

plugins: [
  new wenpack.HotModuleReplacementPlugin()
]
```

在 js 文件热更新时候, 可以使 `module.hot` 来监听文件变化, 手动的进行一些局部热更新

```javascript
if (module.hot) {
  module.hot.accept('/xx.js', () => {
    // xxx()
    // xxx.sss()
  })
}
```

## Babel

转换ES6语法至ES5

安装 Babel 库

```shell
npm i babel-loader @babel/core
```


配置 `webpack.config.js` 

```javascript
modules: {
  ruels: [
    {
      test: /\.js$/,
      exclude: '/node_modules/',
      loader: 'babel-loader'
    }
  ]
}
```

+ `exclude` 排除文件下的 js 文件, 不进行转换
+ `babel-loader` 在打包js文件时进行语义上分析

如果需要 转换 还需要一个专门的库 `@babel/preset-env` 将es6
语法 翻译成 es5语法

```shell
npm i @babel/preset-env
```

并且添加 配置项

```javascript
  ruels: [
    {
      test: /\.js$/,
      exclude: '/node_modules/',
      loader: 'babel-loader',
      options: {
        preset: ['@babel/preset-env']
      }
    }
  ]
```

### @babel/polyfill

这样虽然能打包 `const` `() => {}` 等 ES6 语法, 但是要想转换 promise, map 等高级的语法, 还是需要 `@babel/polyfill`来进行使用


```javascript
// index.js
import '@bable/polyfill`
```
但是 `@babel/polyfill` 这个库 包含了 所有的新特性实现, 体积非常大, 因此需要进行按需引入

```javascript
options: {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '67' // 大于 Chrome 67版本环境中运行, 因此判断是否chrome67版本已经支持最新es6语法
        },
        useBuiltIns: 'usage'
      }
    ],
  ]
}
```

使用 `useBuildtIns: 'usage'` 根据业务代码, 注入 `polyfill` 相关的代码, 减少体积
**注意:** 配置了 `useBuildtIns: 'usage'` , 可以不用再业务代码中引入 `polyfill`代码了 `import '@babel/polyfill'`
targets 表示在什么样的浏览器以及浏览器版本下使用该业务代码, 如果某些浏览器支持新特性, 比如 chrome 的 67 版本以上, 就不需要转换es6语法了

以上方式 适合一些 业务项目进行 语法的转换, 但是对于 ui组件库或者类库或者第三方模块来说, `polyfill` 是通过`全局变量`的方式来弥补不支持的语法, 并不太合适

### @babel/plugin-transorm-runtime @babel/runtime

安装库:

```shell
npm i @babel/plugin-transform-runtime @babel/runtime
```
重新配置 Babel
```javascript
test: /\.js$/,
exclude: '/node_modules/',
loader: 'babel-loader',
options: {
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 2,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ]
  ]
}
```

如果其中 corejs 值为2 需要额外安装一个包

```shell
npm i @babel/runtime-corejs2
```

通过配置插件形式进行转换的结果 会使用闭包进行语法的代码的注入, 而不是全局的

### .babelrc

如果 babel 的配置内容太多影响了 `webpack.config.js` 排版, 结构不清晰, 将配置内容单独用 `.babelrc` 文件提出来, 进行使用

```javascript
// .babelrc
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

`@babel/plugin-transform-runtime` 同样也是根据业务代码所使用的到的ES6语法注入相关的转换代码, 以达到按需使用的目的

## babel实现对react代码打包

首先安装 react 的库

```shell
npm i react react-dom --save
```

然后写一些简单的 react 语法

```javascript
// index.js 

import '@babel/polyfill'
import ReactDom from 'react-dom'
import React, {Component} from 'react'

class App extends Component {
  render() {
    return (
      <div>hello world</div>
    )
  }
}

ReactDom.render(<App/>, document.getElementById('root'))
```

直接运行webpack直接报错, 因为目前的 babel 不只支持react某些语法的转义打包

需要安装 `@babel/preset-react` 这个包

```shell
npm i @babel/perset-react 
```

然后配置 `.babelrc`

```javascript
{
    "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": "67"
        },
        "useBuiltIns": "usage"
      }
    ],
    [
      "@babel/preset-react",
      {
        
      }
    ]
  ]
}
```

执行顺序是, 从下倒上, 从右到左的顺序, 先解析 jsx 等 react 语法, 再转换 es6 等 高级语法

## tree shaking

只有使用到的代码才会打包, 没有引入的不需要打包

**tree shaking 只支持 ES Module(静态引入)**

配置 `webpack.config.js`, 注意 `tree shaking` 只在 `mode` 为 `production` 模式下才有效, 添加一个 `optimization` 字段:

```javascript
  module: {
    // ...
  },
  optimization: {
    usedExports: true
  },
  plugins: [/*...*/]
```

表示开启 tree shaking

然后需要再配置 `package.json`:

```javascript
{
  "name": "webpack_study",
  "sideEffects": ["@bable/polly-fill", "*.css"],
  "version": "1.0.0",
  //...
  //...
  //...
}
```

其中 `"sideEffects": ["@bable/polly-fill"]` 表示对 `@bable/poly-fill`这个第三方库不进行 tree shaking原因是:

```javascript
import '@bable/poly-fill'
// tree shaking 发现并没有导出变量, 可能或忽略它
```

包括样式的导入

但我们业务代码没有引入类似 `@bable/polly-fill` 第三方库时, 只需要设置为 `false` 表示对所有文件执行 `tree shaking`

在 `production` 模式下 不添加 `optimization` 配置, 也会自动 执行 `tree shaking`

## Development和Production模式区分打包

新建 `webpack.common.config.js` `webpack.pro.config,js` `webpack.dev.config.js` 三个文件 放置到 `build` 文件中

然后分别把 开发环境 和 生产环境 共同需要的配置 放置到common 中, 然后将  开发环境 和 生产环境 分别需要的 放置到各自文件中

在 `package` 中 script 配置时 需要分别运行各自文件

```javascript
"scripts": {
  "dev-build": "webpack --config ./build/webpack.dev.config.js",
  "watch": "webpack --watch",
  "dev": "webpack-dev-server --config ./build/webpack.dev.config.js",
  "build": "webpack --config ./build/webpack.pro.config.js"
}
```

## code splitting

当我们引入其他 js文件库时, 没有代码分割, 将会将所有的文件打包到 bundle.js 中, 非常的大, 当业务代码改变时, 用户还会再一次去重新加载这个庞大的文件

利用 webpack 的分割, 将静态的 js 文件打包成一个文件, 用户下一次加载时 直接使用缓存


* 同步代码时配置代码分割, 结合`splitChunks` + `同步代码`
  ```javascript
  // index.js
  import _ from 'lodash'
  console.log(_.join(['dz', 'is', 'good'], ' '))
  ```

  ```javascript
  // webpack.config.js
  module.exports = {
    entry: {
      main: './src/index.js'
    },
    // ...
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }

  ```
  
  此时代码会打包成两个js文件:  
  1. main.js
  2. vendor~main.js

* 异步代码时配置代码分割, 结合 `babel-plugin-dynamic-import-webpack插件` + `异步import代码`
  ```javascript
  // index.js
  function getLodash() {
    return import('lodash').then(({ default: _ }) => {
      const div = document.createElement('div')
      console.log(_)
      div.innerHTML = _.join(['dzz', 'gd'], '-').toString()
      return div
    })
  }

  getLodash().then(element => {
    console.log('div')
    document.body.appendChild(element)
  })
  ```

  ```javascript
  //.babelrc
  {
    "plugins": [
      [
        "dynamic-import-webpack"
      ]
    ]
  }
  ```

### solitChunksPlugin配置参数

1. 使用magic comment 魔法注释

  ```javascript
  // index.js
  function getLodash () {
    // 此处的注释起到了命名作用
    return import(/* webpackChunkName:"lodash" */ 'lodash').then(({ default: _ }) => {
      const div = document.createElement('div')
      console.log(_)
      div.innerHTML = _.join(['dzz', 'gd'], '-').toString()
      return div
    })
  }
  ```
  会发现打包后名称没有变化, 是因为使用的 `babel-plugin-dynamic-import-webpack` 插件并非官方提供的插件, 因此需要安装官方插件 `@babel/plugin-syntax-dynamic-import`

  配置.babelrc
  ```javascript
  "plugins": ["@babel/plugin-syntax-dynamic-import"]
  ```

  此时打包出来的文件名称是 `vender~loadash.js`, 而不是 `lodash.js`
  需要添加 splitChunk 的配置

  ```javascript
  // 不管同步还是异步代码分割都需要执行这里的 配置
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vender: false,
      default: false
    }
  }
  ```

  如果没有配置splitChunks, webpack 会有默认配置:

  ```javascript
  splitChunks: {
    chunks: 'initial', 
    minSize: 20000,
    minRemainingSize: 0,
    maxSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    automaticNameDelimiter: '~',
    enforceSizeThreshold: 50000,
    cacheGroups: {
      vendors: {
        test: /[\\/]node_modules[\\/]/,
        priority: -10
      },
      default: {
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
  ```
  * `chunks:`单独打包异步(async)还是同步(initial)代码, 或者两者(all)
  * `cacheGroups`: 打包文件的配置项  
    - `vendors`: 表示一个组, 需要打包的文件都打包到 vendors 这个组(文件)中
    - 当代码为同步打包时, chunks设置(all, inital)也检测通过, 也会去检测cacheGroups的配置, 当 vendors, default 为 `false` 时, 也不会进行单独打包
    - `test`: 表示匹配引入哪里的文件会被单独打包出来
    - `filename`: 为同步代码打包文件命名, 如果是异步, 并且采用了 magic comment, 就会将 `automaticNameDelimiter` 作为连接符, 连接 `vendors` 组名和magic comment设置的名称
    - `default`: 表示在遇到cacheGroups配置组时, 不满足人一个组的规则, 此时就会执行 default 这个组
    - `reuseExistingChunk`: 某个文件如果已经被其他缓存组打包, name就不再进行打包, 而是进行引用
  * `minSize`: 需要被打包的文件的文件大小(k)至少大于 minSize 才能被打包
  * `maxSize`: 同理被打爆的文件需要至少小于maxSize 才能被打包, 如果某个文件大于 maxSize webpack会尝试进行2次分割
  * `minChunks`: 表示引用次数达到 minChunks 才进行打包
  * `maxAsyncRequests` 最大的js文件数请求数量, 就就是打包数量
  * `maxInitialRequests` 入口文件最大的引入并且打包的数量
  * `automaticNameDelimiter` 文件生成的连接符


```
当遇到同步代码时, 会进行cachegroups之外的配置项进行匹配, 满足条件后, 再进入cachegroups 进行匹配, 符合打包分组要求 才进行打包
```

## LazyLoading 懒加载

上面使用到的的 `import('lodash').then(...)` 可以进行懒加载使用, 在执行到 这语句时, 才会被请求资源然后再加载到页面, 返回的是一个 `promise` 类型, 因此可以使用 异步函数进行结果的接受

```javascript
async function getLodash () {
  const { default: _} = await import(/* webpackChunkName:"lodash" */ 'lodash')
  const div = document.createElement('div')
  div.innerHTML = _.join(['dzz', 'gd'], '-').toString()
  return div
  })
}
```

## Chunk

每一个被打包出来的文件都是一个chunk

## 打包分析 analyse

1. 官方网页打开  
    * 添加打包配置项  
      ```
      "dev-build": "webpack --profile --json > stats.json --config ./build/webpack.dev.config.js"
      ```  
    * 打开生成的json文件

      打开网站: `http://webpack.github.io/analyse/`

      然后倒入json文件

2. 使用优秀的webpack插件库 `webpack-bundle-analyzer`
    * 安装: `npm install webpack-bundle-analyzer`
    * 配置webpack:
      ```js
      const webpackBundleAnalyzer = require('webpack-bundle-analyzer')
      // ...
      plugins: [
        new webpackBundleAnalyzer.BundleAnalyzerPlugin({/* ... */})
      ]
      ```
## preloading, prefetching

默认不配置splitChunks, 即:

```javascript
splitChunks: {}
```

默认情况chunk为: async吗因此只打包异步的代码, 是希望增加异步代码, 减少首次打开网页的文件的大小, 将异步代码按需加载

使用 google 浏览器 里面的 coverage 工具可以看到js文件的使用率, 有些代码从首屏加载到结束 并没有使用, 因此可以将某些代码异步缓存起来, 需要使用的时候再加载

* 使用 webpack 自带的 prefetch 功能:

  在document文档加载完所有资源后, 带宽空闲时加载这个文件
  ```javascript
  document.addEventListener('click', () => {
    import( /* webpackPrefetch: true */ './click.js').then(({ a: func }) => {
      func()
    })
  })

  // 添加魔法注释, 并设置为 true
  ```

* 使用 preload 

使用方法和 prefetch 一样, 只是该文件, 是在主业务文件一起下载并执行


## CSS 文件分割

和 js 一样, css文件被打包时, 默认是 `css in js`, 因此需要打包插件 `mini-css-extract-plugin`

配置webpack:

```javascript
// webpack.pro.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module: {
  rules: [
    {
      test: /\.scss$/,
      use: [
        // 这里就不再需要 styleloader 了
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
        }
      ]
    },
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    }
  ]
},
plugins: [
  new MiniCssExtractPlugin({})
]
```

`注意`如果配置了:

```javascript
optimization: {
  usedExports: true
}
```

就需要在 package.json 中配置 匹配规则, 不然的话不能将css单独打包出来

```json
{
  "sideEffects": [
    "*.css"
  ]
}
```

也可以配置 MiniCssExtractPlugin 配置项:

```javascript
new CleanWebpackPlugin({
  filename: '[name].css',
  chunkFilename: '[name].chunk.css'
})
```

如果被页面直接引用下, 会使用 `filename` 配置项, 如果是间接引用, 会走 `chunkFilename`

更多配置见 [详情](https://webpack.js.org/plugins/mini-css-extract-plugin/)

## performance

不打印提示信息

```javascript
// webpack.config.js
performance: false
```

## 浏览器缓存

在生产环境配置output时, 需要添加 `contenthash` 哈希值, 以达到让浏览器使用缓存(304)

```javascript
output: {
  filename: '[name].[contenthash].js',
  path: path.resolve(__dirname, '../dist'),
  // chunkFilename: '[name].chunk.js', 
  publicPath: '/dist/'
}
```

## shimming

因为node是基于模块化的, 因此模块之间的变量不能共用, 然而很多模块都是用同一个库的时候需要手动引入比较麻烦, 因此可以采用 webpoack提供的方法来 自动`垫片`

```javascript
// webpack.cinfig.js
plugins: [
  new webpack.ProvidePlugin({
    _: 'lodash'
  })
]
```

同时, 属性值也可以是个数组, 作用是一次调用里面的方法

```javascript
plugins: [
  new webpack.ProvidePlugin({
    _join: ['lodash', 'join']
  })
]
```

### 模块里面this指向

模块里面的 `this` 指向 `undefined`, 通过插件 `imports-loader` 可以让this指向window

```javascript
loader: 'imports-loader?this=>window'
```

## 环境变量的使用

可以是用 webpack 打包时后的环境变量, 来判断当前打包的时候的环境, 配置 webpack


配置package.json, 添加 `--env.production`

```json
"scripts": {
  "dev-build": "webpack --config ./build/webpack.common.config.js",
  "watch": "webpack --watch",
  "dev": "webpack-dev-server --config ./build/webpack.common.config.js",
  "build": "webpack --env.production --config ./build/webpack.common.config.js",
  "start": "webpack-dev-server"
}
```

```javascript
//webpack.common.config.js
module.exports = (env) => {
  if (env && env.production) { // 默认 env.production 为 true
    return merge(prodConfig, commonConfig)
  } else {
    return merge(devConfig, commonConfig)
  }
}
```

也可以添加自定义的属性值: `"build": "webpack --env.production=''production' --config ./build/webpack.common.config.js"`

## Library的打包

当我们打包生成的是一个库, 而不是业务代码,这个时候打包的时候就需要配置:

```javascript
const path = require('path')
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    libraryTarget: 'umd', // universal 通用
    library: 'library'
  },
}
```

`libraryTarget: 'umd'` 就表示 通用, 任何引入方式都可以使用, 比如 esModule 的 import, 或者 commonJS 的 require, AMD, CMD 等等等

还有一种引入方法就是 通过 `<script src="library"></script>`

这时配置: `library: 'library'`, 进行全局变量的注入

```js
module.exports = {
  output: {
    libraryTarget: 'this', // universal 通用
    library: 'library'
  },
}
```

这个时候的意思就是 将library挂载到 全局中的 `this` 中去, 如果实在 浏览器中, 那么就是 window.library

还可以取值: `window`, `global` 等等等

* 当我们的库引入其他第三方库时

这个时候打包的体积就会变大, 但是如果别人用我们的库的时候, 也引入了这个第三方库, 那么业务代码就会打包两次 第三方库, 因此我们可以配置:

```javascript
module.exports = {
  // ...
  externals: ['lodash'],
}
```

这个时候表示, 我们的代码遇到 `lodash` 时候, 将不会打包这个库

也可以是个对象:

```javascript
module.exports = {
  // ...
  externals: {
    root: '_', // 在浏览器中, 在全局变量中必须要有 _ 这个变量名称
    commonjs: 'lodash'
  },
}
```
表示在 commonjs 环境中, 代码引入lodash时 只能是 `lodash` 命名:

```javascript
const lodash = require('lodash)

// 不能是 const _ = require('lodash) 这样
```

## 注册npm账号

打开[官方]()网站,