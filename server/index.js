require('./config')
const cmdParam = require('./utils/cmdParam')
const Express = require('express')
const resHandler = require('./res-handler')
const app = new Express()
const bodyParser = require('body-parser')
const port = 8888
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
app.listen(cmdParam('port') || port)

console.info('app is start! port: ', port)
