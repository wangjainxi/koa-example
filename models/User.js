const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// 实例化数据模块
const UserSchema =new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avart: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        default: Date.now
    },
})

module.exports = user = mongoose.model("users", UserSchema)