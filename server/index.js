const cmdParam = require('./utils/cmd-param')
const Express = require('express')
const resHandler = require('./res-handler')
const app = new Express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  next()
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/build', resHandler(require('./api/builder')))
app.listen(cmdParam('port') || 8888)
