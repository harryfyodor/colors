var http = require('http')
var Express = require('express') 
var webpack = require('webpack')
var path = require('path')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var bodyParser = require('body-parser')

var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session);
var logger = require('morgan')

var routes = require('./routes')
var settings = require('./settings')
var app = new Express()
var port = 3000

var config 

// process.env.NODE_ENV = 'production'

if (process.env.NODE_ENV === 'production') {
  config = require('./webpack.config.prod')
} else {
  config = require('./webpack.config.dev')
}

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser())
app.use(session({
    secret: settings.cookieSecret,
    store: new MongoStore({
      /*db: settings.db,
      host: settings.host,
      port: settings.port*/
      url: 'mongodb://localhost/color'
    }),
    resave: true,
    saveUninitialized: true
}))

// 需要验证
app.get('/api/tags', routes.authorize)
app.get('/api/begin', routes.authorize)
app.get('/api/cancel', routes.authorize)
app.get('/api/events', routes.authorize)
app.get('/api/degree', routes.authorize)

app.get('/api/tags', routes.tags)
app.get('/api/begin', routes.begin)
app.get('/api/cancel', routes.cancel)
app.get('/api/events', routes.getEvents)
app.get('/api/rank', routes.rank)
app.get('/api/degree', routes.degree)

app.get("/favicon.ico", function(req, res) {
  res.sendFile(path.join(__dirname, 'favicon.ico'))
})

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, process.env.NODE_ENV === 'production' ? 'index.html':'index-dev.html'))
})

// 需要验证
app.post('/api/logout', routes.authorize)
app.post('/api/setting', routes.authorize)
app.post('/api/edit', routes.authorize)
app.post('/api/finish', routes.authorize)

app.post('/api/login', routes.loginUser)
app.post('/api/register', routes.register)
app.post('/api/activate', routes.activate)
app.post('/api/logout', routes.logout)
app.post('/api/forget', routes.forgetPw)
app.post('/api/setting', routes.setting)
app.post('/api/edit', routes.editEvent)
app.post('/api/finish', routes.finish)

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})

// 供测试使用
module.exports = app