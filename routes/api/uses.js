const Router = require('koa-router')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')

const User = require('../../models/User')
const tools = require('../../config/tools')
const keys = require('../../config/keys')
const validateRegistInput = require('../../validator/register')

const router = new Router()

/**
 * @route GET api/users/test
 * @desc 测试接口地址
 * @access 接口是公开的
 */
router.get('/test', async ctx => {
    ctx.status = 200
    ctx.body = {
        msg: 'users test is run'
    }
})

/**
 * @route GET api/users/register
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
    const { email, name, password } = ctx.request.body;
    const findEmail = await User.find({email:  ctx.request.body.email})
    if( findEmail.length > 0 ) {
        ctx.status = 500
        ctx.body = { msg: "邮箱已被注册" }
    } else {
        const { errors, isValid } = validateRegistInput(ctx.request.body)
        const avatar = gravatar.url(email, {s: '200', r: 'pg', d: 'mm'});
        const enPass = tools.enbcrypt(password)

        // 判断是否验证通过
        if(!isValid){
            ctx.status = 404
            ctx.body = errors
            return
        }

        const newUser = new User({
            name,
            email,
            avatar,
            password: enPass
        })
        // 存储到数据库
       await newUser
       .save()
       .then(user => {
        ctx.body = user
       })
       .catch(err => {
           console.log('err', err)
       });
       // 返回json数据
        ctx.body = newUser
    }
})


/**
 * @route GET api/users/login
 * @desc 注册接口地址
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
    const { email, password } = ctx.request.body
    const findRes = await User.find({email})
    const user = findRes[0]

   if(findRes.length > 0){
       const checkRes = await bcrypt.compareSync(password, user.password)

       // 验证通过
       if(checkRes){
            // 生成token
            const payload = {
                 id: user.id,
                 name: user.name,
                 avatar: user.avatar
            }

            const token = jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 }
            )

            ctx.status = 200
            ctx.body = { success: "登录成功", token: token }
       } else {
            ctx.status = 400
            ctx.body = { password : "密码错误"}
       }

   } else {
        ctx.status = 404
        ctx.body = "该邮箱未注册"
   }
})

/**
 * @route GET api/users/current
 * @desc 用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get('/current', passport.authenticate('jwt', { session: false }), async ctx => {
    // passport.authenticate('jwt', { session: false }) 会监听paassport jwt_payload
    console.log('state', ctx.state)
    const {id, name, avatar, email} = ctx.state.user.user
    ctx.body = {
        id,
        name,
        avatar,
        email
    }

})
module.exports = router.routes()