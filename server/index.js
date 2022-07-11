const path = require('path')
const cmdParam = require('./utils/cmdParam')
const Express = require('express')
const resHandler = require('./res-handler')
const app = new Express()
const bodyParser = require('body-parser')
const currentDir = __dirname

function resolve (base, args) {
  args = Array.from(args)
  args.unshift(base)
  args.unshift(currentDir)
  return path.join.apply(path, args)
}

global.path = {}
global.path.root = function () { return resolve('../', arguments) }
global.path.server = function () { return resolve('/', arguments) }
global.path.api = function () { return resolve('api', arguments) }
global.path.common = function () { return resolve('common', arguments) }
global.path.db = function () { return resolve('data-base', arguments) }
global.path.utils = function () { return resolve('utils', arguments) }

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.all('*', function (req, res, next) {
  // res.header('Content-Type', 'text/plain; charset=utf-8')
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/builder/builded', resHandler(require('./api/builded')))
app.post('/builder/stage', resHandler(require('./api/stage')))
app.post('/builder/delete', resHandler(require('./api/delete')))
app.get('/builder/view-data', resHandler(require('./api/view-data')))
app.get('/builder/projects', resHandler(require('./api/projects')))
app.get('/builder/branchs', resHandler(require('./api/branchs')))
app.listen(cmdParam('port') || 8888)
