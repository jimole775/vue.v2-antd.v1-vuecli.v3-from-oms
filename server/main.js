const cmdParam = require('./utils/cmd-param')
const Express = require('express')
const resHandler = require('./res-handler')
const app = new Express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('hello world')
})

app.post('/build', resHandler(require('./builder')))
app.listen(cmdParam('port') || 8888)
