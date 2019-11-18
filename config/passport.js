const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
opts = {}

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey
const mongoose = require('mongoose')
const User = mongoose.model('users')

module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        // 当调用了passport的某一个验证的方法，jwt_payload才能被打印出来
        // console.log('jwt_payload', jwt_payload)
        const user = await User.findById(jwt_payload.id)
        if(user){
            // 哪里调就返回到哪里
            return done(null, {user})
        } else {
            return done(null, false)
        }
    }));
}