const Koa = require('koa');
const Router = require('koa-router')
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const passport = require('koa-passport')
const db = require('./config/keys').mongoURI

// 实例化 Koa 和 Router
const app = new Koa()
const router = new Router()
app.use(bodyParser());

const users = require('./routes/api/uses')

// 路由
router.get('/', async ctx => {
    ctx.body = {
        msg: 'hello koa interface'
    }
})


mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongodb connected!!')
    })
    .catch((err) => {
        console.log('mongo err', err)
    })

// 配置路由地址   只要访问localhost:5000/api/users 就会进入/api/users来找这个路由
router.use('/api/users', users)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

app.use(passport.initialize())
app.use(passport.session())

// 回调到config文件中 passport.js
require('./config/passport')(passport)

const port = process.env.PORT || 5000

app.listen(port,  () => {
    console.log(`server started on ${port}`)
})