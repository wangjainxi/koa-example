const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = function validateRegistInput(data){
    let errors = {}

    if(!Validator.isEmpty(data.name)){
        errors.name = "name不能为空"
    }

    if(!Validator.isLength(data.name, {min: 2, max: 30})){
        errors.name = "name长度不能小于2，且长度不能大于30"
    }

    if(!Validator.isEmpty(data.email)){
        errors.name = "邮箱不能为空"
    }

    if(!Validator.isEmail(data.email)){
        errors.name = "邮箱不符合规则"
    }

    if(!Validator.isLength(data.password, {min: 2, max: 30})){
        errors.name = "密码长度不能小于2，且长度不能大于30"
    }

    if(!Validator.isEmpty(data.password2)){
        errors.name = "password2不能为空"
    }

    if(!Validator.equals(data.password, data.password2)){
        errors.name = "两次密码不一样"
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}